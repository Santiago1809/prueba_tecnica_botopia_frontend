"use client";

import { getRecommendedProducts } from "@/actions/products";
import { useAuthStore } from "@/store/authStore";
import { Product } from "@/types/products";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import Products from "./Products/Products";

export default function RecommendedProducts() {
  const { token } = useAuthStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  useEffect(() => {
    (async () => {
      const products = await getRecommendedProducts(token);
      console.log(products);
      setFeaturedProducts(products);
    })();
    (() => {
      console.log(featuredProducts);
    })();
  }, []);
  return (
    <section>
      <h2 className="text-3xl font-bold mt-24 mb-6">Productos recomendados</h2>
      {featuredProducts !== undefined && featuredProducts !== null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Products products={featuredProducts} />
        </div>
      ) : (
        <div>
          <Loader size="md" />
        </div>
      )}
    </section>
  );
}
