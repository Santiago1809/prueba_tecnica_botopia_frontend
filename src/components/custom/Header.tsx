import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">Botoshop</Link>
        <search className="flex items-center space-x-4">
          <form className="relative">
            <Input type="search" placeholder="Buscar productos..." className="pl-10 pr-4 py-2 w-64"/>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </form>
          <Link href='/cart'>
            <Button variant='outline' size='icon'>
              <ShoppingCart className="size-5" />
              <span className="sr-only">Carrito</span>
            </Button>
          </Link>
        </search>
      </div>
    </header>
  );
}
