import { describe, expect, test } from "bun:test";
import Player, { playerSchema, type Player as PlayerType } from "./player";

describe("Player", () => {
  describe("create", () => {
    test("should create a player with empty wishlist and tags", () => {
      const player = Player.create({ nickname: "Alice", tags: [] });
      
      expect(player.nickname).toBe("Alice");
      expect(player.wishlist).toEqual([]);
      expect(Array.isArray(player.tags)).toBe(true);
      expect(player.tags.length).toBe(0);
    });
  });

  describe("tags - JSON serialization", () => {
    test("should parse player with Set tags", () => {
      const playerData = {
        nickname: "Bob",
        tags: ["gamer", "reader", "cook"],
        wishlist: [],
      };

      const result = playerSchema.safeParse(playerData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data.tags)).toBe(true);
        expect(result.data.tags.length).toBe(3);
        expect(result.data.tags).toContain("gamer");
        expect(result.data.tags).toContain("reader");
        expect(result.data.tags).toContain("cook");
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
        expect(Array.isArray(result.data.tags)).toBe(true);
        expect(result.data.tags.length).toBe(2);
        expect(result.data.tags).toContain("artist");
        expect(result.data.tags).toContain("musician");
      }
    });

    test("should handle JSON.parse and JSON.stringify round-trip", () => {
      const original: PlayerType = {
        nickname: "Eve",
        tags: ["dancer", "singer", "writer"],
        wishlist: [
          { name: "Book", url: "https://example.com/book" },
          { name: "Camera" },
        ],
      };

      // Serialize and parse back
      const serialized = JSON.stringify(original);
      const parsed = JSON.parse(serialized);
      const validated = playerSchema.safeParse(parsed);

      expect(validated.success).toBe(true);
      if (validated.success) {
        expect(validated.data.nickname).toBe(original.nickname);
        expect(Array.isArray(validated.data.tags)).toBe(true);
        expect(validated.data.tags.length).toBe(3);
        expect(validated.data.tags).toContain("dancer");
        expect(validated.data.tags).toContain("singer");
        expect(validated.data.tags).toContain("writer");
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
        expect(Array.isArray(result.data.tags)).toBe(true);
        expect(result.data.tags.length).toBe(0);
      }
    });

    test("should keep duplicates when parsing array", () => {
      const playerData = {
        nickname: "Iris",
        tags: ["developer", "developer", "writer", "developer"],
        wishlist: [],
      };

      const result = playerSchema.safeParse(playerData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(Array.isArray(result.data.tags)).toBe(true);
        expect(result.data.tags.length).toBe(4);
        expect(result.data.tags.filter(t => t === "developer").length).toBe(3);
        expect(result.data.tags).toContain("writer");
      }
    });
  });

  describe("addTag", () => {
    test("should add a tag to player", () => {
      const player = Player.create({ nickname: "Jack", tags: [] });
      const updated = Player.addTag("gamer")(player);

      expect(updated.tags).toContain("gamer");
      expect(updated.tags.length).toBe(1);
      expect(player.tags.length).toBe(0); // Original unchanged
    });

    test("should add multiple tags", () => {
      const player = Player.create({ nickname: "Kate", tags: [] });
      const updated = Player.addTag("reader")(Player.addTag("writer")(player));

      expect(updated.tags).toContain("reader");
      expect(updated.tags).toContain("writer");
      expect(updated.tags.length).toBe(2);
    });

    test("should not add duplicate tags", () => {
      const player = Player.create({ nickname: "Leo", tags: ["gamer"] });
      const updated = Player.addTag("gamer")(player);

      expect(updated.tags.length).toBe(1);
      expect(updated.tags).toContain("gamer");
    });
  });

  describe("removeTag", () => {
    test("should remove a tag from player", () => {
      const player = Player.create({ nickname: "Mia", tags: ["gamer", "reader"] });
      const updated = Player.removeTag("gamer")(player);

      expect(updated.tags).not.toContain("gamer");
      expect(updated.tags).toContain("reader");
      expect(updated.tags.length).toBe(1);
      expect(player.tags.length).toBe(2); // Original unchanged
    });

    test("should handle removing non-existent tag", () => {
      const player = Player.create({ nickname: "Nina", tags: ["reader"] });
      const updated = Player.removeTag("gamer")(player);

      expect(updated.tags).toContain("reader");
      expect(updated.tags.length).toBe(1);
    });
  });

  describe("wishlist operations", () => {
    test("should add item to wishlist", () => {
      const player = Player.create({ nickname: "Oscar", tags: [] });
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
        tags: [],
        wishlist: [item1, item2],
      };
      const updated = Player.removeItem(item1)(player);

      expect(updated.wishlist).toHaveLength(1);
      expect(updated.wishlist[0]).toEqual(item2);
      expect(player.wishlist).toHaveLength(2); // Original unchanged
    });
  });
});
