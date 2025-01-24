"use client";

import { getBanners } from "@/actions/banners";
import { EditItemDialog } from "@/components/custom/admin/banners/EditItemForm";
import { ItemTable } from "@/components/custom/admin/banners/ItemTable";
import { NewItemForm } from "@/components/custom/admin/banners/NewItemForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/authStore";
import { BannerAndPopUp } from "@/types/banner";
import { useEffect, useState } from "react";

const initialPopups: BannerAndPopUp[] = [
  {
    id: 1,
    documentId: "popup1",
    Title: "Suscríbete al Newsletter",
    Url: "/subscribe",
    ButtonText: "Suscribirse",
    Image: { id: 3, documentId: "img3", url: "/images/newsletter.jpg" },
    Active: true,
  },
  {
    id: 2,
    documentId: "popup2",
    Title: "Encuesta de Satisfacción",
    Url: "/survey",
    ButtonText: "Participar",
    Image: { id: 4, documentId: "img4", url: "/images/survey.jpg" },
    Active: false,
  },
];

export default function BannersAndPopupsPage() {
  const [banners, setBanners] = useState<BannerAndPopUp[]>([]);
  const [popups, setPopups] = useState<BannerAndPopUp[]>(initialPopups);
  const [editingItem, setEditingItem] = useState<BannerAndPopUp | null>(null);
  const { toast } = useToast();
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchBanners = async () => {
      const res = await getBanners(token);
      setBanners(res || []); // Ensure it's always an array
    };
    fetchBanners();
  }, []);

  const handleToggle = (
    id: number,
    items: BannerAndPopUp[],
    setItems: React.Dispatch<React.SetStateAction<BannerAndPopUp[]>>
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, Active: !item.Active } : item
      )
    );
  };

  const handleDelete = (
    id: number,
    items: BannerAndPopUp[],
    setItems: React.Dispatch<React.SetStateAction<BannerAndPopUp[]>>
  ) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Elemento eliminado",
      description: "El elemento ha sido eliminado exitosamente.",
    });
  };

  const handleNewItemSubmit = (
    newItem: Omit<BannerAndPopUp, "id" | "documentId">,
    items: BannerAndPopUp[],
    setItems: React.Dispatch<React.SetStateAction<BannerAndPopUp[]>>
  ) => {
    const newId = Math.max(...items.map((item) => item.id)) + 1;
    const newDocumentId = `item${newId}`;
    setItems([...items, { id: newId, documentId: newDocumentId, ...newItem }]);
    toast({
      title: "Elemento añadido",
      description: "El nuevo elemento ha sido añadido exitosamente.",
    });
  };

  const handleEditItem = (item: BannerAndPopUp) => {
    setEditingItem(item);
  };

  const handleSaveEdit = (editedItem: BannerAndPopUp) => {
    const updateItems = (items: BannerAndPopUp[]) =>
      items.map((item) => (item.id === editedItem.id ? editedItem : item));

    if (banners.some((banner) => banner.id === editedItem.id)) {
      setBanners(updateItems);
    } else {
      setPopups(updateItems);
    }

    setEditingItem(null);
    toast({
      title: "Elemento actualizado",
      description: "El elemento ha sido actualizado exitosamente.",
    });
  };

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Banners y Pop-ups</h2>

      <Tabs defaultValue="banners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="banners">Banners</TabsTrigger>
          <TabsTrigger value="popups">Pop-ups</TabsTrigger>
        </TabsList>

        <TabsContent value="banners">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Banners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ItemTable
                items={banners}
                onToggle={(id) => handleToggle(id, banners, setBanners)}
                onDelete={(id) => handleDelete(id, banners, setBanners)}
                onEdit={handleEditItem}
              />
              <NewItemForm
                onSubmit={(newItem) =>
                  handleNewItemSubmit(newItem, banners, setBanners)
                }
                itemType="Banner"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popups">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Pop-ups</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ItemTable
                items={popups}
                onToggle={(id) => handleToggle(id, popups, setPopups)}
                onDelete={(id) => handleDelete(id, popups, setPopups)}
                onEdit={handleEditItem}
              />
              <NewItemForm
                onSubmit={(newItem) =>
                  handleNewItemSubmit(newItem, popups, setPopups)
                }
                itemType="Pop-up"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditItemDialog
        item={editingItem}
        onSave={handleSaveEdit}
        onCancel={() => setEditingItem(null)}
      />
    </div>
  );
}
