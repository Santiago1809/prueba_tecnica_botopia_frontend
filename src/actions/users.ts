"use server";

import { BACKEND_HOST } from "@/lib/constants";

export async function login(prevState: unknown, queryData: FormData) {
  try {
    const data = Object.fromEntries(queryData.entries());
    const response = await fetch(`${BACKEND_HOST}/api/auth/local`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Error al iniciar sesión");
    }

    const { user, jwt } = await response.json();
    return { user, jwt };
  } catch {
    return null;
  }
}
