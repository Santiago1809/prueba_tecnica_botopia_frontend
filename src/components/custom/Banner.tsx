import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="mb-12">
      <div className="relative h-96 rounded-lg overflow-hidden">
        <Image
          src="/placeholder.svg"
          alt="Banner promocional"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Grandes ofertas en tecnología
            </h1>
            <Button asChild>
              <Link href="/products">Ver ofertas</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
