#!/usr/bin/env python3
"""
scan_emojis.py  —  Waterborne emoji detector.

Walks a project directory and reports every emoji (and emoji-like pictographic
character) found in text files. Doubles as a verification gate:

    exit 0  -> clean, no emojis found
    exit 1  -> emojis found (details printed)
    exit 2  -> usage / runtime error

USAGE
    python scan_emojis.py                 # scan current directory
    python scan_emojis.py --root ./src    # scan a subtree
    python scan_emojis.py --json          # machine-readable output
    python scan_emojis.py --no-docs       # skip .md / .mdx / .txt files
    python scan_emojis.py --exclude e2e   # add an extra ignored dir name

DESIGN NOTES (read before editing the ranges)
- The ranges below deliberately EXCLUDE characters that are legitimate in code
  and prose, so we do not generate false positives:
    arrows  -> U+2190..U+21FF  (e.g. the rightwards arrow used in docs)
    bullet  -> U+2022          (the preferred bullet character)
    dashes  -> en / em dash, figure dash
    math    -> times, divide, plus-minus, degree
    (c)(r)  -> copyright / registered / trademark
  If you "fix" the scanner by widening ranges into these blocks, you will start
  rewriting valid arrows and bullets. Do not.
- unicodedata.name() is printed for every hit so the caller can choose a
  semantic replacement without guessing what the glyph is.
"""

import argparse
import json
import os
import sys
import unicodedata

# ---------------------------------------------------------------------------
# Emoji / pictograph code-point ranges (inclusive). Tuned for low false
# positives in source code and Markdown. See DESIGN NOTES above.
# ---------------------------------------------------------------------------
RANGES = [
    (0x1F000, 0x1FAFF),  # main pictograph sweep: mahjong, dominoes, cards,
                         # misc symbols & pictographs, emoticons, transport,
                         # supplemental symbols, symbols & pictographs ext-A,
                         # regional indicator flags (1F1E6..1F1FF)
    (0x2600,  0x26FF),   # Miscellaneous Symbols  (sun, star, warning, etc.)
    (0x2700,  0x27BF),   # Dingbats               (check, cross, scissors...)
    (0x231A,  0x231B),   # watch, hourglass
    (0x23E9,  0x23FA),   # media controls, alarm clock, timer, stopwatch
    (0x2B00,  0x2BFF),   # arrows-ext incl. star(2B50)/circle(2B55)/squares
    (0x2934,  0x2935),   # curved emoji arrows
    (0x3030,  0x3030),   # wavy dash
    (0x303D,  0x303D),   # part alternation mark
    (0x3297,  0x3299),   # circled ideograph congratulation / secret
    (0x24C2,  0x24C2),   # circled M
]

# Characters that EXTEND an emoji cluster (joiners / modifiers / selectors).
EXTENDERS = set()
EXTENDERS.update(range(0x1F3FB, 0x1F400))  # skin-tone modifiers
EXTENDERS.add(0x200D)                      # zero-width joiner
EXTENDERS.add(0xFE0F)                      # variation selector-16 (emoji style)
EXTENDERS.add(0xFE0E)                      # variation selector-15 (text style)
EXTENDERS.add(0x20E3)                      # combining enclosing keycap

# Directories never worth scanning.
DEFAULT_IGNORE_DIRS = {
    "node_modules", ".git", ".next", ".turbo", ".vercel", ".wrangler",
    ".open-next", "dist", "build", "out", "coverage", ".cache", ".svelte-kit",
    "vendor", ".venv", "venv", "__pycache__", ".idea", ".vscode",
    ".pnpm-store", "target",
}

# Exact filenames never worth scanning (lockfiles etc.).
IGNORE_FILES = {
    "package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb",
    "composer.lock", "Cargo.lock", "poetry.lock",
}

# Extensions that are binary or otherwise not source/text.
BINARY_EXT = {
    ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".bmp", ".tiff",
    ".woff", ".woff2", ".ttf", ".otf", ".eot",
    ".mp4", ".webm", ".mov", ".mp3", ".wav", ".ogg", ".flac",
    ".pdf", ".zip", ".tar", ".gz", ".rar", ".7z", ".bz2",
    ".lockb", ".wasm", ".node", ".so", ".dylib", ".dll", ".exe", ".bin",
    ".woff2", ".class", ".jar", ".pyc",
}

