"use client";

import { getOrdersByUser } from "@/actions/orders";
import { PurchaseHistoryTable } from "@/components/custom/user/PurchaseHistoryTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { Order } from "@/types/order";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProfilePage() {
  const router = useRouter()
  const { email, name, userName, token, isLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    setTimeout(() => {
      if (isLoggedIn===false) {
        router.push("/login");
      }
      (async () => {
        setOrders(await getOrdersByUser(userName, token));
      })();
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Cargando...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mi Perfil</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${name}`}
                alt={name}
              />
              <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <p className="text-sm text-gray-500 mb-4">{email}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mis Compras</CardTitle>
            <CardDescription>
              Historial de tus pedidos recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="processing">En Proceso</TabsTrigger>
                <TabsTrigger value="delivered">Entregados</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <PurchaseHistoryTable purchases={orders} />
              </TabsContent>
              <TabsContent value="processing">
                <PurchaseHistoryTable
                  purchases={orders.filter(
                    (p) => p.Stage === "Received" || p.Stage === "Sended"
                  )}
                />
              </TabsContent>
              <TabsContent value="delivered">
                <PurchaseHistoryTable
                  purchases={orders.filter(
                    (p) => p.Stage === "Delivered"
                  )}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
