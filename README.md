![release workflow](https://github.com/giacomorebonato/fastify-vite-plugin/actions/workflows/release.yml/badge.svg) ![playwright workflow](https://github.com/giacomorebonato/fastify-vite-plugin/actions/workflows/playwright.yml/badge.svg)

# vite-plugin-ts

A Fastify plugin to integrate a Vite **SPA** into the current project and serving both frontend and backend from the same host.  
It doesn't aim to deal with server side rendering, but you can still do that from your Fastify application.  
It could be an interesting use case to render HTML only if the request is made by a bot. A bot can be detected using [isbot package](https://www.npmjs.com/package/isbot).
It's configured to not ship Vite in production and to only serve its produced assets.

## Usage


```typescript
import { fastifyVitePlugin } from 'fastify-vite-plugin'
import Fastify from 'fastify'

const app = Fastify()

// place your routes before the plugin registration
// otherwise the "catch all" route that renders index.html
// for the SPA will take precedence

await app.register(fastifyVitePlugin)

await app.listen({
  port: process.env.PORT,
  host: process.env.NODE_ENV === 'development' ? '0.0.0.0' : undefined,
})
```

Example `vite.config.ts`

```typescript
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      workbox: {
        globPatterns: ['**/*.{js,css}'],
        navigateFallback: null,
      },
      includeAssets: ['**/*'],
    }),
  ],
})

```

The above configuration will just work in dev mode.  
When you do `npx vite build` for `NODE_ENV=production` make sure that the output is located into `/dist/assets`.

## Options

The following options need to be specified if they are changed in `vite.config.ts.`

* `viteOutDir` defaults to `dist`
* `viteAssetsDir` defaults to `/assets/` relative path for where Vite stores its production assets


## Requirements

* it assumes index.html is placed in the root of the project
* its assumes `npx vite build` is executed before starting the application with `NODE_ENV=production`
  * if you are using TypeScript, it should be in the same step where you compile your code to JavaScript
