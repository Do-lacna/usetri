import { create } from "zustand";
import { ShopCart } from "../network/model";

type CartState = ShopCart & {
  mirrorCartState: (cart: ShopCart) => void;
};

// Define the cart store
const useCartStore = create<CartState>((set) => ({
  // State
  items: [],
  totalPrice: 0,
  availableShopIds: [],
  categories: [],
  specificProducts: [],

  // Actions

  mirrorCartState: (cart: ShopCart) =>
    set((oldCart) => {
      // just return the new cart returned by BE for now
      return cart;
    }),
  //   addItem: (product) =>
  //     set((state) => {
  //       const existingItem = state.items.find((item) => item.id === product.id);

  //       if (existingItem) {
  //         // If item exists, increment quantity
  //         const updatedItems = state.items.map((item) =>
  //           item.id === product.id
  //             ? { ...item, quantity: item.quantity + 1 }
  //             : item
  //         );

  //         return {
  //           items: updatedItems,
  //           totalAmount: state.totalAmount + product.price,
  //         };
  //       }

  //       // If item doesn't exist, add new item
  //       return {
  //         items: [...state.items, { ...product, quantity: 1 }],
  //         totalAmount: state.totalAmount + product.price,
  //       };
  //     }),

  //   removeItem: (productId) =>
  //     set((state) => {
  //       const existingItem = state.items.find((item) => item.id === productId);

  //       if (!existingItem) return state;

  //       if (existingItem.quantity === 1) {
  //         // Remove item if quantity becomes 0
  //         return {
  //           items: state.items.filter((item) => item.id !== productId),
  //           totalAmount: state.totalAmount - existingItem.price,
  //         };
  //       }

  //       // Decrease quantity by 1
  //       const updatedItems = state.items.map((item) =>
  //         item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
  //       );

  //       return {
  //         items: updatedItems,
  //         totalAmount: state.totalAmount - existingItem.price,
  //       };
  //     }),

  //   clearCart: () =>
  //     set(() => ({
  //       items: [],
  //       totalAmount: 0,
  //     })),
}));

export default useCartStore;
