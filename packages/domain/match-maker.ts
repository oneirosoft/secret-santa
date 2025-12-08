import type { Player } from "./player";
import { Result, type ResultType } from "@secret-santa/prelude";

type PlayerPair = [Player, Player];
type PlayerPairs = PlayerPair[];

const producePairs = (players: readonly Player[]): ResultType<PlayerPairs> => {
  if (players.length === 0) return Result.success([]);
  if (players.length === 1)
    return Result.error("Need to have 2 or more players for proper pairing");

  // validate that there are not more of one tag then any other tag
  // if the players with the same tag outnumber all other players without
  // it is impossible to find pairs
  const allTags = new Set(players.flatMap((p) => Array.from(p.tags)));
  const playerTagCount = Array.from(allTags).reduce(
    (acc: Map<string, number>, curr: string) => {
      const count = players.filter((p) => new Set(p.tags).has(curr)).length;
      acc.set(curr, count);
      return acc;
    },
    new Map<string, number>(),
  );

  const tooManyWithSameTag = Array.from(playerTagCount.entries()).some(([_, count]) => {
    const withoutTag = players.length - count;
    return withoutTag < count;
  });

  if (tooManyWithSameTag)
    return Result.error(
      "Over half the players have the same tag, pairs cannot be created as a result",
    );

  const alreadyMatched = new Set<string>();
  const pairs: PlayerPair[] = [];
  do {
    pairs.length = 0;
    alreadyMatched.clear();
    for (const p of players) {
      const eligible = players
        .filter((x) => new Set(x.tags).intersection(new Set(p.tags)).size === 0) // cannot be paired w/ matching tags
        .filter((x) => x.nickname !== p.nickname) // cannot be paired with self
        .filter((x) => !alreadyMatched.has(x.nickname)); // cannot be paired w/ already matched

      const index = Math.floor(Math.random() * eligible.length);
      const victim = eligible[index];
      if (!victim) break;
      pairs.push([p, victim]);
      alreadyMatched.add(victim.nickname);
    }
  } while (alreadyMatched.size !== players.length);

  return Result.success(pairs);
};

export default { producePairs };
