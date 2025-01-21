import { VentasReciente } from "@/types/admin";
import RecentSaleCard from "./RecentSaleCard";

interface Props {
  sales: VentasReciente[];
}
export function RecentSales({sales}: Props) {
  return (
    <div className="space-y-8">
      {
        sales.map((sale, index) => (
          <RecentSaleCard sale={sale} key={index} />
        ))
      }
    </div>
  );
}
