'use client'
import { CartItem, UseShoppingCart } from "@/types/cart";
import { useEffect, useState } from "react";

const useShoppingCart = (): UseShoppingCart => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("shopping-cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    localStorage.setItem("shopping-cart", JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: CartItem) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        // Si el item ya existe, incrementar la cantidad
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      // Si es un item nuevo, añadirlo con cantidad 1
      return [...currentCart, { ...item, quantity: item.quantity }];
    });
  };

  const removeItem = (itemId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 0) return;

    setCart((currentCart) => {
      if (quantity === 0) {
        return currentCart.filter((item) => item.id !== itemId);
      }

      return currentCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };
};

export { useShoppingCart };
