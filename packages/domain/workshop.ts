import z from "zod";
import { playerSchema, type Player } from "./player";
import Pn, { pneumonicSchema } from "./pneumonic";

export const workshopSchema = z.object({
    id: pneumonicSchema,
    name: z.string(),
    dollarLimit: z.number(),
    players: z.array(playerSchema),
});

export type Workshop = z.infer<typeof workshopSchema>;

const create = ({
    dollarLimit,
    name,
    players,
}: Omit<Workshop, "id">): Workshop => ({
    id: Pn.create(5),
    name,
    dollarLimit,
    players,
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

export default {
    create,
    addPlayers,
    removePlayers,
};
