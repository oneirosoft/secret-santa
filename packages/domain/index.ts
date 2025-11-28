import type { Player as PlayerType } from "@secret-santa/prelude/player";
import Player from "@secret-santa/prelude/player";
import MatchMaker from "./match-maker";

const players: PlayerType[] = [
  { nickname: "Tiff", wishlist: [], tags: new Set(["blue"]) },
  { nickname: "Mark", wishlist: [], tags: new Set(["blue"]) },
  { nickname: "Mom", wishlist: [], tags: new Set() },
  { nickname: "Jeff", wishlist: [], tags: new Set() },
];

const pairs = MatchMaker.producePairs(players);

console.log(pairs);
