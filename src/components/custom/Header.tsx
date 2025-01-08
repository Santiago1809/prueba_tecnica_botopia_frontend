"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return null
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          Botoshop
        </Link>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <form className="relative w-full sm:w-auto">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="pl-10 pr-4 py-2 w-full sm:w-64"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </form>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <User className="size-5" />
                  <span className="sr-only">Usuario</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Iniciar sesión</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input id="password" type="password" />
                  </div>
                  <Button className="w-full">Iniciar sesión</Button>
                  <span className="text-center text-sm" >No tiene cuenta? <Link href='/register' className="text-blue-500 hover:underline">Registrese</Link></span>
                </div>
              </DialogContent>
            </Dialog>
            <Link href="/cart">
              <Button variant="outline" size="icon">
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
