"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CopFormatNumber } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types/products";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: Product;
}
export default function CardProduct({ product }: Props) {
  const { addItem } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (
      !product?.id ||
      !product?.name ||
      !product?.price ||
      !product?.images?.[0]
    ) {
      toast({
        title: "Error",
        description: "El producto no tiene información válida.",
      });
      return;
    }

    addItem({
      id: product.id as string,
      documentId: product.documentId as string,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0],
      quantity: 1,
    });

    toast({
      title: "Producto añadido al carrito",
      description: `${product.name} añadido al carrito.`,
    });
  };

  return (
    <Card className="h-[22rem] sm:h-[28rem] max-w-34 flex flex-col">
      <CardHeader className="p-2 sm:p-6">
        <div className="relative w-full h-[150px] sm:h-[200px]">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="rounded-t-lg object-contain"
            priority
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-3 sm:px-6">
        <CardTitle className="text-sm sm:text-lg truncate">
          {product.name}
        </CardTitle>
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {!isNaN(product?.price as number)
            ? CopFormatNumber(product?.price as number)
            : "Loading..."}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col px-3 sm:px-6 gap-y-3">
        <Button asChild className="w-full">
          <Link href={`/products/${product.category.Name}/${product.documentId}`}>Ver detalles</Link>
        </Button>
        <Button
          className="bg-orange-500 hover:bg-orange-600 w-full"
          onClick={handleAddToCart}
        >
          <ShoppingCart />
          Añadir al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
