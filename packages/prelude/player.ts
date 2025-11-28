export type WishlistItem = {
  name: string;
  url?: string;
};

export type Player = {
  nickname: string;
  wishlist: WishlistItem[];
  tags: Set<string>;
};

type CreatePlayer = Omit<Player, "wishlist">;

const create = ({ nickname }: CreatePlayer): Player => ({
  wishlist: [],
  nickname,
  tags: new Set(),
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
    (player: Player): Player => ({ ...player, tags: player.tags.add(tag) });

const removeTag =
  (tag: string) =>
    (player: Player): Player => {
      player.tags.delete(tag);
      return { ...player };
    };

export default {
  create,
  addItem,
  removeItem,
  addTag,
  removeTag,
};
