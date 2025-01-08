"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/custom/Container";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types/products";

const product: Product = {
  id: 1,
  name: "Smartphone X",
  price: 599,
  description:
    "El Smartphone X es un dispositivo de última generación con características avanzadas...",
  images: ["/placeholder.svg"],
  category: "Smartphones",
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Aquí iría la lógica para añadir al carrito
    toast({
      title: "Producto añadido al carrito",
      description: `${quantity} x ${product.name} añadido al carrito.`,
    });
  };

  return (
    <Container>
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Carousel className="w-full max-w-md mx-auto">
                <CarouselContent>
                  {product.images.map((link, index) => (
                    <CarouselItem key={index}>
                      <div className="p-2">
                        <Card className="border-none shadow-none">
                          <CardContent className="flex aspect-square items-center justify-center p-0">
                            <div className="relative w-full h-full">
                              <Image
                                src={link}
                                alt={`${product.name} - Vista ${index + 1}`}
                                fill
                                className="object-cover rounded-lg"
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
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-4xl font-bold text-primary mb-4">
                ${product.price}
              </p>
              <p className="text-gray-600 mb-6">{product.description}</p>
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
              <Button onClick={handleAddToCart} className="w-full">
                Añadir al carrito
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
