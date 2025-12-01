import { Elysia } from "elysia";
import workshopEndpoints from "./workshop/workshop.endpoints";

const app = new Elysia().use(workshopEndpoints).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
