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

import { CopFormatNumber } from "@/lib/utils";
import { X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { cart, updateQuantity, removeItem, totalPrice } = useCartStore();

  const costOfSending = totalPrice > 50000 ? 0 : totalPrice * 0.35;

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
    }
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8 text-center sm:text-left">
        Carrito de Compra
      </h1>
      {cart.length === 0 ? (
        <>
          <p className="text-center text-lg mb-4">Tu carrito está vacío.</p>
          <div className="flex justify-center">
            <Button className="mt-4" asChild>
              <Link href="/products">Ir a comprar</Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos en el carrito */}
          <div className="lg:col-span-2">
            {cart.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="rounded-md size-20"
                      priority
                    />
                    <div className="flex-grow">
                      <CardTitle className="text-lg mb-2">
                        {item.name}
                      </CardTitle>
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
                        className="w-12 sm:w-16 text-center"
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
                      className="rounded-full p-3 bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white sm:ml-2"
                      onClick={() => removeItem(item.id)}
                    >
                      <X />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Resumen del pedido */}
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
                  <span>{CopFormatNumber(costOfSending)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{CopFormatNumber(totalPrice + costOfSending)}</span>
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
