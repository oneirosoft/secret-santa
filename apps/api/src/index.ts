import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import workshopEndpoints from './workshop/workshop.endpoints'

const app = new Elysia().use(cors()).use(workshopEndpoints).listen(3000)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
