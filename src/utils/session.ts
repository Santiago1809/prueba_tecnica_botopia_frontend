import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export const getOrCreateSessionId = async () => {
  const cookieStore = cookies();
  const sessionId = await cookieStore.then((cookies) =>
    cookies.get("sessionId")
  );

  if (sessionId) {
    return sessionId.value;
  }

  // Crear nuevo sessionId si no existe
  const newSessionId = uuidv4();

  // Configurar la cookie
  cookieStore.then((cookies) =>
    cookies.set("sessionId", newSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60, // 30 días
    })
  );

  return newSessionId;
};
