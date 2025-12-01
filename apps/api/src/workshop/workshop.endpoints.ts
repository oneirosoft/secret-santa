import { Workshop, workshopSchema, Pneumonic } from "@secret-santa/domain";
import z from "zod";
import { Result } from "@secret-santa/prelude";
import repo from "@secret-santa/data/mock/repository.mock";
import Elysia, { status } from "elysia";

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

const workshopEndpoints = new Elysia().group("/workshop", (g) =>
  g
    .put("/create", createWorkshop, { body: createWorkshopSchema })
    .get("/:id", findWorkshop),
);

export default workshopEndpoints;
