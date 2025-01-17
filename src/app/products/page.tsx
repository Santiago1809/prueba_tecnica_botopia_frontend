"use client";

import Container from "@/components/custom/Container";
import ProductsContent from "@/components/custom/Products/ProductsContent";
import Loader from "@/components/Loader";
import { Suspense } from "react";

export default function ProductsPage() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
      <Suspense fallback={<Loader size="lg" />}>
        <ProductsContent />
      </Suspense>
    </Container>
  );
}
