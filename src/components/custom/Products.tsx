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
        <Card key={product.id} className="h-96 flex flex-col">
          <CardHeader>
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={200}
              className="rounded-t-lg"
            />
          </CardHeader>
          <CardContent className="flex-grow">
            <CardTitle className="truncate">{product.name}</CardTitle>
            <p className="text-2xl font-bold text-primary">${product.price}</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href={`/products/${product.id}`}>Ver detalles</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
