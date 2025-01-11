import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  auth: boolean; // true = administrador, false = usuario normal
  setAuth: (value: boolean) => void;
  token: string; // Token de autenticación
  setToken: (value: string) => void;
  name: string
  setName: (value: string) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      setIsLoggedIn: (value) => set({ isLoggedIn: value }),
      auth: false,
      setAuth: (value) => set({ auth: value }),
      token: "",
      setToken: (value) => set({ token: value }),
      name: "",
      setName: (value) => set({ name: value }),
      logOut: () => {
        set({ isLoggedIn: false, auth: false, token: "", name: "" });
        window.location.href = '/';
      },
    }),
    {
      name: "auth-storage", // Nombre clave en localStorage
    }
  )
);
