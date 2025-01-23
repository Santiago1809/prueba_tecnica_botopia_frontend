import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { User } from "@/types/user";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

interface UserTableProps {
  users: User[];
  sortColumn: keyof User;
  sortDirection: "asc" | "desc";
  onSort: (column: keyof User) => void;
  onViewDetails: (user: User) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserTable({
  users,
  sortColumn,
  sortDirection,
  onSort,
  onViewDetails,
  onEditUser,
  onDeleteUser,
}: UserTableProps) {
  const SortableTableHead = ({
    column,
    children,
  }: {
    column: keyof User;
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Avatar</TableHead>
          <SortableTableHead column="display_name">Nombre</SortableTableHead>
          <SortableTableHead column="email">Email</SortableTableHead>
          <SortableTableHead column="user_role">Rol</SortableTableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <Avatar>
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.display_name}`}
                />
                <AvatarFallback>
                  {user.display_name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{user.display_name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={user.user_role === "admin" ? "default" : "secondary"}
              >
                {user.user_role}
              </Badge>
            </TableCell>
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
                  <DropdownMenuItem onClick={() => onViewDetails(user)}>
                    Ver detalles
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditUser(user)}>
                    Editar usuario
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDeleteUser(user)}
                    className="text-red-600"
                  >
                    Eliminar usuario
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
