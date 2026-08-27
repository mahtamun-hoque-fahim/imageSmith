'use client'

import { useRef, useEffect, useState } from 'react'
import { Globe, Terminal, Bot, ArrowRight, Lock } from 'lucide-react'

interface Surface {
  icon: React.ElementType
  label: string
  title: string
  desc: string
  command: string | null
  cta: { label: string; href: string | null; scroll?: boolean }
  live: boolean
}

const SURFACES: Surface[] = [
  {
    icon: Globe,
    label: 'Browser',
    title: 'Drop & convert',
    desc: 'No install. No account. Drag your files in — get WebP out. Runs entirely in your browser.',
    command: null,
    cta: { label: 'Use now', href: '#converter-section', scroll: true },
    live: true,
  },
  {
    icon: Terminal,
    label: 'Terminal',
    title: 'One command',
    desc: 'For developers who live in the terminal. Convert files, folders, and ZIPs from any build pipeline.',
    command: 'npm i -g @imagesmith/cli',
    cta: { label: 'View on npm', href: 'https://www.npmjs.com/package/@imagesmith/cli' },
    live: true,
  },
  {
    icon: Bot,
    label: 'AI Agent',
    title: 'MCP server',
    desc: 'Let your AI agent call ImageSmith as a tool mid-session. Convert assets without breaking flow.',
    command: 'imagesmith mcp',
    cta: { label: 'View on npm', href: 'https://www.npmjs.com/package/@imagesmith/cli' },
    live: true,
  },
]

export default function SurfaceCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        obs.disconnect()
        // Stagger each card 180ms apart
        SURFACES.forEach((_, i) => {
          setTimeout(() => {
            setRevealed(prev => {
              const next = [...prev]
              next[i] = true
              return next
            })
          }, i * 180)
        })
      },
      { threshold: 0.15 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="border-t border-border">
      <div className="max-w-4xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="flex flex-col gap-2 mb-12">
          <p className="text-text-muted text-xs font-mono uppercase tracking-widest">
            Surfaces
          </p>
          <h2 className="font-display font-bold text-3xl text-text">
            Everywhere you work
          </h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-md">
            One tool. Three surfaces. Same privacy guarantee across all of them.
          </p>
        </div>

        {/* Cards */}
        <div ref={sectionRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SURFACES.map(({ icon: Icon, label, title, desc, command, cta, live }, index) => (
            <div
              key={label}
              className="flex flex-col gap-4 bg-surface border border-border rounded-lg p-6"
              style={{
                opacity:   revealed[index] ? (live ? 1 : 0.5) : 0,
                transform: revealed[index] ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
              }}
            >
              {/* Icon + badge */}
              <div className="flex items-start justify-between">
                <div className="w-9 h-9 rounded-lg bg-accent-faint flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                {!live && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium font-mono bg-surface-elevated text-text-muted border border-border">
                    soon
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="flex flex-col gap-1 flex-1">
                <p className="text-xs font-mono text-text-faint uppercase tracking-wider">
                  {label}
                </p>
                <h3 className="font-display font-semibold text-text">{title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
              </div>

              {/* Command snippet */}
              {command && (
                <div className="bg-bg border border-border rounded-md px-3 py-2">
                  <code className="text-xs font-mono text-accent">{command}</code>
                </div>
              )}

              {/* CTA */}
              {cta.href ? (
                <a
                  href={cta.href}
                  onClick={
                    cta.scroll
                      ? (e) => {
                          e.preventDefault()
                          document
                            .getElementById('converter-section')
                            ?.scrollIntoView({ behavior: 'smooth' })
                        }
                      : undefined
                  }
                  target={!cta.scroll ? '_blank' : undefined}
                  rel={!cta.scroll ? 'noopener noreferrer' : undefined}
                  className="mt-auto text-sm font-medium text-accent flex items-center gap-1 hover:gap-2 transition-all duration-150 w-fit"
                >
                  {cta.label}
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>
              ) : (
                <p className="mt-auto text-sm text-text-faint flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  {cta.label}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
