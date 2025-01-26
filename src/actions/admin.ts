"use server";
import { BACKEND_HOST } from "@/lib/constants";
import { Stats } from "@/types/admin";

export async function getStats(
  token: string
): Promise<Stats | { error: string }> {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/admin-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: (error as Error).message };
  }
}
