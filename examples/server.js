import Fastify from 'fastify'

const fastify = Fastify()

await fastify.register(import('../dist/vite-plugin.js'))
await fastify.listen({ port: 3000 })

console.log('Server running on http://localhost:3000')
