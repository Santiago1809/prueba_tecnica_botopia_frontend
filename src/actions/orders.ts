"use server";
import { BACKEND_HOST, HOST_LOCAL } from "@/lib/constants";
import { Order } from "@/types/order";
import { revalidatePath } from "next/cache";

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
    const response = await fetch(`${HOST_LOCAL}/api/checkout`, {
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
    return data;
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
    const response = await fetch(`${HOST_LOCAL}/api/checkout`, {
      method: "POST",
      body: JSON.stringify({
        cart,
        sendingData,
        costOfSending,
        totalPrice,
        totalItems,
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
export async function getOrders(token: string) {
  const response = await fetch(`${BACKEND_HOST}/api/get-sales`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  const data = await response.json();
  return data;
}
export async function updateOrderStage(token: string, order: Order) {

  const response = await fetch(
    `${BACKEND_HOST}/api/orders/${order.documentId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          Stage: order.Stage,
        },
      }),
    }
  );
  if (!response.ok) throw new Error(`Error ${response.status}`);
}
export async function deleteOrder(token: string, order:Order) {
  const response = await fetch(`${BACKEND_HOST}/api/orders/${order.documentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Error ${response.status}`);
  
}