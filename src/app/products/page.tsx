'use client'

import Container from '@/components/custom/Container'
import Products from '@/components/custom/Products/Products'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Product } from '@/types/products'
import { useState } from 'react'

const products: Product[] = [
  { id: 1, name: "Smartphone X", price: 599, category: "Smartphones", images: ["/placeholder.svg"] },
  { id: 2, name: "Laptop Pro", price: 1299, category: "Laptops", images: ["/placeholder.svg"] },
  { id: 3, name: "Auriculares Inalámbricos", price: 149, category: "Audio", images: ["/placeholder.svg"] },
  { id: 4, name: "Smartwatch Elite", price: 299, category: "Wearables", images: ["/placeholder.svg"] },
  { id: 5, name: "Tablet Ultra", price: 449, category: "Tablets", images: ["/placeholder.svg"] },
  { id: 6, name: "Cámara 4K", price: 799, category: "Cámaras", images: ["/placeholder.svg"] },
]

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [category, setCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const handleFilter = () => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = category === "all" || product.category === category
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })
    setFilteredProducts(filtered)
  }
  return (
    <Container>
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <search>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                type="search"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </search>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="Smartphones">Smartphones</SelectItem>
                  <SelectItem value="Laptops">Laptops</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                  <SelectItem value="Wearables">Wearables</SelectItem>
                  <SelectItem value="Tablets">Tablets</SelectItem>
                  <SelectItem value="Cámaras">Cámaras</SelectItem>
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
  )
}