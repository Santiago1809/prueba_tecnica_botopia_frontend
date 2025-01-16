"use client";
import { getMostViewedProducts } from "@/actions/products";
import { getStores } from "@/actions/stores";
import Container from "@/components/custom/Container";
import Products from "@/components/custom/Products/Products";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { useStoresStore } from "@/store/stores";
import { Product } from "@/types/products";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const { setStores } = useStoresStore();
  const [featuredProducts, setFeaturedProducts] = useState<Product[] | null>();
  useEffect(() => {
    (async () => {
      const fetchedStores = await getStores();
      setStores(fetchedStores);
      const products = getMostViewedProducts();
      setFeaturedProducts(await products);
    })();
  }, []);

  return (
    <Container>
      <section className="mb-12">
        <div className="relative h-96 rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg"
            alt="Banner promocional"
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Grandes ofertas en tecnología
              </h1>
              <Button asChild>
                <Link href="/products">Ver ofertas</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
    </Container>
  );
}
