import { create } from "zustand";

interface UIState {
  isMobileMenuOpen: boolean;
  cartCount: number;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  setCartCount: (count: number) => void;
  incrementCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  cartCount: 0,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  setCartCount: (count) => set({ cartCount: count }),
  incrementCart: () => set((state) => ({ cartCount: state.cartCount + 1 })),
}));
