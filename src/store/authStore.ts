import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  auth: boolean; // true = administrador, false = usuario normal
  setAuth: (value: boolean) => void;
  token: string; // Token de autenticación
  setToken: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  userName: string;
  setUserName: (value: string) => void;
  user_id: number;
  setId: (value: number) => void;
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
      email: "",
      setEmail: (value) => set({ email: value }),
      userName: "",
      setUserName: (value) => set({ userName: value }),
      user_id: 0,
      setId: (value: number) => set({ user_id: value }),
      logOut: () => {
        set({
          isLoggedIn: false,
          auth: false,
          token: "",
          name: "",
          email: "",
          userName: "",
        });
      },
    }),
    {
      name: "auth-storage", // Nombre clave en localStorage
    }
  )
);
