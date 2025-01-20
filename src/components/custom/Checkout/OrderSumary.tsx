import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CopFormatNumber } from "@/lib/utils";

interface OrderSummaryProps {
  totalPrice: number;
  costOfSending: number;
}

export function OrderSummary({ totalPrice, costOfSending }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen del pedido</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{CopFormatNumber(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{CopFormatNumber(costOfSending)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{CopFormatNumber(totalPrice + costOfSending)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
