import { describe, expect, test } from "bun:test";
import Player, { playerSchema, type Player as PlayerType } from "./player";

describe("Player", () => {
  describe("create", () => {
    test("should create a player with empty wishlist and tags", () => {
      const player = Player.create({ nickname: "Alice", tags: new Set() });
      
      expect(player.nickname).toBe("Alice");
      expect(player.wishlist).toEqual([]);
      expect(player.tags).toBeInstanceOf(Set);
      expect(player.tags.size).toBe(0);
    });
  });

  describe("tags - JSON serialization", () => {
    test("should parse player with Set tags", () => {
      const playerData = {
        nickname: "Bob",
        tags: new Set(["gamer", "reader", "cook"]),
        wishlist: [],
      };

      const result = playerSchema.safeParse(playerData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toBeInstanceOf(Set);
        expect(result.data.tags.size).toBe(3);
        expect(result.data.tags.has("gamer")).toBe(true);
        expect(result.data.tags.has("reader")).toBe(true);
        expect(result.data.tags.has("cook")).toBe(true);
      }
    });

    test("should parse player with Array tags (from JSON)", () => {
      const playerData = {
        nickname: "Carol",
        tags: ["artist", "musician"],
        wishlist: [],
      };

      const result = playerSchema.safeParse(playerData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toBeInstanceOf(Set);
        expect(result.data.tags.size).toBe(2);
        expect(result.data.tags.has("artist")).toBe(true);
        expect(result.data.tags.has("musician")).toBe(true);
      }
    });

    test("should handle JSON.parse and JSON.stringify round-trip", () => {
      const original: PlayerType = {
        nickname: "Eve",
        tags: new Set(["dancer", "singer", "writer"]),
        wishlist: [
          { name: "Book", url: "https://example.com/book" },
          { name: "Camera" },
        ],
      };

      // Serialize: Convert Set to Array for JSON
      const serialized = JSON.stringify({
        ...original,
        tags: Array.from(original.tags),
      });

      // Parse back
      const parsed = JSON.parse(serialized);
      const validated = playerSchema.safeParse(parsed);

      expect(validated.success).toBe(true);
      if (validated.success) {
        expect(validated.data.nickname).toBe(original.nickname);
        expect(validated.data.tags).toBeInstanceOf(Set);
        expect(validated.data.tags.size).toBe(3);
        expect(validated.data.tags.has("dancer")).toBe(true);
        expect(validated.data.tags.has("singer")).toBe(true);
        expect(validated.data.tags.has("writer")).toBe(true);
        expect(validated.data.wishlist).toEqual(original.wishlist);
      }
    });

    test("should handle empty array tags", () => {
      const playerData = {
        nickname: "Frank",
        tags: [],
        wishlist: [],
      };

      const result = playerSchema.safeParse(playerData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toBeInstanceOf(Set);
        expect(result.data.tags.size).toBe(0);
      }
    });

    test("should remove duplicates when parsing array", () => {
      const playerData = {
        nickname: "Iris",
        tags: ["developer", "developer", "writer", "developer"],
        wishlist: [],
      };

      const result = playerSchema.safeParse(playerData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toBeInstanceOf(Set);
        expect(result.data.tags.size).toBe(2);
        expect(result.data.tags.has("developer")).toBe(true);
        expect(result.data.tags.has("writer")).toBe(true);
      }
    });
  });

  describe("addTag", () => {
    test("should add a tag to player", () => {
      const player = Player.create({ nickname: "Jack", tags: new Set() });
      const updated = Player.addTag("gamer")(player);

      expect(updated.tags.has("gamer")).toBe(true);
      expect(updated.tags.size).toBe(1);
      expect(player.tags.size).toBe(0); // Original unchanged
    });

    test("should add multiple tags", () => {
      const player = Player.create({ nickname: "Kate", tags: new Set() });
      const updated = Player.addTag("reader")(Player.addTag("writer")(player));

      expect(updated.tags.has("reader")).toBe(true);
      expect(updated.tags.has("writer")).toBe(true);
      expect(updated.tags.size).toBe(2);
    });

    test("should not add duplicate tags", () => {
      const player = Player.create({ nickname: "Leo", tags: new Set(["gamer"]) });
      const updated = Player.addTag("gamer")(player);

      expect(updated.tags.size).toBe(1);
      expect(updated.tags.has("gamer")).toBe(true);
    });
  });

  describe("removeTag", () => {
    test("should remove a tag from player", () => {
      const player = Player.create({ nickname: "Mia", tags: new Set(["gamer", "reader"]) });
      const updated = Player.removeTag("gamer")(player);

      expect(updated.tags.has("gamer")).toBe(false);
      expect(updated.tags.has("reader")).toBe(true);
      expect(updated.tags.size).toBe(1);
      expect(player.tags.size).toBe(2); // Original unchanged
    });

    test("should handle removing non-existent tag", () => {
      const player = Player.create({ nickname: "Nina", tags: new Set(["reader"]) });
      const updated = Player.removeTag("gamer")(player);

      expect(updated.tags.has("reader")).toBe(true);
      expect(updated.tags.size).toBe(1);
    });
  });

  describe("wishlist operations", () => {
    test("should add item to wishlist", () => {
      const player = Player.create({ nickname: "Oscar", tags: new Set() });
      const item = { name: "Book", url: "https://example.com/book" };
      const updated = Player.addItem(item)(player);

      expect(updated.wishlist).toHaveLength(1);
      expect(updated.wishlist[0]).toEqual(item);
      expect(player.wishlist).toHaveLength(0); // Original unchanged
    });

    test("should remove item from wishlist", () => {
      const item1 = { name: "Book" };
      const item2 = { name: "Camera" };
      const player: PlayerType = {
        nickname: "Paula",
        tags: new Set(),
        wishlist: [item1, item2],
      };
      const updated = Player.removeItem(item1)(player);

      expect(updated.wishlist).toHaveLength(1);
      expect(updated.wishlist[0]).toEqual(item2);
      expect(player.wishlist).toHaveLength(2); // Original unchanged
    });
  });
});
