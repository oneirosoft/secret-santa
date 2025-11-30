import { Elysia, status } from "elysia";
import { Workshop, workshopSchema, Pneumonic } from "@secret-santa/domain";
import repo from "@secret-santa/data/mock/repository.mock";
import Result from "@secret-santa/prelude/result";
import z from "zod";

const createWorkshopSchema = workshopSchema.omit({ id: true });

const createWorkshop = ({
  body,
}: {
  body: z.infer<typeof createWorkshopSchema>;
}) => {
  const { dollarLimit, players, name } = body;
  const initial = Workshop.create({ dollarLimit, name });
  const workshop = Workshop.addPlayers(players)(initial);
  const result = repo.save(workshop);

  return Result.isSuccess(result)
    ? status(200, result.value)
    : status(404, result);
};

const findWorkshop = ({ params: { id } }: { params: { id: string } }) => {
  const pneumonic = Pneumonic.from(id);
  const findWorkshop = Result.then(repo.find);
  const workshop = findWorkshop(pneumonic);
  return Result.isSuccess(workshop)
    ? status(200, workshop.value)
    : status(404, workshop);
};

const app = new Elysia()
  .get("/workshop/:id", findWorkshop)
  .post("/workshop/create", createWorkshop, { body: createWorkshopSchema })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
