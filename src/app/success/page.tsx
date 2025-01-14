import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function Page() {
  return (
    <div className="text-3xl font-bold text-center py-10 h-screen flex items-center justify-center">
      <div>
        <p className="text-6xl">🎉</p>
        <h1>Gracias por tu compra</h1>
        <Link href="/" className="text-blue-500 flex items-center hover:text-blue-600 justify-center gap-3 mt-4 ">
          <ArrowLeft />
          Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
