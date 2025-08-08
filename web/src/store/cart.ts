import { create } from 'zustand';

type CartItem = { id: number; name: string; price: number; imageUrl?: string; quantity: number };

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  add: (item, qty = 1) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.id === item.id);
    if (idx >= 0) items[idx].quantity += qty;
    else items.push({ ...item, quantity: qty });
    set({ items });
  },
  remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  clear: () => set({ items: [] }),
  total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
}));


