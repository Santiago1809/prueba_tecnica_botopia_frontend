"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


const settingsSchema = z.object({
  siteName: z.string().min(1, "El nombre del sitio es requerido"),
  siteDescription: z.string(),
  logoUrl: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  primaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Debe ser un color hexadecimal válido"
    ),
  currency: z.enum(["USD", "EUR", "GBP", "JPY"]),
  showNewArrivals: z.boolean(),
  showFeaturedProducts: z.boolean(),
  productsPerPage: z.number().min(1).max(100),
  enableReviews: z.boolean(),
  enableWishlist: z.boolean(),
});

type SettingsValues = z.infer<typeof settingsSchema>;

const defaultValues: SettingsValues = {
  siteName: "Mi E-commerce",
  siteDescription: "La mejor tienda en línea para tus necesidades",
  logoUrl: "",
  primaryColor: "#3b82f6",
  currency: "USD",
  showNewArrivals: true,
  showFeaturedProducts: true,
  productsPerPage: 12,
  enableReviews: true,
  enableWishlist: true,
};

export default function SettingsPage() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues,
  });

  function onSubmit(data: SettingsValues) {
    setIsSaving(true);
    // Simular una llamada a la API
    setTimeout(() => {
      console.log(data);
      toast({
        title: "Configuración guardada",
        description: "Los cambios han sido aplicados exitosamente.",
      });
      setIsSaving(false);
    }, 1000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">
          Administra la configuración general de tu tienda en línea.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>
                Configura la información básica de tu tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Sitio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Este es el nombre que aparecerá en la cabecera de tu
                      sitio.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="siteDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Sitio</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormDescription>
                      Una breve descripción de tu tienda para los motores de
                      búsqueda.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del Logo</FormLabel>
                    <FormControl>
                      <Input {...field} type="url" />
                    </FormControl>
                    <FormDescription>
                      La URL de la imagen de tu logo. Déjala en blanco para usar
                      el nombre del sitio.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color Primario</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Input
                          {...field}
                          type="color"
                          className="w-12 h-12 p-1"
                        />
                        <Input {...field} className="flex-grow" />
                      </div>
                    </FormControl>
                    <FormDescription>
                      El color principal de tu marca en formato hexadecimal.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Tienda</CardTitle>
              <CardDescription>
                Personaliza el funcionamiento de tu tienda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Moneda</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una moneda" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="USD">
                          Dólar Estadounidense (USD)
                        </SelectItem>
                        <SelectItem value="EUR">Euro (EUR)</SelectItem>
                        <SelectItem value="GBP">
                          Libra Esterlina (GBP)
                        </SelectItem>
                        <SelectItem value="JPY">Yen Japonés (JPY)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      La moneda principal para los precios de los productos.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productsPerPage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Productos por Página</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={100}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Número de productos a mostrar por página en el catálogo.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showNewArrivals"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Mostrar Nuevos Productos
                      </FormLabel>
                      <FormDescription>
                        Muestra una sección de nuevos productos en la página
                        principal.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="showFeaturedProducts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Mostrar Productos Destacados
                      </FormLabel>
                      <FormDescription>
                        Muestra una sección de productos destacados en la página
                        principal.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enableReviews"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Habilitar Reseñas
                      </FormLabel>
                      <FormDescription>
                        Permite a los usuarios dejar reseñas en los productos.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="enableWishlist"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Habilitar Lista de Deseos
                      </FormLabel>
                      <FormDescription>
                        Permite a los usuarios crear y gestionar listas de
                        deseos.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
