"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/custom/Container";

const product = {
  id: 1,
  name: "Smartphone X",
  price: 599,
  description:
    "El Smartphone X es un dispositivo de última generación con características avanzadas...",
  image: "/placeholder.svg",
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
              <Image
                src={product.image}
                alt={product.name}
                width={500}
                height={500}
                className="rounded-lg"
              />
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
