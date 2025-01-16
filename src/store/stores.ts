import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Store {
  id: number,
  documentId: string,
  Name: string,
  Products: Array<StoreProduct>
}
interface StoreProduct {
  id: number,
  documentId: string
}

interface StoreStore {
  stores: Store[];
  setStores: (value: Store[]) => void;
}
export const useStoresStore = create<StoreStore>()(
  persist(
    (set) => ({
      stores: [],
      setStores: (value) => set({ stores: value }),
    }),
    {
      name: "stores-storage", // Nombre clave en localStorage
    }
  )
)