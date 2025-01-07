'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Container from '@/components/custom/Container'

const initialCartItems = [
  { id: 1, name: "Smartphone X", price: 599, quantity: 1, image: "/placeholder.svg" },
  { id: 2, name: "Laptop Pro", price: 1299, quantity: 1, image: "/placeholder.svg" },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
    ))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Carrito de Compra</h1>
      {cartItems.length === 0 ? (
        <>
        <p>Tu carrito está vacío.</p>
        <Button className="mt-4" asChild>
          <Link href="/products">Ir a comprar</Link>
        </Button>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md" />
                    <div className="flex-grow">
                      <CardTitle>{item.name}</CardTitle>
                      <p className="text-lg font-semibold text-primary">${item.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => removeItem(item.id)}>
                      X
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
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Envío:</span>
                  <span>Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
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
  )
}

