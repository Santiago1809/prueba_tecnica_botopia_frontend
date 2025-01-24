import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Order } from "@/types/order"

interface DeleteOrderDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onDelete: (order: Order) => void
}

export function DeleteOrderDialog({ order, open, onOpenChange, onDelete }: DeleteOrderDialogProps) {
  if (!order) return null

  const handleDelete = () => {
    onDelete(order)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Pedido</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar este pedido? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

