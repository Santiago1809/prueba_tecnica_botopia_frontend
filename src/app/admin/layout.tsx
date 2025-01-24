"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  PictureInPicture2,
  ShoppingBasket,
  Truck,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: any;
}

const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/admin/",
    icon: () => <LayoutDashboard />,
  },
  {
    label: "Productos",
    href: "/admin/products",
    icon: () => <ShoppingBasket />,
  },
  {
    label: "Usuarios",
    href: "/admin/users",
    icon: () => <Users />,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: () => <Megaphone />,
  },
  {
    label: "PopUps",
    href: "/admin/popups",
    icon: () => <PictureInPicture2 />,
  },
  {
    label: "Pedidos",
    href: "/admin/orders",
    icon: () => <Truck />,
  },
];

export const dynamic = "force-dynamic";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 md:w-72 lg:w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Admin</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Sidebar Content */}
        <ScrollArea className="flex-1 px-4 py-4">
          <nav className="flex flex-col space-y-2">
            {sidebarItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                )}
              >
                <item.icon className="mr-3 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t p-4">
          <Button
            variant="outline"
            className="w-full justify-start text-sm"
            onClick={() => console.log("Cerrar sesión")}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Main Content Header */}
        <header className="bg-white border-b">
          <div className="flex h-16 items-center justify-between px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              Panel de Administración
            </h1>
            <div className="w-10 lg:hidden"></div> {/* Spacer for mobile */}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
