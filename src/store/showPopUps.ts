import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PopupStore {
  canShow: boolean;
  setCanShow: (value: boolean) => void;
}
export const usePopUpStore = create<PopupStore>()(
  persist(
    (set) => ({
      canShow: true,
      setCanShow: (value) => set({ canShow: value }),
    }),
    {
      name: "popup-store",
    }
  )
);
