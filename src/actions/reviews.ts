"use server";

import { BACKEND_HOST } from "@/lib/constants";
import { Review } from "@/types/review";

export async function getReviews(id: string): Promise<Review[]> {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/reviews/${id}`);
    if (!response.ok) throw new Error("Failed to fetch reviews");
    const reviews = await response.json();
    return reviews;
  } catch (error) {
    return [];
  }
}

export async function createReview(
  token: string,
  productId: string,
  text: string,
  user_email: string
): Promise<Review[]> {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          product: productId,
          Text: text,
          user: user_email
        },
      }),
    });
    if (!response.ok) throw new Error("Failed to create review");
    return await response.json();
  } catch (error) {
    return [];
  }
}
