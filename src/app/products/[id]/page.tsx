"use client";

import { fetchProduct, insertView } from "@/actions/actions";
import Container from "@/components/custom/Container";
import ProductDetails from "@/components/custom/Products/ProductDetails";
import Loader from "@/components/Loader";
import { Product } from "@/types/products";
import { use, useEffect, useState } from "react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product | null>();
  const id = resolvedParams.id;

  useEffect(() => {
    const getProduct = async () => {
      const fetchedProduct = await fetchProduct(id);
      if (fetchedProduct) setProduct(fetchedProduct);
      else {
        window.location.href = "/404";
        return null;
      }
    };
    getProduct();
  }, [id]);
  useEffect(() => {
    insertView(id);
  }, [id]);

  return (
    <Container>
      {product ? <ProductDetails product={product} /> : <Loader size="lg" />}
    </Container>
  );
}
