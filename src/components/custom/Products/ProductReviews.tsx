"use client";

import { getReviews } from "@/actions/reviews";
import { Review } from "@/types/review";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductReview from "./ProductReview";
import ProductReviewForm from "./ProductReviewForm";
import { useAuthStore } from "@/store/authStore";
export default function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { isLoggedIn } = useAuthStore();
  const { id } = useParams();
  useEffect(() => {
    (async () => {
      const response = await getReviews(id as string);
      setReviews(response);
    })();
  }, []);

  return (
    <section>
      <h2 className="text-3xl font-bold my-10">Reseñas del producto</h2>
      {reviews.map((review, index) => (
        <ProductReview review={review} key={index} />
      ))}
      {isLoggedIn && <ProductReviewForm setReviews={setReviews} />}
    </section>
  );
}
