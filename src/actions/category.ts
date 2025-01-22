"use server"
import { BACKEND_HOST } from "@/lib/constants";
import { Category, ExternalCategoryData } from "@/types/products";

export const getCategories = async () => {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/categories`
    );
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const { data } = await response.json();
    const fetchedCategories: Category[] = data.map(
      (item: ExternalCategoryData) => ({
        id: item.id,
        Name: item.Name,
      })
    );
    return fetchedCategories;
  } catch (error) {
    return []
  }
};

