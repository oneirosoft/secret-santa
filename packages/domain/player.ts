import z from "zod";

export const wishlistItemSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
});

export type WishlistItem = z.infer<typeof wishlistItemSchema>;

export const playerSchema = z.object({
  nickname: z.string(),
  tags: z.array(z.string()),
  wishlist: z.array(wishlistItemSchema),
});

export type Player = z.infer<typeof playerSchema>;

type CreatePlayer = Omit<Player, "wishlist">;

const create = ({ nickname, tags }: CreatePlayer): Player => ({
  wishlist: [],
  nickname,
  tags,
});

const addItem =
  (item: WishlistItem) =>
    (player: Player): Player => ({
      ...player,
      wishlist: [...player.wishlist, item],
    });

const removeItem =
  (item: WishlistItem) =>
    (player: Player): Player => ({
      ...player,
      wishlist: player.wishlist.filter((i) => i !== item),
    });

const addTag =
  (tag: string) =>
    (player: Player): Player => ({
      ...player,
      tags: player.tags.includes(tag) ? player.tags : [...player.tags, tag],
    });

const removeTag =
  (tag: string) =>
    (player: Player): Player => ({
      ...player,
      tags: player.tags.filter((t) => t !== tag),
    });

export default {
  create,
  addItem,
  removeItem,
  addTag,
  removeTag,
};
