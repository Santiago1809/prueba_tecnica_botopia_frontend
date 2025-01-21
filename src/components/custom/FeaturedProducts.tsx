"use client";

import { getMostViewedProducts } from "@/actions/products";
import { Product } from "@/types/products";
import { useEffect, useState } from "react";
import Products from "./Products/Products";
import Loader from "../Loader";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>();
  useEffect(() => {
    (async () => {
      const products = getMostViewedProducts();
      setFeaturedProducts(await products);
    })();
  }, []);
  return (
    <section>
      <h2 className="text-3xl font-bold mb-6">Productos destacados</h2>
      {featuredProducts ? (
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
