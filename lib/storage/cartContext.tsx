"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CartItem, ProductItem, StoreName } from "@/lib/products/matcher";
import { loadCart, saveCart } from "./localStore";

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  addItem: (product: ProductItem, store?: StoreName) => void;
  updateQty: (productId: string, store: StoreName, delta: number) => void;
  changeStore: (productId: string, oldStore: StoreName, newStore: StoreName, product?: ProductItem) => void;
  removeItem: (productId: string, store: StoreName) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const persist = (next: CartItem[]) => {
    setItems(next);
    saveCart(next);
  };

  const addItem = (product: ProductItem, store?: StoreName) => {
    const offer = (store ? product.stores.find((s) => s.store === store) : null) || product.stores[0];
    if (!offer) return;

    const existingIdx = items.findIndex(
      (i) => i.productId === product.id && i.selectedStore === offer.store
    );
    if (existingIdx >= 0) {
      const next = items.map((item, idx) =>
        idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
      );
      persist(next);
      return;
    }

    const nextItem: CartItem = {
      productId: product.id,
      name: product.name,
      genericName: product.genericName,
      packSize: product.packSize,
      image: product.image,
      selectedStore: offer.store,
      priceINR: offer.priceINR,
      storeUrl: offer.url,
      quantity: 1,
    };
    persist([...items, nextItem]);
  };

  const updateQty = (productId: string, store: StoreName, delta: number) => {
    const next = items
      .map((i) =>
        i.productId === productId && i.selectedStore === store
          ? { ...i, quantity: i.quantity + delta }
          : i
      )
      .filter((i) => i.quantity > 0);
    persist(next);
  };

  const changeStore = (productId: string, oldStore: StoreName, newStore: StoreName, product?: ProductItem) => {
    const offer = product?.stores.find((s) => s.store === newStore);
    const next = items.map((i) => {
      if (i.productId === productId && i.selectedStore === oldStore) {
        return {
          ...i,
          selectedStore: newStore,
          priceINR: offer ? offer.priceINR : i.priceINR,
          storeUrl: offer ? offer.url : i.storeUrl,
        };
      }
      return i;
    });
    persist(next);
  };

  const removeItem = (productId: string, store: StoreName) => {
    persist(items.filter((i) => !(i.productId === productId && i.selectedStore === store)));
  };

  const clearCart = () => persist([]);

  const totalCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, totalCount, addItem, updateQty, changeStore, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
