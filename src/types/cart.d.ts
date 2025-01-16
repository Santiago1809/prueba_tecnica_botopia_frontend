export interface CartItem {
  id: string;
  documentId: string
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
export interface UseShoppingCart {
  cart: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
export interface MetadataCartItem {
  id: number
  documentId: string
  quantity: number
  imageUrl: string
  store_id: number
}