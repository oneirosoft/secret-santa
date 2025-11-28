import { describe, expect, test } from "bun:test";
import { producePairs } from "./match-maker";
import type { Player } from "@secret-santa/prelude/player";

describe("producePairs", () => {
  test("no PlayerPair has players with the same tags", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set(["family"]) },
      { nickname: "bob", wishlist: [], tags: new Set(["friends"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["work"]) },
      { nickname: "alice", wishlist: [], tags: new Set(["family"]) },
      { nickname: "charlie", wishlist: [], tags: new Set(["friends"]) },
    ];

    const pairs = producePairs(players);

    for (const [giver, receiver] of pairs) {
      const intersection = giver.tags.intersection(receiver.tags);
      expect(intersection.size).toBe(0);
    }
  });

  test("a player is not matched with themselves", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set(["family"]) },
      { nickname: "bob", wishlist: [], tags: new Set(["friends"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["work"]) },
      { nickname: "alice", wishlist: [], tags: new Set(["coworkers"]) },
    ];

    const pairs = producePairs(players);

    for (const [giver, receiver] of pairs) {
      expect(giver.nickname).not.toBe(receiver.nickname);
    }
  });

  test("a player is not paired twice - each player appears exactly once as a receiver", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set(["family"]) },
      { nickname: "bob", wishlist: [], tags: new Set(["friends"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["work"]) },
      { nickname: "alice", wishlist: [], tags: new Set(["coworkers"]) },
    ];

    const pairs = producePairs(players);

    // Collect all receivers (victims)
    const receivers = pairs.map(([_giver, receiver]) => receiver.nickname);

    // Check that each receiver appears exactly once
    const receiverCounts = new Map<string, number>();
    for (const receiver of receivers) {
      receiverCounts.set(receiver, (receiverCounts.get(receiver) || 0) + 1);
    }

    for (const [receiver, count] of receiverCounts) {
      expect(count).toBe(1);
    }

    // Also verify that every player is a receiver exactly once
    expect(receiverCounts.size).toBe(players.length);
  });

  test("produces correct number of pairs", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set(["family"]) },
      { nickname: "bob", wishlist: [], tags: new Set(["friends"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["work"]) },
    ];

    const pairs = producePairs(players);

    expect(pairs.length).toBe(players.length);
  });

  test("handles players with no tags correctly", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set() },
      { nickname: "bob", wishlist: [], tags: new Set() },
      { nickname: "sally", wishlist: [], tags: new Set() },
    ];

    const pairs = producePairs(players);

    expect(pairs.length).toBe(players.length);

    // Verify all constraints
    for (const [giver, receiver] of pairs) {
      expect(giver.nickname).not.toBe(receiver.nickname);
      expect(giver.tags.intersection(receiver.tags).size).toBe(0);
    }

    // Verify unique receivers
    const receivers = pairs.map(([_giver, receiver]) => receiver.nickname);
    const uniqueReceivers = new Set(receivers);
    expect(uniqueReceivers.size).toBe(players.length);
  });

  test("handles complex tag scenarios", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set(["family", "sports"]) },
      { nickname: "bob", wishlist: [], tags: new Set(["friends", "gaming"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["work", "music"]) },
      { nickname: "alice", wishlist: [], tags: new Set(["coworkers", "art"]) },
      { nickname: "charlie", wishlist: [], tags: new Set(["neighbors", "cooking"]) },
    ];

    const pairs = producePairs(players);

    expect(pairs.length).toBe(players.length);

    // Verify all three constraints
    const receivers = new Map<string, number>();

    for (const [giver, receiver] of pairs) {
      // Constraint 1: No matching tags
      expect(giver.tags.intersection(receiver.tags).size).toBe(0);

      // Constraint 2: Not matched with self
      expect(giver.nickname).not.toBe(receiver.nickname);

      // Constraint 3: Track receivers for uniqueness
      receivers.set(receiver.nickname, (receivers.get(receiver.nickname) || 0) + 1);
    }

    // Verify each player is a receiver exactly once
    for (const [_receiver, count] of receivers) {
      expect(count).toBe(1);
    }
  });

  test("validates no duplicate receivers - jon and bob cannot both have sally", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set(["family"]) },
      { nickname: "bob", wishlist: [], tags: new Set(["friends"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["work"]) },
    ];

    const pairs = producePairs(players);

    // Count how many times each player is a receiver
    const receiverMap = new Map<string, string[]>(); // receiver -> givers
    
    for (const [giver, receiver] of pairs) {
      if (!receiverMap.has(receiver.nickname)) {
        receiverMap.set(receiver.nickname, []);
      }
      receiverMap.get(receiver.nickname)!.push(giver.nickname);
    }

    // Verify sally (and every other player) is only assigned to one giver
    for (const [_, givers] of receiverMap) {
      expect(givers.length).toBe(1);
    }

    // Verify all players are receivers
    expect(receiverMap.size).toBe(players.length);
    expect(receiverMap.has("jon")).toBe(true);
    expect(receiverMap.has("bob")).toBe(true);
    expect(receiverMap.has("sally")).toBe(true);
  });
});
