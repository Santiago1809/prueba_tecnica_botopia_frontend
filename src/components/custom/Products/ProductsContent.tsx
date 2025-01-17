"use client";
import { useRouter, useSearchParams } from "next/navigation";
import ProductFilters from "./ProductsFilter";
import { useEffect, useState } from "react";
import { Category, ExternalCategoryData, ExternaProductData, Product } from "@/types/products";
import Products from "./Products";
import Loader from "@/components/Loader";
import { NEXT_PUBLIC_BACKEND_HOST } from "@/lib/constants";
import { getProducts } from "@/actions/products";

export default function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState<Product[] | null>();
  const [priceRange, setPriceRange] = useState([0, 6000000]);
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const categoryParam = searchParams.get("category") || "all";
    const searchParam = searchParams.get("search") || "";
    const minPrice = parseInt(searchParams.get("minPrice") || "0", 10);
    const maxPrice = parseInt(searchParams.get("maxPrice") || "6000000", 10);

    setCategory(categoryParam);
    setSearchTerm(searchParam);
    setPriceRange([minPrice, maxPrice]);
  }, [searchParams]);
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
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      const category = searchParams.get("category") || "all";
      const search = searchParams.get("search") || "";
      const minPrice = parseInt(searchParams.get("minPrice") || "0", 10);
      const maxPrice = parseInt(searchParams.get("maxPrice") || "6000000", 10);

      const filters = [];

      if (category !== "all") {
        filters.push(
          `filters[Category][Name][$eq]=${encodeURIComponent(category)}`
        );
      }

      filters.push(
        `filters[Price][$gte]=${minPrice}`,
        `filters[Price][$lte]=${maxPrice}`
      );

      if (search.trim()) {
        filters.push(`filters[Name][$contains]=${encodeURIComponent(search)}`);
      }

      const query = filters.length > 0 ? `&${filters.join("&")}` : "";

      try {
        const products = await getProducts(query);
        setFilteredProducts(products);
      } catch (error) {
        console.error("Error fetching filtered products:", error);
      }
    };

    fetchFilteredProducts();
  }, [searchParams]);

  // Handle filters
  const handleFilter = async () => {
    try {
      const filters = [];

      if (category !== "all") {
        filters.push(
          `filters[Category][Name][$eq]=${encodeURIComponent(category)}`
        );
      }

      filters.push(
        `filters[Price][$gte]=${priceRange[0]}`,
        `filters[Price][$lte]=${priceRange[1]}`
      );

      if (searchTerm.trim()) {
        filters.push(
          `filters[Name][$contains]=${encodeURIComponent(searchTerm)}`
        );
      }

      const query = filters.length > 0 ? `&${filters.join("&")}` : "";
      const response = await fetch(
        `${NEXT_PUBLIC_BACKEND_HOST}/api/products?populate[Images][fields][0]=url&populate[Category][fields][0]=Name${query}`
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const { data } = await response.json();
      const filtered: Product[] = data.map((prod: ExternaProductData) => ({
        id: prod.documentId,
        name: prod.Name,
        price: prod.Price,
        category: {
          documentId: prod.Category.documentId,
          id: prod.Category.id,
          Name: prod.Category.Name,
        },
        images: prod.Images.map(
          (image) => `${NEXT_PUBLIC_BACKEND_HOST}${image.url}`
        ),
      }));

      setFilteredProducts(filtered);

      // Update URL with the current filters
      const params = new URLSearchParams();
      if (category !== "all") params.set("category", category);
      if (searchTerm) params.set("search", searchTerm);
      params.set("minPrice", priceRange[0].toString());
      params.set("maxPrice", priceRange[1].toString());

      router.push(`?${params.toString()}`);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
      <ProductFilters
        searchTerm={searchTerm}
        categories={categories}
        category={category}
        onFilter={handleFilter}
        priceRange={priceRange}
        setCategory={setCategory}
        setPriceRange={setPriceRange}
        setSearchTerm={setSearchTerm}
      />
      {filteredProducts ? (
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Products products={filteredProducts} />
          </div>
        </div>
      ) : (
        <div className="md:col-span-3 flex items-center justify-center h-96">
          <Loader size="lg" />
        </div>
      )}
    </div>
  );
}
