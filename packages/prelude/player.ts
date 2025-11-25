
export type WishlistItem = {
    name: string;
    url?: string;
}

export type Player = {
  nickname: string;
  wishlist: WishlistItem[];
};

type CreatePlayer = Omit<Player, "id" | "wishlist">;

const create = ({ nickname }: CreatePlayer): Player => ({
  wishlist: [],
  nickname,
});

const addItem = (item: WishlistItem) => (player: Player): Player => ({ ...player, wishlist: [...player.wishlist, item] })

const removeItem = (item: WishlistItem) => (player: Player): Player => ({ ...player, wishlist: player.wishlist.filter(i => i !== item)})

export default {
  create,
  addItem,
  removeItem,
};
