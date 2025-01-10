"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Container from "@/components/custom/Container";
import { useShoppingCart } from "@/hooks/useCart";
import { CopFormatNumber } from "@/lib/utils";
import { X } from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, totalPrice } = useShoppingCart();

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      // Prevenir cantidades negativas
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Carrito de Compra</h1>
      {cart.length === 0 ? (
        <>
          <p>Tu carrito está vacío.</p>
          <Button className="mt-4" asChild>
            <Link href="/products">Ir a comprar</Link>
          </Button>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cart.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image
                      src={item.imageUrl as string}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-md"
                    />
                    <div className="flex-grow">
                      <CardTitle>{item.name}</CardTitle>
                      <p className="text-lg font-semibold text-primary">
                        {CopFormatNumber(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      size="icon"
                      className="rounded-full p-3 bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => removeItem(item.id)}
                    >
                      <X />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resumen del pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>{CopFormatNumber(totalPrice)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{CopFormatNumber(totalPrice)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceder al pago</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </Container>
  );
}
