"use client";

import { useEffect, useState } from "react";
import Container from "@/components/custom/Container";
import Products from "@/components/custom/Products/Products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { NEXT_PUBLIC_BACKEND_HOST } from "@/lib/constants";
import {
  Category,
  ExternalCategoryData,
  ExternaProductData,
  Product,
} from "@/types/products";

export default function ProductsPage() {
  const [_products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [priceRange, setPriceRange] = useState([0, 1500]);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch data
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_BACKEND_HOST}/api/categories`
        );
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const { data } = await response.json();
        const fetchedCategories: Category[] = data.map(
          (item: ExternalCategoryData) => ({
            id: item.id,
            Name: item.Name,
          })
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_BACKEND_HOST}/api/products?populate[Images][fields][0]=url&populate[Category][fields][0]=Name`
        );
        if (!response.ok) throw new Error(`Error ${response.status}`);
        const { data } = await response.json();
        const fetchedProducts: Product[] = data.map(
          (item: ExternaProductData) => ({
            id: item.documentId,
            name: item.Name,
            price: item.Price,
            category: {
              documentId: item.Category.documentId,
              id: item.Category.id,
              Name: item.Category.Name,
            },
            images: item.Images.map(
              (image) => `${NEXT_PUBLIC_BACKEND_HOST}${image.url}`
            ),
          })
        );
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Handle filters
  const handleFilter = async () => {
   const response = await fetch(`${NEXT_PUBLIC_BACKEND_HOST}/api/products?populate[Images][fields][0]=url&populate[Category][fields][0]=Name${category==='all' ? '' : `&filters[Category][Name][$eq]=${category}`}`);
   const {data} = await response.json();
   const filtered: Product[] = data.map((prod: ExternaProductData) => {
      return {
        id: prod.documentId,
        name: prod.Name,
        price: prod.Price,
        category: {
          documentId: prod.Category.documentId,
          id: prod.Category.id,
          Name: prod.Category.Name,
        },
        images: prod.Images.map((image) => `${NEXT_PUBLIC_BACKEND_HOST}${image.url}`),
      };
   })
   setFilteredProducts(filtered);
   
  };

  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-2">
                  <Input
                    placeholder="Buscar categoría..."
                    className="mb-2"
                    onChange={(e) => {
                    const input = e.target as HTMLInputElement;
                    const items = document.querySelectorAll('[role="option"]');
                    items.forEach((item) => {
                      const text = item.textContent?.toLowerCase() || '';
                      const matches = text.includes(input.value.toLowerCase());
                      (item as HTMLElement).style.display = matches ? 'block' : 'none';
                    });
                    }}
                  />
                  </div>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                  <SelectItem key={category.id} value={category.Name}>
                    {category.Name}
                  </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rango de precio</Label>
              <Slider
                min={0}
                max={1500}
                step={10}
                value={priceRange}
                onValueChange={setPriceRange}
              />
              <div className="flex justify-between mt-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            <Button onClick={handleFilter}>Aplicar filtros</Button>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Products products={filteredProducts} />
          </div>
        </div>
      </div>
    </Container>
  );
}
