"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Login from "./user/Login";
import { useAuthStore } from "@/store/authStore";

export default function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const { name } = useAuthStore();

  if (isAdminRoute) {
    return null;
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
      <Link href="/" className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors">
        Botoshop
      </Link>
      <div className="flex flex-col sm:flex-row items-center gap-6 flex-grow">
        <form className="relative w-full sm:w-auto flex-grow max-w-md">
        <Input
          type="search"
          placeholder="Buscar productos..."
          className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-primary"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
          size={20}
        />
        </form>
        <div className="flex items-center gap-4">
        {name !== "" && (
          <span className="text-sm font-medium text-gray-600">
          Hola, {name}
          </span>
        )}
        <Login />
        <Link href="/cart">
          <Button 
          variant="outline" 
          size="icon"
          className="hover:bg-primary/10 transition-colors"
          >
          <ShoppingCart className="size-5" />
          <span className="sr-only">Carrito</span>
          </Button>
        </Link>
        </div>
      </div>
      </div>
    </header>
  );
}
