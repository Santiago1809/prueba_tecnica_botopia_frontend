"use server";
import { BACKEND_HOST } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
export async function createCheckoutSession(formData: FormData) {
  const cart = JSON.parse(formData.get("cart") as string);
  const sendingData = JSON.parse(formData.get("sendingData") as string);
  const costOfSending = parseFloat(formData.get("costOfSending") as string);
  const totalPrice = parseFloat(formData.get("totalPrice") as string);

  try {
    const response = await fetch(`/api/checkout`, {
      method: "POST",
      body: JSON.stringify({
        cart,
        sendingData,
        costOfSending,
        totalPrice,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al procesar el pago");
    }

    revalidatePath("/checkout");
    redirect(data.url);
  } catch (error) {
    return { error: (error as Error).message };
  }
}

export async function createPayPalOrder(formData: FormData) {
  const cart = JSON.parse(formData.get("cart") as string);
  const sendingData = JSON.parse(formData.get("sendingData") as string);
  const costOfSending = parseFloat(formData.get("costOfSending") as string);
  const totalPrice = parseFloat(formData.get("totalPrice") as string);
  const totalItems = parseInt(formData.get("totalItems") as string);

  try {
    const response = await fetch(`http://localhost:3000/api/checkout`, {
      method: "POST",
      body: JSON.stringify({
        cart,
        sendingData,
        costOfSending,
        totalPrice,
        totalItems
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Error al crear la orden de PayPal");
    }

    return { id: data.id };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
