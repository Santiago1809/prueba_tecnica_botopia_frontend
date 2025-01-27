import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/products";
import Loader from "@/components/Loader";

const formSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "El nombre es requerido"),
  price: z.coerce
    .number()
    .min(0, "El precio debe ser mayor o igual a 0")
    .transform((val) => Number(val.toFixed(2))),
  stock: z.coerce.number().int().min(0, "El stock debe ser mayor o igual a 0"),
  documentId: z.string().min(1, "El id del producto es requerido"),
});

interface EditProductDialogProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (product: z.infer<typeof formSchema>) => void;
}

export default function EditProductDialog({
  product,
  open,
  onOpenChange,
  onUpdate,
}: EditProductDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      name: "",
      price: 0,
      stock: 0,
      documentId: "",
    },
  });

  // Actualiza los valores del formulario cuando cambia el producto
  useEffect(() => {
    if (product) {
      form.reset({
        id: product.id,
        name: product.name,
        price: product.price,
        stock: product.stock,
        documentId: product.documentId,
      });
    }
  }, [product, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const updatedProduct = {
      ...values,
      documentId: product.documentId, // Asegurarse de que documentId se pase correctamente
    };
    setIsLoading(true);
    onUpdate(updatedProduct);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {isLoading ? <Loader size="sm" /> : "Guardar"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
