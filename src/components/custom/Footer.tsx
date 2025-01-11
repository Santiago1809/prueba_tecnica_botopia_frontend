'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Acerca de nosotros</h3>
            <p>
              Somos tu tienda en línea de confianza, ofreciendo los mejores
              productos con asistencia de IA.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-primary" />
                Inicio
              </li>
              <li>
                <Link href="/products" className="hover:text-primary" />
                Productos
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary" />
                Carrito
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <p>Email: info@e-shop.com</p>
            <p>Teléfono: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p>
            &copy; {new Date().getFullYear()} E-Shop. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
