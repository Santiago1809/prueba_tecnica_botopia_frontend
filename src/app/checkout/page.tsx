"use client";

import { createCheckoutSession, createPayPalOrder } from "@/actions/orders";
import { OrderSummary } from "@/components/custom/Checkout/OrderSumary";
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
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useStoresStore } from "@/store/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const { stores } = useStoresStore();
  const { totalPrice, cart, clearCart, totalItems } = useCartStore();
  const { isLoggedIn } = useAuthStore();
  const costOfSending = totalPrice > 150000 ? 0 : totalPrice * 0.35;
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("co");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      country: "co",
      zipCode: "",
      paymentMethod: "card",
    },
  });

  const onSubmit = async (data: CheckoutValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append(
      "cart",
      JSON.stringify(
        cart.map((item) => ({
          ...item,
          price: item.price * 100,
          store_id: stores.find((store) =>
            store.Products.some(
              (product) => product.documentId === item.documentId
            )
          )?.id,
        }))
      )
    );
    formData.append("sendingData", JSON.stringify(data));
    formData.append("costOfSending", costOfSending.toString());
    formData.append("totalPrice", (totalPrice + costOfSending).toString());

    const result = await createCheckoutSession(formData);

    if (result && "error" in result) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      window.location = result.url;
      clearCart();
      toast({
        title: "Pago exitoso",
        description: "Tu pedido ha sido procesado con éxito.",
        variant: "default",
      });
    }
    setIsSubmitting(false);
  };

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

                {form.watch("paymentMethod") === "paypal" ? (
                  <PayPalScriptProvider
                    options={{
                      clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    }}
                  >
                    <PayPalButtons
                      style={{
                        height: 35,
                        layout: "horizontal",
                        label: "pay",
                        color: "blue",
                      }}
                      createOrder={async () => {
                        const formData = new FormData();
                        formData.append(
                          "cart",
                          JSON.stringify(
                            cart.map((item) => ({
                              ...item,
                              price: item.price * 100,
                              store_id: stores.find((store) =>
                                store.Products.some(
                                  (product) =>
                                    product.documentId === item.documentId
                                )
                              )?.id,
                            }))
                          )
                        );
                        formData.append(
                          "sendingData",
                          JSON.stringify(form.getValues())
                        );
                        formData.append(
                          "costOfSending",
                          costOfSending.toString()
                        );
                        formData.append(
                          "totalPrice",
                          (totalPrice + costOfSending).toString()
                        );
                        formData.append("totalItems", totalItems.toString());

                        const order = await createPayPalOrder(formData);
                        return order.id;
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          await actions.order?.capture();
                          clearCart();
                          router.push("/success");
                          toast({
                            title: "Pago exitoso",
                            description:
                              "Tu pedido ha sido procesado con éxito.",
                            variant: "default",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description:
                              (error as Error).message ||
                              "Ocurrió un problema al capturar el pago",
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                  </PayPalScriptProvider>
                ) : (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Procesando..." : "Proceder al pago"}
                  </Button>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
        <OrderSummary costOfSending={costOfSending} totalPrice={totalPrice} />
      </div>
    </div>
  );
}
