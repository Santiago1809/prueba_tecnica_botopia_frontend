import { Badge } from "@/components/ui/badge";
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
import { format } from "date-fns";
interface Props {
  purchases: Order[]
}

export function PurchaseHistoryTable({ purchases }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID pedido</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Artículos</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell>{purchase.id}</TableCell>
            <TableCell>{format(purchase.createdAt, "dd/MM/yyyy")}</TableCell>
            <TableCell>{CopFormatNumber(purchase.TotalPrice)}</TableCell>
            <TableCell>
              <ul>
                {purchase.Products.map((product, index) => (
                  <li key={index}>
                    {product.Name} x {product.quantity}
                  </li>
                ))}
              </ul>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  purchase.Stage === "Delivered"
                    ? "secondary"
                    : purchase.Stage === "Sended"
                    ? "outline"
                    : purchase.Stage === "Received"
                    ? "default"
                    : "destructive"
                }
              >
                {purchase.Stage}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
