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
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {card.title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight">
          {card.type === "Ingresos" ? (
            <span className="flex items-center">
              <span className="text-xl">
                {CopFormatNumber(card.value)}
              </span>
            </span>
          ) : (
            <span className="text-xl">{card.value}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
