import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "lucide-react";
import Link from "next/link";

interface Props {
  handleLogout: () => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function UserOptions({ handleLogout, open, setOpen }: Props) {
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="hover:bg-primary/10 transition-colors"
        >
          <User />
          <span className="sr-only">Usuario</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Opciones de usuario</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link
            href="/profile"
            className="w-full"
            onClick={() => setOpen(false)}
          >
            <Button variant="outline" size="sm" className="w-full">
              Perfil
            </Button>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
