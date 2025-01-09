import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CopFormatNumber } from "@/lib/utils";
import { Product } from "@/types/products";
import Image from "next/image";
import Link from "next/link";

interface Props {
  product: Product;
}
export default function CardProduct({ product }: Props) {
  return (
    <Card className="h-[400px] sm:h-96 max-w-34 flex flex-col">
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
          {!isNaN(product?.price as number) ? CopFormatNumber(product?.price as number) : "Loading..."}
        </p>
      </CardContent>
      <CardFooter className="px-3 sm:px-6">
        <Button asChild className="w-full">
          <Link href={`/products/${product.id}`}>Ver detalles</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
