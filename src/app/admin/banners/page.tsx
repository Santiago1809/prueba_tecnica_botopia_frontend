"use client";

import {
  deleteBanner,
  getBanners,
  saveBanner,
  updateBanner,
} from "@/actions/banners";
import { EditItemDialog } from "@/components/custom/admin/banners/EditItemForm";
import { ItemTable } from "@/components/custom/admin/banners/ItemTable";
import { NewItemForm } from "@/components/custom/admin/banners/NewItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { Banner } from "@/types/banner";
import { useEffect, useState } from "react";

export default function BannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingItem, setEditingItem] = useState<Banner | null>(null);
  const { toast } = useToast();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchBanners = async () => {
      const res = await getBanners(token);
      setBanners(res || []); // Ensure it's always an array
    };
    fetchBanners();
  }, [token]);

  const handleToggle = (id: number) => {
    setBanners(
      banners.map((item) =>
        item.id === id ? { ...item, Active: !item.Active } : item
      )
    );
  };

  const handleDelete = async (id: string) => {
    await deleteBanner(token, id);
    const res = await getBanners(token);
    setBanners(res);
    toast({
      title: "Elemento eliminado",
      description: "El elemento ha sido eliminado exitosamente.",
    });
  };

  const handleNewItemSubmit = async (newItem: FormData) => {
    toast({
      title: "Elemento enviado",
      description: "El nuevo elemento está creandose.",
    });
    await saveBanner(token, newItem);
    const res = await getBanners(token);
    setBanners(res);
    toast({
      title: "Elemento añadido",
      description: "El nuevo elemento ha sido añadido exitosamente.",
    });
  };

  const handleEditItem = (item: Banner) => {
    setEditingItem(item);
  };

  const handleSaveEdit = async (editedItem: Banner) => {
    await updateBanner(token, editedItem);
    const res = await getBanners(token);
    setEditingItem(null);
    setBanners(res);
    toast({
      title: "Elemento actualizado",
      description: "El elemento ha sido actualizado exitosamente.",
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Gestión de Banners</h2>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Banners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ItemTable
            items={banners}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onEdit={handleEditItem}
          />
          <NewItemForm onSubmit={handleNewItemSubmit} itemType="Banner" />
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
