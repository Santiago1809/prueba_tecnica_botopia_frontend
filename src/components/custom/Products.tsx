import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";
import { Product } from "@/types/products";

interface Props {
  products: Product[];
}

export default function Products({ products }: Props) {
  return (
    <>
      {products.map((product) => (
        <Card key={product.id} className="h-[400px] sm:h-96 max-w-34 flex flex-col">
          <CardHeader className="p-2 sm:p-6">
            <div className="relative w-full h-[150px] sm:h-[200px]">
              <Image
          src={product.image}
          alt={product.name}
          fill
          className="rounded-t-lg object-contain"
          priority
              />
            </div>
          </CardHeader>
          <CardContent className="flex-grow px-3 sm:px-6">
            <CardTitle className="text-sm sm:text-lg truncate">{product.name}</CardTitle>
            <p className="text-xl sm:text-2xl font-bold text-primary">${product.price}</p>
          </CardContent>
          <CardFooter className="px-3 sm:px-6">
            <Button asChild className="w-full">
              <Link href={`/products/${product.id}`}>Ver detalles</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
