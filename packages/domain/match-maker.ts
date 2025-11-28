import type { Player } from "@secret-santa/prelude/player";

type PlayerPair = [Player, Player];

const producePairs = (players: Player[]): PlayerPair[] => {
  const alreadyMatched = new Set<string>();
  const pairs: PlayerPair[] = [];
  do {
    pairs.length = 0;
    alreadyMatched.clear();
    for (const p of players) {
      const eligible = players
        .filter((x) => x.tags.intersection(p.tags).size === 0) // cannot be paired w/ matching tags
        .filter((x) => x.nickname !== p.nickname) // cannot be paired with self
        .filter((x) => !alreadyMatched.has(x.nickname)); // cannot be paired w/ already matched

      const index = Math.floor(Math.random() * eligible.length);
      const victim = eligible[index]!;
      if (!victim) break;
      pairs.push([p, victim]);
      alreadyMatched.add(victim.nickname);
    }
  } while (alreadyMatched.size !== players.length);

  return pairs;
};

export default { producePairs };
