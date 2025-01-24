import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BannerAndPopUp } from "@/types/banner";
import { Upload } from "lucide-react";

interface EditItemDialogProps {
  item: BannerAndPopUp | null;
  onSave: (item: BannerAndPopUp) => void;
  onCancel: () => void;
}

export function EditItemDialog({
  item,
  onSave,
  onCancel,
}: EditItemDialogProps) {
  const [editedItem, setEditedItem] = useState<BannerAndPopUp | null>(item);

  useEffect(() => {
    setEditedItem(item);
  }, [item]);

  if (!editedItem) return null;

  const handleSave = () => {
    if (editedItem) {
      onSave(editedItem);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedItem) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedItem({
          ...editedItem,
          Image: {
            ...editedItem.Image,
            url: reader.result as string,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar {editedItem.Title}</DialogTitle>
        </DialogHeader>
        <form autoComplete="off" className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">
              Título
            </Label>
            <Input
              id="edit-title"
              value={editedItem.Title}
              onChange={(e) =>
                setEditedItem({ ...editedItem, Title: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-url" className="text-right">
              URL
            </Label>
            <Input
              id="edit-url"
              value={editedItem.Url}
              onChange={(e) =>
                setEditedItem({ ...editedItem, Url: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-buttonText" className="text-right">
              Texto del Botón
            </Label>
            <Input
              id="edit-buttonText"
              value={editedItem.ButtonText}
              onChange={(e) =>
                setEditedItem({ ...editedItem, ButtonText: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-active" className="text-right">
              Activo
            </Label>
            <Switch
              id="edit-active"
              checked={editedItem.Active}
              onCheckedChange={(checked) =>
                setEditedItem({ ...editedItem, Active: checked })
              }
            />
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave}>
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
