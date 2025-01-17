"use server";
import { CartItem, MetadataCartItem } from "@/types/cart";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51QfpIGLbFsg2Knh9YoEVfDRhDZjBKRRv8XTUmlXIsgHo2Ktayhyr3Pell72rR0g3ma6ZE3hkbDjjpVVUvJVEBSZ400gidTQWo0"
);

export async function POST(request: NextRequest) {
  const { cart, sendingData, costOfSending, totalPrice } = await request.json();

  if (sendingData.paymentMethod === "card") {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        ...cart.map((item: CartItem) => ({
          price_data: {
            currency: "cop",
            product_data: {
              name: item.name,
              images: [item.imageUrl],
            },
            unit_amount: item.price,
          },
          quantity: item.quantity,
        })),
        {
          price_data: {
            currency: "cop",
            product_data: {
              name: "Costo de envío",
            },
            unit_amount: Number.parseInt(costOfSending) * 100, // Monto fijo de 10000 COP para el envío
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        sendingData: JSON.stringify(sendingData),
        cart: JSON.stringify(
          cart.map((item: MetadataCartItem) => {
            return {
              id: item.id,
              documentId: item.documentId,
              quantity: item.quantity,
              store_id: item.store_id,
            };
          })
        ),
        totalPrice,
      },
      success_url: "http://localhost:3000/success",
    });
    return NextResponse.json(session);
  }
  return NextResponse.json("ok");
}
