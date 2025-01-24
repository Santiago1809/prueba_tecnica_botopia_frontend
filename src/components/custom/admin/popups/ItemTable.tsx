import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit } from "lucide-react";
import type { PopUp } from "@/types/popup";

interface ItemTableProps {
  items: PopUp[];
  onToggle: (id: number) => void;
  onDelete: (id: string) => void;
  onEdit: (item: PopUp) => void;
}

export function ItemTable({
  items,
  onToggle,
  onDelete,
  onEdit,
}: ItemTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Texto del Botón</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.Title}</TableCell>
            <TableCell className="max-w-xs truncate">{item.Url}</TableCell>
            <TableCell>{item.ButtonText}</TableCell>
            <TableCell>
              <Switch
                checked={item.Active}
                onCheckedChange={() => onToggle(item.id)}
              />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onDelete(item.documentId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}