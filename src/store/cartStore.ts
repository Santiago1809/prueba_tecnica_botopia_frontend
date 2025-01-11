import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definimos los tipos
interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      totalItems: 0,
      totalPrice: 0,

      // Agregar un producto al carrito
      addItem: (item) => {
        set((state) => {
          const existingItem = state.cart.find(
            (cartItem) => cartItem.id === item.id
          );

          if (existingItem) {
            // Si el producto ya existe, incrementamos su cantidad
            const updatedCart = state.cart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
                : cartItem
            );

            return {
              cart: updatedCart,
              totalItems: updatedCart.reduce(
                (sum, cartItem) => sum + cartItem.quantity,
                0
              ),
              totalPrice: updatedCart.reduce(
                (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
                0
              ),
            };
          }

          // Si el producto no existe, lo agregamos al carrito
          const newCart = [...state.cart, item];
          return {
            cart: newCart,
            totalItems: newCart.reduce(
              (sum, cartItem) => sum + cartItem.quantity,
              0
            ),
            totalPrice: newCart.reduce(
              (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
              0
            ),
          };
        });
      },

      // Eliminar un producto del carrito
      removeItem: (id) => {
        set((state) => {
          const updatedCart = state.cart.filter((item) => item.id !== id);

          return {
            cart: updatedCart,
            totalItems: updatedCart.reduce(
              (sum, cartItem) => sum + cartItem.quantity,
              0
            ),
            totalPrice: updatedCart.reduce(
              (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
              0
            ),
          };
        });
      },

      // Actualizar la cantidad de un producto
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;

        set((state) => {
          const updatedCart = state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );

          return {
            cart: updatedCart,
            totalItems: updatedCart.reduce(
              (sum, cartItem) => sum + cartItem.quantity,
              0
            ),
            totalPrice: updatedCart.reduce(
              (sum, cartItem) => sum + cartItem.price * cartItem.quantity,
              0
            ),
          };
        });
      },

      // Limpiar el carrito
      clearCart: () => {
        set({
          cart: [],
          totalItems: 0,
          totalPrice: 0,
        });
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
