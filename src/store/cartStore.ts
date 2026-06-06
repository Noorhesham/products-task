import { create } from "zustand";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product) => {
    const existing = get().items.find((i) => i.id === product.id);
    if (existing) {
      set((s) => ({
        items: s.items.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)),
        isOpen: true,
      }));
    } else {
      set((s) => ({
        items: [...s.items, { ...product, quantity: 1 }],
        isOpen: true,
      }));
    }
  },

  removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, qty) => {
    if (qty <= 0) {
      get().removeItem(id);
      return;
    }
    set((s) => ({
      items: s.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));

// Derived helpers used in components
export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartItemCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
