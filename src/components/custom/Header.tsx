"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { Search, ShoppingCart, Menu, X, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Login from "./user/Login";
import UserOptions from "./user/UserOptions";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

export default function Header() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const { totalItems } = useCartStore();
  const { userName, isLoggedIn, auth } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isAdminRoute) {
    return null;
  }

  const handleLogout = () => {
    useAuthStore.getState().logOut();
    setOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-md" : "bg-white"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl sm:text-3xl font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Botoshop
            </Link>
          </div>
          <div className="hidden md:block flex-grow max-w-xl mx-8">
            <form className="relative w-full">
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
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {userName !== "" && (
              <span className="text-sm font-medium text-gray-600">
                Hola, {userName}
              </span>
            )}
            {isLoggedIn ? (
              <UserOptions
                handleLogout={handleLogout}
                open={open}
                setOpen={setOpen}
              />
            ) : (
              <Login />
            )}
            <Link href="/cart">
              <Button
                variant="outline"
                size="icon"
                className="hover:bg-primary/10 transition-colors relative"
              >
                <ShoppingCart className="size-5" />
                <span className="sr-only">Carrito</span>
                {totalItems != 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            {auth && (
              <Link href="/admin">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary/10 transition-colors relative"
                >
                  <Store className="size-5" />
                  <span className="sr-only">Admin</span>
                </Button>
              </Link>
            )}
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <form className="relative w-full">
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
            <div className="flex items-center justify-between">
              {userName !== "" && (
                <span className="text-sm font-medium text-gray-600">
                  Hola, {userName}
                </span>
              )}
              {isLoggedIn ? (
                <UserOptions
                  handleLogout={handleLogout}
                  open={open}
                  setOpen={setOpen}
                />
              ) : (
                <Login />
              )}
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-primary/10 transition-colors relative"
                >
                  <ShoppingCart className="size-5" />
                  <span className="sr-only">Carrito</span>
                  {totalItems != 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full size-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
              {auth && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary/10 transition-colors relative"
                  >
                    <Store className="size-5" />
                    <span className="sr-only">Tienda</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
