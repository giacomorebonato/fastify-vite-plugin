# vite-plugin-ts

A Fastify plugin to integrate a Vite SPA in the current projects.  
It doesn't aim to deal with server side rendering, but you can still do that from your Fastify application.
It's configured to not ship Vite in production and to only serve its produced assets.

## Usage


```typescript
import { fastifyVitePlugin } from 'fastify-vite-plugin'
import Fastify from 'fastify'

const app = Fastify()
  
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

## Options

The following options need to be specified if they are changed in `vite.config.ts.`

* `viteOutDir` defaults to `dist`
* `viteAssetsDir` defaults to `/assets/` relative path for where Vite stores its production assets


## Requirements

It assumes index.html is placed in the root of the project.
