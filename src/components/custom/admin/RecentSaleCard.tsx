import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CopFormatNumber } from "@/lib/utils";
import { VentasReciente } from "@/types/admin";

interface Props {
  sale: VentasReciente;
}

export default function RecentSaleCard({ sale }: Props) {
  return (
    <div className="flex items-center">
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${sale.user.display_name}`}
          alt="Avatar"
        />
        <AvatarFallback>
          {sale.user.display_name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">
          {sale.user.display_name}
        </p>
      </div>
      <div className="ml-auto font-medium">
        +{CopFormatNumber(sale.TotalPrice)}
      </div>
    </div>
  );
}
