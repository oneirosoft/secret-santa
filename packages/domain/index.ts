import type { Player as PlayerType } from "@secret-santa/prelude/player";
import MatchMaker from "./match-maker";
import result from "@secret-santa/prelude/result";

const players: PlayerType[] = [
  { nickname: "Tiff", wishlist: [], tags: new Set(["blue"]) },
  { nickname: "Mark", wishlist: [], tags: new Set(["blue"]) },
  { nickname: "Mom", wishlist: [], tags: new Set() },
  { nickname: "Jeff", wishlist: [], tags: new Set() },
];

const pairs = MatchMaker.producePairs(players);

if (result.isSuccess(pairs))
  console.log(pairs.value);
