import { Elysia, Static, status, t } from "elysia";
import Workshop from '@secret-santa/prelude/workshop'
import repo from '@secret-santa/data/mock/repository.mock'
import Result from '@secret-santa/data/result'
import Pneumonic from "@secret-santa/prelude/pneumonic";


const WorkshopSchema = t.Object({
  id: t.Object({ value: t.String() }),
  name: t.String(),
  dollarLimit: t.Number(),
  players: t.Array(t.Object({
    nickname: t.String(),
    wishlist: t.Array(t.Object({
      name: t.String(),
      url: t.Optional(t.String())
    }))
  }))
})

const CreateWorkshopSchema = t.Omit(WorkshopSchema, ['id'])

const createWorkshop = ({ body }: { body: Static<typeof CreateWorkshopSchema> }) => {
  const { dollarLimit, players, name } = body
  const initial = Workshop.create({ dollarLimit, name })
  const workshop = Workshop.addPlayers(players)(initial)
  const result = repo.save(workshop)

  return Result.isSuccess(result) ? status(200, result.value) :
    status(404, result)
}

const findWorkshop = ({ params: { id } }: { params: {id: string} }) => {
  const workshop = repo.find(Pneumonic.from(id))
  return Result.isSuccess(workshop) ? status(200, workshop.value) : status(404, workshop)
}

const app = new Elysia()
  .get("/workshop/:id", findWorkshop)
  .post("/workshop/create", createWorkshop, { body: CreateWorkshopSchema })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
