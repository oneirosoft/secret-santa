import { Workshop, workshopSchema, Pneumonic, wishlistItemSchema, WorkshopType, PneumonicType } from "@secret-santa/domain";
import z from "zod";
import { Result } from "@secret-santa/prelude";
import type { IRepository } from "@secret-santa/data";
import Elysia, { status } from "elysia";

const createWorkshopSchema = workshopSchema;

const createWorkshop = async ({
  body,
  repo
}: {
  body: z.infer<typeof createWorkshopSchema>;
  repo: IRepository<WorkshopType, PneumonicType>;
}) => {
  const { dollarLimit, players, name, id } = body;
  // Deduplicate tags for each player
  const uniquePlayers = players.map(p => ({
    ...p,
    tags: [...new Set(p.tags)]
  }));
  const workshop = Workshop.create({ id, dollarLimit, name, players: uniquePlayers });
  const result = await repo.save(workshop);

  return Result.isSuccess(result)
    ? status(200, result.value)
    : status(404, result);
};

const findWorkshop = async ({ 
  params: { id },
  repo
}: { 
  params: { id: string };
  repo: IRepository<WorkshopType, PneumonicType>;
}) => {
  const pneumonic = Pneumonic.from(id);
  if (!Result.isSuccess(pneumonic)) return status(400, pneumonic);

  const result = await repo.find(pneumonic.value);

  return Result.isSuccess(result)
    ? status(200, result.value)
    : status(404, result);
};

const updateWishlist = async ({
  params,
  body,
  repo
}: {
  params: { id: string, playerNickname: string };
  body: z.infer<typeof wishlistItemSchema>[];
  repo: IRepository<WorkshopType, PneumonicType>;
}) => {
  const pneumonic = Pneumonic.from(params.id)
  if(Result.isError(pneumonic)) return status(400, pneumonic)
  const workshop = await repo.find(pneumonic.value)
  if (Result.isError(workshop)) return status(404, workshop)
  
  const updatedWorkshop = Workshop.updatePlayerWishlist(params.playerNickname, body)(workshop.value)
  if (Result.isError(updatedWorkshop)) return status(404, updatedWorkshop)
  
  const saveResult = await repo.save(updatedWorkshop.value)
  
  return Result.isSuccess(saveResult)
    ? status(200, saveResult.value)
    : status(500, saveResult)
}

const workshopEndpoints = (repo: IRepository<WorkshopType, PneumonicType>) => 
  new Elysia()
    .decorate('repo', repo)
    .group("/workshop", (g) =>
      g
        .put("/create", createWorkshop, { body: createWorkshopSchema })
        .patch("/:id/player/:playerNickname/update-wishlist", updateWishlist, { 
          params: z.object({ id: z.string(), playerNickname: z.string() }),
          body: wishlistItemSchema.array(), 
        })
        .get("/:id", findWorkshop),
    );

export default workshopEndpoints;
