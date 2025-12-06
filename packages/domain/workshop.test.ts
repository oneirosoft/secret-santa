import { describe, expect, test } from "bun:test";
import Workshop, { workshopSchema, type Workshop as WorkshopType } from "./workshop";
import Player, { type Player as PlayerType } from "./player";
import { Result } from "@secret-santa/prelude";

describe("Workshop", () => {
  describe("create", () => {
    test("should create a workshop with generated id and empty pairs", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["friends"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      expect(workshop.name).toBe("Holiday Exchange");
      expect(workshop.dollarLimit).toBe(50);
      expect(workshop.players).toEqual(players);
      expect(workshop.pairs).toEqual([]);
      expect(workshop.id).toBeDefined();
      expect(workshop.id.value).toBeTypeOf("string");
      expect(workshop.id.value.length).toBeGreaterThan(0);
    });

    test("should create workshop with different ids", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set() }),
      ];

      const workshop1 = Workshop.create({ name: "Exchange 1", dollarLimit: 50, players });
      const workshop2 = Workshop.create({ name: "Exchange 2", dollarLimit: 50, players });

      expect(workshop1.id.value).not.toBe(workshop2.id.value);
    });
  });

  describe("addPlayers", () => {
    test("should add new players to workshop", () => {
      const initialPlayers: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["friends"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players: initialPlayers,
      });

      const newPlayers: PlayerType[] = [
        Player.create({ nickname: "Charlie", tags: new Set(["work"]) }),
        Player.create({ nickname: "Diana", tags: new Set(["family"]) }),
      ];

      const updated = Workshop.addPlayers(newPlayers)(workshop);

      expect(updated.players.length).toBe(4);
      expect(updated.players.map(p => p.nickname)).toContain("Alice");
      expect(updated.players.map(p => p.nickname)).toContain("Bob");
      expect(updated.players.map(p => p.nickname)).toContain("Charlie");
      expect(updated.players.map(p => p.nickname)).toContain("Diana");
    });

    test("should not duplicate players with same nickname", () => {
      const initialPlayers: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["friends"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players: initialPlayers,
      });

      const duplicatePlayers: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["work"]) }),
        Player.create({ nickname: "Charlie", tags: new Set(["work"]) }),
      ];

      const updated = Workshop.addPlayers(duplicatePlayers)(workshop);

      expect(updated.players.length).toBe(3);
      expect(updated.players.filter(p => p.nickname === "Alice").length).toBe(1);
      expect(updated.players.map(p => p.nickname)).toContain("Charlie");
    });

    test("should preserve other workshop properties", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set() }),
      ];

      const workshop = Workshop.create({
        name: "Test Exchange",
        dollarLimit: 100,
        players,
      });

      const newPlayers: PlayerType[] = [
        Player.create({ nickname: "Bob", tags: new Set() }),
      ];

      const updated = Workshop.addPlayers(newPlayers)(workshop);

      expect(updated.name).toBe(workshop.name);
      expect(updated.dollarLimit).toBe(workshop.dollarLimit);
      expect(updated.id).toBe(workshop.id);
      expect(updated.pairs).toBe(workshop.pairs);
    });
  });

  describe("removePlayers", () => {
    test("should remove specified players from workshop", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["friends"]) }),
        Player.create({ nickname: "Charlie", tags: new Set(["work"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const toRemove: PlayerType[] = [
        Player.create({ nickname: "Bob", tags: new Set() }),
      ];

      const updated = Workshop.removePlayers(toRemove)(workshop);

      expect(updated.players.length).toBe(1);
      expect(updated.players.map(p => p.nickname)).toContain("Bob");
      expect(updated.players.map(p => p.nickname)).not.toContain("Alice");
      expect(updated.players.map(p => p.nickname)).not.toContain("Charlie");
    });

    test("should handle removing non-existent players gracefully", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const toRemove: PlayerType[] = [
        Player.create({ nickname: "NonExistent", tags: new Set() }),
      ];

      const updated = Workshop.removePlayers(toRemove)(workshop);

      expect(updated.players.length).toBe(0);
    });

    test("should preserve other workshop properties", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set() }),
        Player.create({ nickname: "Bob", tags: new Set() }),
      ];

      const workshop = Workshop.create({
        name: "Test Exchange",
        dollarLimit: 100,
        players,
      });

      const toRemove: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set() }),
      ];

      const updated = Workshop.removePlayers(toRemove)(workshop);

      expect(updated.name).toBe(workshop.name);
      expect(updated.dollarLimit).toBe(workshop.dollarLimit);
      expect(updated.id).toBe(workshop.id);
      expect(updated.pairs).toBe(workshop.pairs);
    });
  });

  describe("matchPlayers", () => {
    test("should create pairs when matching succeeds", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["friends"]) }),
        Player.create({ nickname: "Charlie", tags: new Set(["work"]) }),
        Player.create({ nickname: "Diana", tags: new Set(["coworkers"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const matched = Workshop.matchPlayers(workshop);

      expect(matched.pairs.length).toBeGreaterThan(0);
      expect(matched.pairs.length).toBeLessThanOrEqual(players.length);
    });

    test("should return workshop unchanged when matching fails", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["family"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const matched = Workshop.matchPlayers(workshop);

      expect(matched.pairs).toEqual([]);
      expect(matched).toEqual(workshop);
    });

    test("should preserve other workshop properties", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["friends"]) }),
      ];

      const workshop = Workshop.create({
        name: "Test Exchange",
        dollarLimit: 100,
        players,
      });

      const matched = Workshop.matchPlayers(workshop);

      expect(matched.name).toBe(workshop.name);
      expect(matched.dollarLimit).toBe(workshop.dollarLimit);
      expect(matched.id).toBe(workshop.id);
      expect(matched.players).toBe(workshop.players);
    });
  });

  describe("updatePlayerWishlist", () => {
    test("should update wishlist for existing player", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
        Player.create({ nickname: "Bob", tags: new Set(["friends"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const newWishlist = [
        { name: "Book", url: "https://example.com/book" },
        { name: "Camera" },
      ];

      const result = Workshop.updatePlayerWishlist("Alice", newWishlist)(workshop);

      expect(Result.isSuccess(result)).toBe(true);
      if (!Result.isSuccess(result)) return;

      const alicePlayer = result.value.players.find(p => p.nickname === "Alice");
      expect(alicePlayer).toBeDefined();
      expect(alicePlayer?.wishlist).toEqual(newWishlist);
    });

    test("should not modify other players' wishlists", () => {
      const players: PlayerType[] = [
        { nickname: "Alice", tags: new Set(["family"]), wishlist: [{ name: "Old item" }] },
        { nickname: "Bob", tags: new Set(["friends"]), wishlist: [{ name: "Bob's item" }] },
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const newWishlist = [{ name: "New item" }];

      const result = Workshop.updatePlayerWishlist("Alice", newWishlist)(workshop);

      expect(Result.isSuccess(result)).toBe(true);
      if (!Result.isSuccess(result)) return;

      const bobPlayer = result.value.players.find(p => p.nickname === "Bob");
      expect(bobPlayer?.wishlist).toEqual([{ name: "Bob's item" }]);
    });

    test("should return error when player not found", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const newWishlist = [{ name: "Book" }];

      const result = Workshop.updatePlayerWishlist("NonExistent", newWishlist)(workshop);

      expect(Result.isError(result)).toBe(true);
      if (!Result.isError(result)) return;

      expect(result.message).toBe("Player not found in workshop");
    });

    test("should preserve other workshop properties", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set() }),
      ];

      const workshop = Workshop.create({
        name: "Test Exchange",
        dollarLimit: 100,
        players,
      });

      const newWishlist = [{ name: "Item" }];

      const result = Workshop.updatePlayerWishlist("Alice", newWishlist)(workshop);

      expect(Result.isSuccess(result)).toBe(true);
      if (!Result.isSuccess(result)) return;

      expect(result.value.name).toBe(workshop.name);
      expect(result.value.dollarLimit).toBe(workshop.dollarLimit);
      expect(result.value.id).toBe(workshop.id);
      expect(result.value.pairs).toBe(workshop.pairs);
    });

    test("should handle empty wishlist", () => {
      const players: PlayerType[] = [
        { nickname: "Alice", tags: new Set(), wishlist: [{ name: "Old item" }] },
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const result = Workshop.updatePlayerWishlist("Alice", [])(workshop);

      expect(Result.isSuccess(result)).toBe(true);
      if (!Result.isSuccess(result)) return;

      const alicePlayer = result.value.players.find(p => p.nickname === "Alice");
      expect(alicePlayer?.wishlist).toEqual([]);
    });
  });

  describe("workshopSchema", () => {
    test("should validate valid workshop", () => {
      const players: PlayerType[] = [
        Player.create({ nickname: "Alice", tags: new Set(["family"]) }),
      ];

      const workshop = Workshop.create({
        name: "Holiday Exchange",
        dollarLimit: 50,
        players,
      });

      const result = workshopSchema.safeParse(workshop);

      expect(result.success).toBe(true);
    });

    test("should reject workshop without required fields", () => {
      const invalidWorkshop = {
        name: "Test",
        players: [],
      };

      const result = workshopSchema.safeParse(invalidWorkshop);

      expect(result.success).toBe(false);
    });

    test("should parse workshop with pairs", () => {
      const player1 = Player.create({ nickname: "Alice", tags: new Set(["family"]) });
      const player2 = Player.create({ nickname: "Bob", tags: new Set(["friends"]) });

      const workshopData: WorkshopType = {
        id: { value: "test-id" },
        name: "Holiday Exchange",
        dollarLimit: 50,
        players: [player1, player2],
        pairs: [[player1, player2]],
      };

      const result = workshopSchema.safeParse(workshopData);

      expect(result.success).toBe(true);
      if (!result.success) return;

      expect(result.data.pairs.length).toBe(1);
      const pair = result.data.pairs[0];
      expect(pair).toBeDefined();
      expect(pair![0].nickname).toBe("Alice");
      expect(pair![1].nickname).toBe("Bob");
    });
  });
});
