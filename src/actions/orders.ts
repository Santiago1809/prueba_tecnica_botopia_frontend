"use server";

import { BACKEND_HOST } from "@/lib/constants";

export async function getOrdersByUser(username: string, token: string) {
  const response = await fetch(`${BACKEND_HOST}/api/get-sales/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  const data = await response.json();
  return data;
}
