import { Elysia } from "elysia";
import { cors } from '@elysiajs/cors'
import workshopEndpoints from "./workshop/workshop.endpoints";
import repo from "@secret-santa/data/mock/repository.mock";

const app = new Elysia().use(cors()).use(workshopEndpoints(repo)).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type Api = typeof app