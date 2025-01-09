"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/custom/Container";
import { NEXT_PUBLIC_BACKEND_HOST } from "@/lib/constants";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ExternaProductData, Product } from "@/types/products";
import { CopFormatNumber } from "@/lib/utils";
import { ShoppingBag, ShoppingCart } from "lucide-react";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const [product, setProduct] = useState<Product>();
  const id = resolvedParams.id;
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `${NEXT_PUBLIC_BACKEND_HOST}/api/products/${id}?populate[Images][fields][0]=url`
      );
      const { data } = await response.json();
      const info = data as ExternaProductData;

      console.log(info);

      const externalProduct: Product = {
        id: info.documentId,
        name: info.Name,
        description: info.Description,
        price: info.Price,
        category: info.Category,
        images: info.Images.map(
          (image) => `${NEXT_PUBLIC_BACKEND_HOST}${image.url}`
        ),
        stock: info.Stock,
      };
      setProduct(externalProduct);
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    // Aquí iría la lógica para añadir al carrito
    toast({
      title: "Producto añadido al carrito",
      description: `${quantity} x ${product?.name} añadido al carrito.`,
    });
  };

  return (
    <Container>
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Carousel className="w-full max-w-md mx-auto">
                <CarouselContent>
                  {product?.images.map((link, index) => (
                    <CarouselItem key={index}>
                      <div className="p-2">
                        <Card className="border-none shadow-none">
                          <CardContent className="flex aspect-square items-center justify-center p-0">
                            <div className="relative w-full h-full">
                              <Image
                                src={link}
                                alt={`${product.name} - Vista ${index + 1}`}
                                fill
                                className="object-contain rounded-lg"
                                priority={index === 0}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{product?.name}</h1>
              <p className="text-4xl font-bold text-primary mb-4">
                {!isNaN(product?.price as number)
                  ? CopFormatNumber(product?.price as number)
                  : "Loading..."}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="text-xl font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              <div className="mb-4">
                {product?.stock ? (
                  product.stock >= 20 ? (
                    <p className="text-green-500">Disponible</p>
                  ) : (
                    <p className="text-red-500">
                      ¡Últimas {product.stock} unidades disponibles!
                    </p>
                  )
                ) : (
                  <p className="text-red-500">No disponible</p>
                )}
              </div>
              <div className="bg-gray-300 rounded-lg">
                <p></p>
              </div>
              <div className="flex flex-col space-y-4 mb-6">
                <p className="font-semibold">Selecciona un color:</p>
                <div className="flex gap-4">
                  {['negro', 'rojo', 'azul', 'dorado', 'blanco'].map((color) => (
                    <div key={color} className="flex items-center">
                      <input
                        type="radio"
                        id={color}
                        name="color"
                        value={color}
                        className="hidden peer"
                      />
                      <label
                        htmlFor={color}
                        className="px-4 py-2 border rounded-lg cursor-pointer peer-checked:bg-primary peer-checked:text-white capitalize"
                      >
                        {color}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-orange-500 hover:bg-orange-500/90"
                >
                  <ShoppingCart />
                  Añadir al carrito
                </Button>
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-transparent hover:bg-blue-400 border border-blue-400 text-blue-400"
                >
                  <ShoppingBag />
                  Comprar ahora
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <p className="text-gray-600 my-6">{product?.description}</p>
    </Container>
  );
}
