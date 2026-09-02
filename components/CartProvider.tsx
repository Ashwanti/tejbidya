"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Tea } from "@/lib/teas";

export type CartItem = {
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  total: number;
  isOpen: boolean;
  toast: string | null;
  addItem: (tea: Tea, quantity?: number) => void;
  updateQuantity: (slug: string, nextQty: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: (slug: string) => number;
};

const CART_KEY = "tejbidya-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function sanitizeItem(raw: unknown): CartItem | null {
  if (!raw || typeof raw !== "object") return null;

  const item = raw as Record<string, unknown>;
  const slug = typeof item.slug === "string" ? item.slug.trim() : "";
  const name = typeof item.name === "string" ? item.name.trim() : "";
  const category = typeof item.category === "string" ? item.category : "Tea";
  const image = typeof item.image === "string" ? item.image : "";
  const price = Number(item.price);
  const quantity = Number(item.quantity);

  if (!slug || !name || !Number.isFinite(price) || price < 0) return null;
  if (!Number.isFinite(quantity) || quantity < 1) return null;

  return {
    slug,
    name,
    category,
    image,
    price,
    quantity: Math.floor(quantity),
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (!saved) return;

      const parsed = JSON.parse(saved);
      const next = Array.isArray(parsed) ? parsed.map(sanitizeItem).filter(Boolean) : [];
      setItems(next as CartItem[]);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota / privacy issues.
    }
  }, [items]);

  useEffect(() => {
    if (!toast) return;
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    };
  }, [toast]);

  const addItem = useCallback((tea: Tea, quantity = 1) => {
    setItems((current) => {
      const safeQty = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
      const existing = current.find((item) => item.slug === tea.slug);

      if (existing) {
        return current.map((item) =>
          item.slug === tea.slug ? { ...item, quantity: item.quantity + safeQty } : item
        );
      }

      return [
        ...current,
        {
          slug: tea.slug,
          name: tea.name,
          category: tea.category,
          image: tea.hero.src,
          price: typeof tea.price === "number" ? tea.price : 0,
          quantity: safeQty,
        },
      ];
    });

    setIsOpen(true);
    setToast(`${tea.name} added to cart`);
  }, []);

  const updateQuantity = useCallback((slug: string, nextQty: number) => {
    const safeQty = Number.isFinite(nextQty) ? Math.max(0, Math.floor(nextQty)) : 0;
    setItems((current) => {
      if (safeQty <= 0) {
        return current.filter((item) => item.slug !== slug);
      }
      return current.map((item) =>
        item.slug === slug ? { ...item, quantity: safeQty } : item
      );
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((current) => current.filter((item) => item.slug !== slug));
    setToast("Item removed");
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setToast("Cart cleared");
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = useCallback(
    (slug: string) => items.find((item) => item.slug === slug)?.quantity ?? 0,
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count,
      subtotal,
      total: subtotal,
      isOpen,
      toast,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      itemCount,
    }),
    [items, count, subtotal, isOpen, toast, addItem, updateQuantity, removeItem, clearCart, openCart, closeCart, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
