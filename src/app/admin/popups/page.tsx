"use client";

import { deletePopUp, getPopUps, savePopUp, updatePopUp } from "@/actions/popups";
import EditItemDialog  from "@/components/custom/admin/popups/EditItemForm";
import { ItemTable } from "@/components/custom/admin/popups/ItemTable";
import { NewItemForm } from "@/components/custom/admin/popups/NewItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { PopUp } from "@/types/popup";
import { useEffect, useState } from "react";

export default function PopUpsPage() {
  const [popups, setPopUps] = useState<PopUp[]>([]);
  const [editingItem, setEditingItem] = useState<PopUp | null>(null);
  const { toast } = useToast();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchPopUps = async () => {
      const res = await getPopUps(token);
      setPopUps(res || []); // Ensure it's always an array
    };
    fetchPopUps();
  }, [token]);

  const handleToggle = (id: number) => {
    setPopUps(
      popups.map((item) =>
        item.id === id ? { ...item, Active: !item.Active } : item
      )
    );
  };

  const handleDelete = async (id: string) => {
    await deletePopUp(token, id);
    const res = await getPopUps(token);
    setPopUps(res);
    toast({
      title: "Elemento eliminado",
      description: "El elemento ha sido eliminado exitosamente.",
    });
  };

  const handleNewItemSubmit = async (newItem: FormData) => {
    await savePopUp(token, newItem);
    const res = await getPopUps(token);
    setPopUps(res);
    toast({
      title: "Elemento añadido",
      description: "El nuevo elemento ha sido añadido exitosamente.",
    });
  };

  const handleEditItem = (item: PopUp) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async (editedItem: PopUp) => {
    await updatePopUp(token, editedItem);
    const res = await getPopUps(token);
    setEditingItem(null);
    setPopUps(res);
    toast({
      title: "Elemento actualizado",
      description: "El elemento ha sido actualizado exitosamente.",
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Gestión de PopUps</h2>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de PopUps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ItemTable
            items={popups}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEditItem}
          />
          <NewItemForm onSubmit={handleNewItemSubmit} itemType="PopUp" />
        </CardContent>
      </Card>

      <EditItemDialog
        item={editingItem}
        onSave={handleSaveEdit}
        onCancel={() => setEditingItem(null)}
      />
    </div>
  );
}
