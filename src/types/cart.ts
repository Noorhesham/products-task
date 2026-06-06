export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}
