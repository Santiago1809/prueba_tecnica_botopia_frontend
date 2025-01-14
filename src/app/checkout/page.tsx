"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { CopFormatNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { title } from "process";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const citiesByCountry = {
  es: [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Sevilla",
    "Zaragoza",
    "Málaga",
    "Bilbao",
  ],
  mx: [
    "Ciudad de México",
    "Guadalajara",
    "Monterrey",
    "Puebla",
    "Tijuana",
    "León",
    "Juárez",
  ],
  ar: [
    "Buenos Aires",
    "Córdoba",
    "Rosario",
    "Mendoza",
    "La Plata",
    "San Miguel de Tucumán",
    "Mar del Plata",
  ],
  co: [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
    "Bucaramanga",
    "Santa Marta",
  ],
} as const;

type CountryCode = keyof typeof citiesByCountry;

const checkoutSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingrese un email válido"),
  address: z.string().min(5, "La dirección debe tener al menos 5 caracteres"),
  city: z.string().min(2, "Seleccione una ciudad"),
  country: z.enum(["es", "mx", "ar", "co"] as const),
  zipCode: z
    .string()
    .min(3, "El código postal debe tener al menos 3 caracteres"),
  paymentMethod: z.enum(["card", "paypal"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { totalPrice, cart, clearCart } = useCartStore();
  const costOfSending = totalPrice > 150000 ? 0 : 10000;
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("es");

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      country: "es",
      zipCode: "",
      paymentMethod: "card",
    },
  });

  const onSubmit = async (data: CheckoutValues) => {
    setIsSubmitting(true);
    // Simulate API call to create Stripe session
    await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        cart: cart.map((item) => {
          return {
            ...item,
            price: item.price * 100
          }
         }),
        sendingData: data,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        clearCart()
        window.location = data.url
        toast({
          title: "Pago exitoso",
          description: "Tu pedido ha sido procesado con éxito.",
          variant: "default",
        });
      });
    setIsSubmitting(false);
  };

  const watchPaymentMethod = form.watch("paymentMethod");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información de envío y pago</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <Select
                          onValueChange={(value: CountryCode) => {
                            field.onChange(value);
                            setSelectedCountry(value);
                            // Reset city when country changes
                            form.setValue("city", "");
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un país" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="es">España</SelectItem>
                            <SelectItem value="mx">México</SelectItem>
                            <SelectItem value="ar">Argentina</SelectItem>
                            <SelectItem value="co">Colombia</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una ciudad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {citiesByCountry[selectedCountry].map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código postal</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Separator />
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de pago</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un método de pago" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">
                              Tarjeta débito/crédito
                            </SelectItem>
                            <SelectItem value="paypal">PayPal</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Procesando..." : "Proceder al pago"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Resumen del pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{CopFormatNumber(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío</span>
                <span>{CopFormatNumber(costOfSending)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{CopFormatNumber(totalPrice + costOfSending)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
