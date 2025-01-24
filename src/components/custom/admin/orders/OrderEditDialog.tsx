import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order, OrderStageType } from "@/types/order";
import { useState } from "react";

interface EditOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedOrder: Order) => void;
}

export function EditOrderDialog({
  order,
  open,
  onOpenChange,
  onSave,
}: EditOrderDialogProps) {
  const [editedOrder, setEditedOrder] = useState<Order | null>(order);

  if (!editedOrder) return null;

  const handleSave = () => {
    if (editedOrder) {
      onSave(editedOrder);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="id" className="text-right">
              ID Pedido
            </Label>
            <Input
              id="id"
              value={editedOrder.id}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customer" className="text-right">
              Cliente
            </Label>
            <Input
              id="customer"
              value={editedOrder.user.display_name}
              readOnly
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stage" className="text-right">
              Estado
            </Label>
            <Select
              value={editedOrder.Stage}
              onValueChange={(value: OrderStageType) =>
                setEditedOrder({ ...editedOrder, Stage: value })
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Received">Recibido</SelectItem>
                <SelectItem value="Packing">Empaquetando</SelectItem>
                <SelectItem value="Sended">Enviado</SelectItem>
                <SelectItem value="Delivered">Entregado</SelectItem>
                <SelectItem value="Canceled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Total
            </Label>
            <Input
              id="total"
              value={editedOrder.TotalPrice}
              readOnly
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
