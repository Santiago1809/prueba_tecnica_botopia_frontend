import { getOrders } from "@/actions/orders";
import { getProducts } from "@/actions/products";
import { BACKEND_TOKEN_AI } from "@/lib/constants";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const products = await getProducts("");
    const orders = await getOrders(BACKEND_TOKEN_AI as string);

    // Convert products and orders to strings
    const productsString = JSON.stringify(products, null, 2);
    const ordersString = JSON.stringify(orders, null, 2);

    // Prepare the messages array with system messages and user messages
    const fullMessages = [
      { role: "system", content: `Products data: ${productsString}` },
      { role: "system", content: `Orders data: ${ordersString}` },
      { role: "system", content: "Solo responderás en español" },
      {
        role: "system",
        content:
          "Cada recomendación será basada solo en la lista de productos disponible, no podrás inventarte productos o sugerir según tu opinión",
      },
      {
        role: "system",
        content:
          "Se conciso y directo, al usuario no le interesa saber más información de la que solicita.",
      },
      {
        role: "system",
        content:
          "Las recomendaciones, hazlas en listas donde muestres,el nombre, una imagen y el precio del producto; el precio muestralo en formato de pesos",
      },
      {
        role: "system",
        content:
          "No añadirás información adicional a las cards, solo lo indicado",
      },
      {
        role: "system",
        content:
          "No generes markdown, donde se mostrará la información es capaz de renderizar html",
      },
      {
        role: "system",
        content:
          "No harás más de tres recomendaciones, no podrás usar un producto 2 veces en una misma recomendación",
      },
      ...messages,
    ];

    // Generate the content stream
    const result = await streamText({
      model: google("gemini-1.5-flash-exp-0827"),
      messages: fullMessages,
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in chat request:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred on the server" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
