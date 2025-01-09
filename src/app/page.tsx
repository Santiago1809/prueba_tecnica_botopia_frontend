import Container from "@/components/custom/Container";
import Products from "@/components/custom/Products/Products";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const featuredProducts = [
    {
      id: 1,
      name: "Smartphone X",
      price: 599,
      images: ["/placeholder.svg"],
      category: {
        id: 1,
        Name: "Smartphones",
      },
    },
    {
      id: 2,
      name: "Laptop Pro",
      price: 1299,
      images: ["/placeholder.svg"],
      category: {
        id: 2,
        Name: "Laptops",
      },
    },
    {
      id: 3,
      name: "Auriculares Inalámbricos",
      price: 149,
      images: ["/placeholder.svg"],
      category: {
        id: 3,
        Name: "Audio",
      },
    },
    {
      id: 4,
      name: "Smartwatch Elite",
      price: 299,
      images: ["/placeholder.svg"],
      category: {
        id: 4,
        Name: "Smartwatches",
      },
    },
  ];
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Products products={featuredProducts} />
        </div>
      </section>
    </Container>
  );
}
