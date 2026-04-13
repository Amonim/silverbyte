import { useEffect, useState } from "react";
import type { CartItem } from "../types/cart";
import {
  clearCart,
  decreaseQuantity,
  getCart,
  getCartCount,
  getCartTotal,
  increaseQuantity,
  removeFromCart,
  updateQuantity,
} from "../utils/cart";

function useCart() {
  const [items, setItems] = useState<CartItem[]>(getCart());
  const [count, setCount] = useState(getCartCount());
  const [total, setTotal] = useState(getCartTotal());

  const syncCart = () => {
    setItems(getCart());
    setCount(getCartCount());
    setTotal(getCartTotal());
  };

  useEffect(() => {
    window.addEventListener("cart-updated", syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener("cart-updated", syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  return {
    items,
    count,
    total,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    clearCart,
    syncCart,
  };
}

export default useCart;
