"use server";

import { BACKEND_HOST } from "@/lib/constants";
import { User } from "@/types/user";
import * as z from "zod";

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

const registerBackendSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
});

export async function register(prevState: unknown, queryData: FormData) {
  try {
    const data = Object.fromEntries(queryData.entries());
    const info = registerBackendSchema.parse(data);

    // Primera petición: Registro de usuario
    const registerResponse = await fetch(
      `${BACKEND_HOST}/api/auth/local/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      }
    );

    if (!registerResponse.ok) {
      const errorData = await registerResponse.json();
      console.error("Error de registro:", errorData);
      throw new Error(errorData.error?.message || "Error al registrar usuario");
    }

    const { jwt, user } = await registerResponse.json();

    // Segunda petición: Actualización de datos adicionales
    const updateResponse = await fetch(`${BACKEND_HOST}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        display_name: data.display_name,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error("Error al actualizar datos:", errorData);
      throw new Error("Error al actualizar datos de usuario");
    }

    const userData = await updateResponse.json();
    return { jwt, userData };
  } catch (error) {
    console.error("Error en el proceso de registro:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Error desconocido en el registro" };
  }
}
export async function getUsers(token: string) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/list-users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los usuarios");
    }

    return await response.json();
  } catch {
    return [];
  }
}

export async function deleteUser(token: string, userId: string) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/list-users/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el usuario");
    }

    return true;
  } catch {
    return false;
  }
}
export async function editUser(user: User, token: string) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/list-users/${user.documentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: user,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el usuario");
    }

    return true;
  } catch {
    return false;
  }
}
