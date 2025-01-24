"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CopFormatNumber } from "@/lib/utils";
import { Order } from "@/types/order";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { DeleteOrderDialog } from "./DeleteOrder";
import { EditOrderDialog } from "./OrderEditDialog";

interface OrderTableProps {
  orders: Order[];
  sortColumn: keyof Order;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (order: Order) => void;
}

export function OrderTable({
  orders,
  sortColumn,
  sortDirection,
  onSort,
  onEditOrder,
  onDeleteOrder,
}: OrderTableProps) {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const SortableTableHead = ({
    column,
    children,
  }: {
    column: keyof Order;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => onSort(column)}
        className="hover:bg-transparent"
      >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead column="id">ID Pedido</SortableTableHead>
            <SortableTableHead column="user">Cliente</SortableTableHead>
            <SortableTableHead column="createdAt">Fecha</SortableTableHead>
            <SortableTableHead column="Stage">Estado</SortableTableHead>
            <SortableTableHead column="TotalPrice">Total</SortableTableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>{order.user.display_name}</TableCell>
              <TableCell>{order.createdAt}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.Stage === "Delivered"
                      ? "default"
                      : order.Stage === "Received"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {order.Stage}
                </Badge>
              </TableCell>
              <TableCell>{CopFormatNumber(order.TotalPrice)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setEditingOrder(order)}>
                      Editar pedido
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setDeletingOrder(order)}
                      className="text-red-600"
                    >
                      Eliminar pedido
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editingOrder && (
        <EditOrderDialog
          order={editingOrder}
          open={!!editingOrder}
          onOpenChange={(open) => !open && setEditingOrder(null)}
          onSave={onEditOrder}
        />
      )}
      {deletingOrder && (
        <DeleteOrderDialog
          order={deletingOrder}
          open={!!deletingOrder}
          onOpenChange={(open) => !open && setDeletingOrder(null)}
          onDelete={onDeleteOrder}
        />
      )}
    </>
  );
}
