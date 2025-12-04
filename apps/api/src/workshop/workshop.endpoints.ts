import { Workshop, workshopSchema, Pneumonic } from "@secret-santa/domain";
import z from "zod";
import { Result } from "@secret-santa/prelude";
import repo from "@secret-santa/data/mock/repository.mock";
import Elysia, { status } from "elysia";

const createWorkshopSchema = workshopSchema.omit({ id: true });

const createWorkshop = async ({
  body,
}: {
  body: z.infer<typeof createWorkshopSchema>;
}) => {
  const { dollarLimit, players, name } = body;
  const workshop = Workshop.create({ dollarLimit, name, players });
  const result = await repo.save(workshop);

  return Result.isSuccess(result)
    ? status(200, result.value)
    : status(404, result);
};

const findWorkshop = async ({ params: { id } }: { params: { id: string } }) => {
  const pneumonic = Pneumonic.from(id);
  if (!Result.isSuccess(pneumonic)) return status(400, pneumonic);

  const result = await repo.find(pneumonic.value);

  return Result.isSuccess(result)
    ? status(200, result.value)
    : status(404, result);
};

const workshopEndpoints = new Elysia().group("/workshop", (g) =>
  g
    .put("/create", createWorkshop, { body: createWorkshopSchema })
    .get("/:id", findWorkshop),
);

export default workshopEndpoints;