# Doc/prose extensions, suppressible with --no-docs.
DOC_EXT = {".md", ".mdx", ".markdown", ".txt", ".rst"}


def is_emoji_base(cp: int) -> bool:
    for lo, hi in RANGES:
        if lo <= cp <= hi:
            return True
    return False


def is_cluster_char(cp: int) -> bool:
    return is_emoji_base(cp) or cp in EXTENDERS


def iter_clusters(line: str):
    """Yield (col_1based, cluster_text) for each maximal emoji run in a line."""
    i = 0
    n = len(line)
    while i < n:
        cp = ord(line[i])
        if is_emoji_base(cp):
            start = i
            i += 1
            while i < n and is_cluster_char(ord(line[i])):
                i += 1
            yield (start + 1, line[start:i])
        else:
            i += 1


def codepoint_report(cluster: str):
    """Return list of {hex, name} for each code point in a cluster."""
    out = []
    for ch in cluster:
        cp = ord(ch)
        if cp in (0x200D, 0xFE0F, 0xFE0E, 0x20E3):
            # name these joiners plainly; unicodedata names are noisy
            label = {
                0x200D: "ZERO WIDTH JOINER",
                0xFE0F: "VARIATION SELECTOR-16",
                0xFE0E: "VARIATION SELECTOR-15",
                0x20E3: "COMBINING ENCLOSING KEYCAP",
            }[cp]
        else:
            label = unicodedata.name(ch, "UNKNOWN")
        out.append({"hex": f"U+{cp:04X}", "name": label})
    return out


def scan_file(path: str):
    hits = []
    try:
        with open(path, "r", encoding="utf-8") as fh:
            for lineno, line in enumerate(fh, start=1):
                stripped = line.rstrip("\n")
                for col, cluster in iter_clusters(stripped):
                    hits.append({
                        "line": lineno,
                        "col": col,
                        "emoji": cluster,
                        "codepoints": codepoint_report(cluster),
                        "context": stripped.strip()[:160],
                    })
    except (UnicodeDecodeError, PermissionError, OSError):
        # Not a UTF-8 text file (or unreadable) -> skip silently.
        return None
    return hits


def should_skip_file(name: str, no_docs: bool) -> bool:
    if name in IGNORE_FILES:
        return True
    ext = os.path.splitext(name)[1].lower()
    if ext in BINARY_EXT:
        return True
    if no_docs and ext in DOC_EXT:
        return True
    return False


def walk(root: str, ignore_dirs: set, no_docs: bool):
    results = {}
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in ignore_dirs]
        for fname in filenames:
            if should_skip_file(fname, no_docs):
                continue
            full = os.path.join(dirpath, fname)
            hits = scan_file(full)
            if hits:
                rel = os.path.relpath(full, root)
                results[rel] = hits
    return results


def main():
    ap = argparse.ArgumentParser(description="Waterborne emoji detector.")
    ap.add_argument("--root", default=".", help="directory to scan (default: .)")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--no-docs", action="store_true",
                    help="skip .md/.mdx/.txt/.rst files")
    ap.add_argument("--exclude", action="append", default=[],
                    help="extra directory name to ignore (repeatable)")
    args = ap.parse_args()

    root = os.path.abspath(args.root)
    if not os.path.isdir(root):
        sys.stderr.write(f"error: not a directory: {root}\n")
        return 2

    ignore = set(DEFAULT_IGNORE_DIRS) | set(args.exclude)
    results = walk(root, ignore, args.no_docs)

    total = sum(len(v) for v in results.values())

    if args.json:
        print(json.dumps({
            "root": root,
            "total": total,
            "files": results,
        }, ensure_ascii=False, indent=2))
        return 1 if total else 0

    if total == 0:
        print("CLEAN: no emojis found.")
        return 0

    print(f"FOUND {total} emoji occurrence(s) across {len(results)} file(s):\n")
    for rel in sorted(results):
        hits = results[rel]
        print(f"  {rel}  ({len(hits)})")
        for h in hits:
            cps = " ".join(f"{c['hex']} {c['name']}" for c in h["codepoints"])
            print(f"    {h['line']}:{h['col']}  [{h['emoji']}]  {cps}")
            print(f"        | {h['context']}")
        print()
    print(f"TOTAL: {total} occurrence(s). Exit code 1 (gate failed).")
    return 1


if __name__ == "__main__":
    sys.exit(main())
