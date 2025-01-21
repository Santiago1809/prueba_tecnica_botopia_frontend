"use server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import paypal from "@paypal/checkout-server-sdk";
import {
  BACKEND_HOST,
  PAYPAL_CLIENT_ID,
  PAYPAL_SECRET,
  STRIPE_KEY,
} from "@/lib/constants";

const stripe = new Stripe(STRIPE_KEY);
const clientId = PAYPAL_CLIENT_ID;
const clientSecret = PAYPAL_SECRET;

// Tasa de cambio de COP a USD
const EXCHANGE_RATE = 4354.05;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

export async function POST(request) {
  const { cart, sendingData, costOfSending, totalPrice, totalItems } =
    await request.json();

  if (sendingData.paymentMethod === "card") {
    return await strapiPayment();
  } else if (sendingData.paymentMethod === "paypal") {
    return await paypalPayment();
  }
  return NextResponse.json("ok");

  async function strapiPayment() {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        ...cart.map((item) => ({
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
            unit_amount: Number.parseInt(costOfSending) * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        sendingData: JSON.stringify(sendingData),
        cart: JSON.stringify(
          cart.map((item) => {
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

  async function paypalPayment() {
    // Conversión de valores a USD
    const itemsTotalUSD = cart.reduce(
      (acc, item) => acc + (item.price / 100 / EXCHANGE_RATE) * item.quantity,
      0
    );

    const costOfSendingUSD = costOfSending / EXCHANGE_RATE;

    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: (itemsTotalUSD + costOfSendingUSD).toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        user_action: "PAY_NOW",
        payment_method: {
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
      },
    });

    try {
      const response = await client.execute(request);
      const reportResponse = await fetch(
        `${BACKEND_HOST}/api/report-new-sale`,
        {
          method: "POST",
          body: JSON.stringify({
            sendingData,
            Products: cart.map((item) => {
              return {
                id: item.id,
                quantity: item.quantity,
                store_id: item.store_id,
                documentId: item.documentId,
              };
            }),
            totalPrice,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return NextResponse.json({
        id: response.result.id,
      });
    } catch (error) {
      console.error("Error creating PayPal order:", error);
      throw new Error("Error al procesar el pago con PayPal");
    }
  }
}
