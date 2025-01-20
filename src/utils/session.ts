"use client";
import { useAuthStore } from "@/store/authStore";

export const getOrCreateSessionId = async () => {
  const { user_id } = useAuthStore();
  return user_id !== 0 ? user_id : "";
};
