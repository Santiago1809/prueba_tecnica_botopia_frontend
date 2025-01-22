"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createProduct } from "@/actions/products";
import { useAuthStore } from "@/store/authStore";
import { Category } from "@/types/products";
import { getCategories } from "@/actions/category";

export default function NewProductPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<Category[]>([]); // Lista de categorías
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // Categoría seleccionada
  const [formData, setFormData] = useState({
    Name: "",
    Price: "",
    Description: "",
    Stock: "",
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Simula obtener las categorías desde una API
  useEffect(() => {
    async function fetchCategories() {
      const response = await getCategories();
      setCategories(response);
    }
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setImageFiles(files);

      // Crear previews para las imágenes
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast({
        title: "Categoría no seleccionada",
        description: "Por favor selecciona una categoría para el producto.",
        variant: "destructive",
      });
      return;
    }

    // Crear FormData
    const data = {
      ...formData,
      Category: selectedCategory,
      Images: imageFiles,
    };

    const submitData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value !== "string") {
        (value as File[]).forEach((file) => {
          submitData.append("Images", file);
        });
      } else {
        submitData.append(key, value);
      }
    });

    const res = await createProduct(submitData, token);
    if (!res) return;

    toast({
      title: "Producto creado",
      description: "El producto ha sido creado exitosamente.",
    });
    router.push("/admin/products");
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold tracking-tight text-gray-800">
        Añadir Nuevo Producto
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-700">
            Información del Producto
          </legend>
          <div>
            <Label htmlFor="name">Nombre del Producto</Label>
            <Input
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              placeholder="Ingrese el nombre del producto"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input
              id="Price"
              name="Price"
              type="number"
              value={formData.Price}
              onChange={handleInputChange}
              placeholder="Ingrese el precio"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="Description"
              name="Description"
              value={formData.Description}
              onChange={handleInputChange}
              placeholder="Descripción detallada del producto"
              className="resize-none"
              required
            />
          </div>
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="Stock"
              name="Stock"
              type="number"
              value={formData.Stock}
              onChange={handleInputChange}
              placeholder="Cantidad disponible"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Categoría</Label>
            <Select onValueChange={(value) => setSelectedCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={(category.id as number).toString()}>
                    {category.Name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="text-lg font-semibold text-gray-700">
            Imágenes del Producto
          </legend>
          <div>
            <Label htmlFor="images">Cargar Imágenes</Label>
            <div className="flex items-center gap-4">
              <Input
                id="Images"
                name="Images"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="hidden"
              />
              <Label
                htmlFor="Images"
                className="cursor-pointer block bg-black px-4 py-2 rounded text-white"
              >
                Seleccionar Imágenes
              </Label>
            </div>
          </div>
          <div className="mt-4 flex gap-4 flex-wrap">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative w-32 h-32 border rounded overflow-hidden"
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  onClick={() => {
                    setImageFiles((prev) => prev.filter((_, i) => i !== index));
                    setImagePreviews((prev) =>
                      prev.filter((_, i) => i !== index)
                    );
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <Button type="submit" className="w-full">
          Crear Producto
        </Button>
      </form>
    </div>
  );
}
