import appRoot from 'app-root-path'
import type { FastifyError, FastifyInstance } from 'fastify'
import Fs from 'node:fs/promises'
import Path from 'node:path'
import type { InlineConfig, ViteDevServer } from 'vite'

const defaultOptions = {
  sourceDir: 'dist',
  viteAssetsDir: '/assets/',
} as const

type VitePluginOptions = typeof defaultOptions & {
  viteConfig?: InlineConfig
}

const interestingFiles = [
  'index.html',
  'manifest',
  'sw',
  'workbox',
  'registerSW',
  'sitemap.xml'
]
declare global {
  var vite: ViteDevServer;
}
const interestingExtensions = ['.png', '.webp', '.svg', '.jpg', '.txt', '.html', '.ico', '.webmanifest']

const defaultViteConfig: InlineConfig = {
  server: { middlewareMode: true },
  appType: 'custom',
};
const getViteServer = async (viteConfig: InlineConfig = defaultViteConfig) => {
  if (globalThis.vite) {
    return globalThis.vite
  }
  const finalConfig = {...defaultViteConfig, ...viteConfig}
  const { createServer: createViteServer } = await import('vite')

  globalThis.vite = await createViteServer(finalConfig)

  return globalThis.vite;
}

export const fastifyVitePlugin = async (
  fastify: FastifyInstance,
  options: Partial<VitePluginOptions>,
  next: (error?: FastifyError) => void
): Promise<void> => {
  const finalOptions = {...defaultOptions, ...options}
  const NODE_ENV = process.env.NODE_ENV || 'development'

  let vite: ViteDevServer

  if (NODE_ENV === 'production') {
    const root = Path.join(appRoot.path, 'dist', 'assets')
    const distRoot = Path.join(appRoot.path, finalOptions.sourceDir)
    const filenames = await Fs.readdir(distRoot)
    const indexHtml = await Fs.readFile(Path.join(distRoot, 'index.html'), 'utf-8')

    for (let filename of filenames) {
      const stats = await Fs.lstat(Path.join(distRoot, filename))
      const isInteresting = interestingFiles.some((interesting) => {
        return filename.startsWith(interesting) || interestingExtensions.some((ext) => filename.endsWith(ext))
      })

      if (stats.isFile() && isInteresting) {
        fastify.get(`/${filename}`, (request, reply) => {
          reply.sendFile(filename, distRoot)
        })
      }
    }

    await fastify.register(import('@fastify/static'), {
      root,
      prefix: finalOptions.viteAssetsDir,
    })

    fastify.get('*', async (request, reply) => {
      reply.type('text/html').send(indexHtml)
    })
  } else {
    await fastify.register(import('@fastify/express'))

    vite = await getViteServer(options.viteConfig)
    fastify.use(vite.middlewares)

    fastify.get('*', async (request, reply) => {
      const htmlFile = await Fs.readFile(Path.join(appRoot.path, 'index.html'), 'utf-8')
      const transformed = await vite.transformIndexHtml(request.url, htmlFile)

      reply.type('text/html').send(transformed)
    })
  }

  fastify.addHook('onClose', async () => {
    await vite?.close()
  })

  next()
}

export default fastifyVitePlugin
