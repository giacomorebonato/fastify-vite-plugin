import Fastify from 'fastify'
import { fastifyVitePlugin } from '../dist/vite-plugin.js'

const fastify = Fastify()


await fastify.register(fastifyVitePlugin)

await fastify.listen({ port: 3000 })

console.log('Server running on http://localhost:3000')
