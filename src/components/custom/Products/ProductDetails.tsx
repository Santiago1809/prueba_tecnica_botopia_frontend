"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useToast } from "@/hooks/use-toast";
import { CopFormatNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/products";
import { ShoppingBag, ShoppingCart, Store, Truck } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Markdown from "react-markdown";

interface Props {
  product: Product;
}

export default function ProductDetails({ product }: Props) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const handleAddToCart = () => {
    // Aquí iría la lógica para añadir al carrito
    addItem({
      id: product.id as string,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0],
      quantity,
    });
    toast({
      title: "Producto añadido al carrito",
      description: `${quantity} x ${product?.name} añadido al carrito.`,
    });
  };

  return (
    <>
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
              {product.stock !== 0 && (
                <>
                  <div className="bg-gray-200 mb-8 text-gray-600 rounded-lg px-3 py-6 flex flex-col space-y-2">
                    Disponible para:
                    <div className="flex gap-x-6 bg-gray-400 p-2 rounded-lg text-white">
                      <Store />
                      Recoger en tienda
                    </div>
                    <div className="flex gap-x-6 bg-gray-400 p-2 rounded-lg text-white">
                      <Truck />
                      Entrega a domicilio
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-orange-500 hover:bg-orange-500/90 transition-colors duration-300"
                    >
                      <ShoppingCart />
                      Añadir al carrito
                    </Button>
                    <Button
                      onClick={handleAddToCart}
                      className="w-full bg-transparent hover:bg-blue-400 border hover:text-white border-blue-400 text-blue-400 transition-colors duration-300"
                    >
                      <ShoppingBag />
                      Comprar ahora
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <Markdown className="text-gray-600 my-6">{product?.description}</Markdown>
    </>
  );
}
