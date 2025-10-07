import { createContext, useContext, useMemo, useState } from 'react';
import { Product } from '../types/api';

export type CartEntry = {
  product: Product;
  qty: number;
};

type CartContextValue = {
  cartItems: CartEntry[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQty: (productId: number, qty: number) => void;
  totalCents: number;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartEntry[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQty = (productId: number, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const clear = () => setCartItems([]);

  const totalCents = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.product.priceCents * item.qty, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, totalCents, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
