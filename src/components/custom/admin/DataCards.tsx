import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CopFormatNumber } from "@/lib/utils";
import type { Card as CardType } from "@/types/admin";
import { Activity, CreditCard, DollarSign } from "lucide-react";

const Icons = {
  Ingresos: DollarSign,
  Ventas: CreditCard,
  Clientes: Activity,
};
interface Props {
  card: CardType;
}
export default function DataCards({ card }: Props) {
  const Icon = Icons[card.type];
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
        <Icon className="size-5" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          +{card.type === "Ingresos" ? CopFormatNumber(card.value) : card.value}
        </div>
      </CardContent>
    </Card>
  );
}
