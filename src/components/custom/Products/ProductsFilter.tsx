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
import { CopFormatNumber } from "@/lib/utils";
import { Category } from "@/types/products";

interface ProductFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: Category[];
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  onFilter: () => void;
}

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  categories,
  priceRange,
  setPriceRange,
  onFilter,
}: ProductFiltersProps) {
  return (
    <div className="md:col-span-1">
      <div className="space-y-2">
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
            max={60000000}
            step={100000}
            value={priceRange}
            onValueChange={setPriceRange}
          />
          <div className="flex justify-between mt-2">
            <span>{CopFormatNumber(priceRange[0])}</span>
            <span>{CopFormatNumber(priceRange[1])}</span>
          </div>
        </div>
        <Button onClick={onFilter}>Aplicar filtros</Button>
      </div>
    </div>
  );
}
