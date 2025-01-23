"use client";
import './style.css'

import { fetchProduct, insertView } from "@/actions/products";
import Container from "@/components/custom/Container";
import ProductDetails from "@/components/custom/Products/ProductDetails";
import ProductReviews from "@/components/custom/Products/ProductReviews";
import RecommendedProducts from "@/components/custom/Products/RecommendedProducts";
import Loader from "@/components/Loader";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types/products";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>();
  const id = resolvedParams.id;
  const { user_id } = useAuthStore();

  useEffect(() => {
    const getProduct = async () => {
      const fetchedProduct = await fetchProduct(id);
      if (fetchedProduct) setProduct(fetchedProduct);
      else {
        router.push("/404");
        return null;
      }
    };
    getProduct();
  }, [id]);
  useEffect(() => {
    insertView(id, user_id);
  }, [id]);

  return (
    <Container>
      {product ? <ProductDetails product={product} /> : <Loader size="lg" />}
      <RecommendedProducts />
      <ProductReviews />
    </Container>
  );
}
