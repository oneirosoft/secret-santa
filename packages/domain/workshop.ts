import z from "zod";
import { playerSchema, type Player, type WishlistItem } from "./player";
import Pn, { pneumonicSchema } from "./pneumonic";
import matchMaker from "./match-maker";
import { Result, type ResultType } from "@secret-santa/prelude";

export const workshopSchema = z.object({
  id: pneumonicSchema.readonly(),
  name: z.string().readonly(),
  dollarLimit: z.number().readonly(),
  players: z.array(playerSchema).readonly(),
  pairs: z.array(z.tuple([playerSchema, playerSchema])).readonly(),
});

export type Workshop = z.infer<typeof workshopSchema>;

const create = ({
  dollarLimit,
  name,
  players,
}: Omit<Workshop, "id" | "pairs">): Workshop => ({
  id: Pn.create(5),
  name,
  dollarLimit,
  players,
  pairs: [],
});

const addPlayers =
  (players: Player[]) =>
  (workshop: Workshop): Workshop => ({
    ...workshop,
    players: [
      ...workshop.players,
      ...players.filter(
        (p) => !workshop.players.map((p) => p.nickname).includes(p.nickname),
      ),
    ],
  });

const removePlayers =
  (players: Player[]) =>
  (workshop: Workshop): Workshop => ({
    ...workshop,
    players: workshop.players.filter((p) =>
      players.map((x) => x.nickname).includes(p.nickname),
    ),
  });

const matchPlayers = (workshop: Workshop): Workshop =>
  matchMaker.producePairs(workshop.players).match(
    (pairs) => ({ ...workshop, pairs }),
    () => workshop,
  );

const updatePlayerWishlist =
  (nickname: string, wishlist: WishlistItem[]) =>
  (workshop: Workshop): ResultType<Workshop> => {
    const playerExists = workshop.players.some(p => p.nickname === nickname);
    
    if (!playerExists) {
      return Result.error('Player not found in workshop');
    }
    
    const updatedPlayers = workshop.players.map(p =>
      p.nickname === nickname ? { ...p, wishlist } : p
    );
    
    return Result.success({ ...workshop, players: updatedPlayers });
  };

export default {
  create,
  addPlayers,
  removePlayers,
  matchPlayers,
  updatePlayerWishlist,
};
