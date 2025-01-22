"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Edit } from "lucide-react";

interface Item {
  id: number;
  title: string;
  content: string;
  active: boolean;
}

const initialBanners: Item[] = [
  {
    id: 1,
    title: "Oferta de Verano",
    content: "Descuentos de hasta 50% en productos seleccionados",
    active: true,
  },
  {
    id: 2,
    title: "Descuento en Electrónicos",
    content: "Llévate un 20% de descuento en todos los electrónicos",
    active: false,
  },
];

const initialPopups: Item[] = [
  {
    id: 1,
    title: "Suscríbete al Newsletter",
    content: "Recibe las últimas noticias y ofertas exclusivas",
    active: true,
  },
  {
    id: 2,
    title: "Encuesta de Satisfacción",
    content: "Ayúdanos a mejorar respondiendo nuestra encuesta",
    active: false,
  },
];

export default function BannersAndPopupsPage() {
  const [banners, setBanners] = useState<Item[]>(initialBanners);
  const [popups, setPopups] = useState<Item[]>(initialPopups);
  const [newItem, setNewItem] = useState<Omit<Item, "id" | "active">>({
    title: "",
    content: "",
  });
  const { toast } = useToast();

  const handleToggle = (
    id: number,
    items: Item[],
    setItems: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, active: !item.active } : item
      )
    );
  };

  const handleDelete = (
    id: number,
    items: Item[],
    setItems: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Elemento eliminado",
      description: "El elemento ha sido eliminado exitosamente.",
    });
  };

  const handleNewItemSubmit = (
    e: React.FormEvent,
    items: Item[],
    setItems: React.Dispatch<React.SetStateAction<Item[]>>
  ) => {
    e.preventDefault();
    if (newItem.title.trim() === "" || newItem.content.trim() === "") {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      });
      return;
    }
    setItems([...items, { id: Date.now(), ...newItem, active: true }]);
    setNewItem({ title: "", content: "" });
    toast({
      title: "Elemento añadido",
      description: "El nuevo elemento ha sido añadido exitosamente.",
    });
  };

  const ItemTable = ({
    items,
    setItems,
    itemType,
  }: {
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    itemType: string;
  }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Título</TableHead>
          <TableHead>Contenido</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell className="max-w-xs truncate">{item.content}</TableCell>
            <TableCell>
              <Switch
                checked={item.active}
                onCheckedChange={() => handleToggle(item.id, items, setItems)}
              />
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(item.id, items, setItems)}
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

  const NewItemForm = ({
    onSubmit,
    itemType,
  }: {
    onSubmit: (e: React.FormEvent) => void;
    itemType: string;
  }) => (
    <form onSubmit={onSubmit} className="space-y-4">
      <h4 className="text-lg font-semibold">Añadir Nuevo {itemType}</h4>
      <div className="space-y-2">
        <Label htmlFor={`${itemType.toLowerCase()}Title`}>Título</Label>
        <Input
          id={`${itemType.toLowerCase()}Title`}
          value={newItem.title}
          onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${itemType.toLowerCase()}Content`}>Contenido</Label>
        <Textarea
          id={`${itemType.toLowerCase()}Content`}
          value={newItem.content}
          onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
          required
        />
      </div>
      <Button type="submit">Añadir {itemType}</Button>
    </form>
  );

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
                setItems={setBanners}
                itemType="Banner"
              />
              <NewItemForm
                onSubmit={(e) => handleNewItemSubmit(e, banners, setBanners)}
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
                setItems={setPopups}
                itemType="Pop-up"
              />
              <NewItemForm
                onSubmit={(e) => handleNewItemSubmit(e, popups, setPopups)}
                itemType="Pop-up"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
