import type { Player } from "./player"
import type { Pneumonic } from "./pneumonic"
import Pn from "./pneumonic"

export type Workshop = {
    id: Pneumonic,
    name: string,
    dollarLimit: number,
    players: Player[]
}

const create = ({ dollarLimit, name }: Pick<Workshop, 'dollarLimit' | 'name'>): Workshop => ({
    id: Pn.create(5),
    name,
    dollarLimit: dollarLimit,
    players: []
})

const addPlayers = (players: Player[]) => (workshop: Workshop): Workshop => ({
    ...workshop, players: [...workshop.players, ...players.filter(p => !workshop.players.map(p => p.nickname).includes(p.nickname))]
})

export default {
    create,
    addPlayers 
}