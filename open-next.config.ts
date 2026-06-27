// open-next.config.ts — built with: npx @opennextjs/cloudflare build
// Install @opennextjs/cloudflare before deploying to Cloudflare Workers

const config = {
  default: {
    override: {
      wrapper: 'cloudflare-node',
      converter: 'edge',
    },
  },
}

export default config
