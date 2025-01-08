import { Product } from "@/types/products";
import CardProduct from "./CardProduct";

interface Props {
  products: Product[];
}

export default function Products({ products }: Props) {
  return (
    <>
      {products.map((product) => (
        <CardProduct key={product.id} product={product} />
      ))}
    </>
  );
}
