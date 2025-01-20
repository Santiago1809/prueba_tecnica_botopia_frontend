import { BACKEND_HOST } from "@/lib/constants";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51QfpIGLbFsg2Knh9YoEVfDRhDZjBKRRv8XTUmlXIsgHo2Ktayhyr3Pell72rR0g3ma6ZE3hkbDjjpVVUvJVEBSZ400gidTQWo0"
);
const endpointSecret = "whsec_N5zxKjzNCtBqDsUJm9MWut0ajpdmfehv";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const stripeSignature = headersList.get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      endpointSecret
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      if (!session.metadata) {
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      }
      const sendingData = JSON.parse(session.metadata.sendingData);
      const cart = JSON.parse(session.metadata.cart);
      const totalPrice = session.metadata.totalPrice;
      const response = await fetch(`${BACKEND_HOST}/api/report-new-sale`, {
        method: "POST",
        body: JSON.stringify({ sendingData, Products: cart, totalPrice }),
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return new Response(null, { status: 200 });
}