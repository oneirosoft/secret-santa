import { describe, expect, test } from "bun:test";
import matchMaker from "./match-maker";
import type { Player } from "./player";
import Result from "@secret-santa/prelude/result";

const { producePairs } = matchMaker;

describe("producePairs", () => {
  test("no PlayerPair has players with the same tags", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set(["family"]) },
      { nickname: "bob", wishlist: [], tags: new Set(["friends"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["work"]) },
      { nickname: "alice", wishlist: [], tags: new Set(["family"]) },
      { nickname: "charlie", wishlist: [], tags: new Set(["friends"]) },
    ];

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

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

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

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

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

    // Collect all receivers (victims)
    const receivers = pairs.map(([_giver, receiver]) => receiver.nickname);

    // Check that each receiver appears exactly once
    const receiverCounts = new Map<string, number>();
    for (const receiver of receivers) {
      receiverCounts.set(receiver, (receiverCounts.get(receiver) || 0) + 1);
    }

    for (const [_, count] of receiverCounts) {
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

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

    expect(pairs.length).toBe(players.length);
  });

  test("handles players with no tags correctly", () => {
    const players: Player[] = [
      { nickname: "jon", wishlist: [], tags: new Set() },
      { nickname: "bob", wishlist: [], tags: new Set() },
      { nickname: "sally", wishlist: [], tags: new Set() },
    ];

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

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

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

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

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

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

  test("returns success with empty array when players array is empty", () => {
    const players: Player[] = [];

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

    expect(pairs).toEqual([]);
    expect(pairs.length).toBe(0);
  });

  test("returns error result when only one player is provided", () => {
    const players: Player[] = [
      { nickname: "bob", wishlist: [], tags: new Set(["blue"]) },
    ];

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(false);
    if (Result.isSuccess(result)) return;

    // Should return error because you need at least 2 players for pairing
    expect(result.message).toBe("Need to have 2 or more players for proper pairing");
  });

  test("returns error result when over half the players have the same tag", () => {
    const players: Player[] = [
      { nickname: "bob", wishlist: [], tags: new Set(["blue"]) },
      { nickname: "jon", wishlist: [], tags: new Set(["blue"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["blue"]) },
      { nickname: "sarah", wishlist: [], tags: new Set(["green"]) },
    ];

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(false);
    if (Result.isSuccess(result)) return;

    // Should return error because 3 out of 4 players have "blue" tag
    // which is more than half, making valid pairing impossible
    expect(result.message).toBe("Over half the players have the same tag, pairs cannot be created as a result");
  });

  test("successfully creates pairs when exactly half the players share a tag", () => {
    const players: Player[] = [
      { nickname: "bob", wishlist: [], tags: new Set(["blue"]) },
      { nickname: "jon", wishlist: [], tags: new Set(["blue"]) },
      { nickname: "sally", wishlist: [], tags: new Set(["green"]) },
      { nickname: "sarah", wishlist: [], tags: new Set(["green"]) },
    ];

    const result = producePairs(players);
    expect(Result.isSuccess(result)).toBe(true);
    if (!Result.isSuccess(result)) return;
    
    const pairs = result.value;

    // Should successfully create pairs because exactly half have each tag
    expect(pairs.length).toBe(players.length);

    // Verify all constraints
    for (const [giver, receiver] of pairs) {
      expect(giver.tags.intersection(receiver.tags).size).toBe(0);
      expect(giver.nickname).not.toBe(receiver.nickname);
    }

    // Verify unique receivers
    const receivers = pairs.map(([_giver, receiver]) => receiver.nickname);
    const uniqueReceivers = new Set(receivers);
    expect(uniqueReceivers.size).toBe(players.length);
  });
});
