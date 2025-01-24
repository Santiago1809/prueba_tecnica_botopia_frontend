"use client";

import { deleteOrder, getOrders, updateOrderStage } from "@/actions/orders";
import { OrderTable } from "@/components/custom/admin/orders/OrdersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { Order } from "@/types/order";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof Order>("id"); // Columna para ordenar
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Dirección de ordenación
  const { token } = useAuthStore();

  // Obtener pedidos desde la API
  useEffect(() => {
    (async () => {
      const res = await getOrders(token);
      if (res.error) {
        console.error("Error al obtener pedidos:", res.error);
        return;
      }
      setOrders(res);
    })();
  }, []);

  // Manejo de la eliminación de pedidos
  const handleDelete =async (deletedOrder: Order) => {
    await deleteOrder(token, deletedOrder);
    const res = await getOrders(token);
    if (res.error) {
      console.error("Error al obtener pedidos:", res.error);
      return;
    }
    setOrders(res);
  };

  // Manejo de la edición de pedidos
  const handleEdit = async (order: Order) => {
    await updateOrderStage(token, order);
    const res = await getOrders(token);
    if (res.error) {
      console.error("Error al obtener pedidos:", res.error);
      return;
    }
    setOrders(res);
  };

  // Ordenar las columnas
  const handleSort = (column: keyof Order) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);

    const sortedOrders = [...orders].sort((a, b) => {
      const compA = a[column] ?? 0;
      const compB = b[column] ?? 0;

      if (compA < compB) return direction === "asc" ? -1 : 1;
      if (compA > compB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setOrders(sortedOrders);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Gestión de Pedidos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTable
            orders={orders}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onEditOrder={handleEdit}
            onDeleteOrder={handleDelete}
          />
        </CardContent>
      </Card>
    </>
  );
}
