"use server";
import { BACKEND_HOST } from "@/lib/constants";
import { ExternaProductData, Product } from "@/types/products";
import { getOrCreateSessionId } from "@/utils/session";

export const insertView = async (id: string) => {
  const sessionId = getOrCreateSessionId();
  await fetch(`${BACKEND_HOST}/api/views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        SessionId: await sessionId,
        product: id,
      },
    }),
  });
};

export const getProducts = async () => {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/products?populate[Images][fields][0]=url&populate[Category][fields][0]=Name`
    );
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const { data } = await response.json();
    const fetchedProducts: Product[] = data.map((item: ExternaProductData) => ({
      id: item.documentId,
      name: item.Name,
      price: item.Price,
      category: {
        documentId: item.Category.documentId,
        id: item.Category.id,
        Name: item.Category.Name,
      },
      images: item.Images.map((image) => `${BACKEND_HOST}${image.url}`),
    }));
    return fetchedProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const fetchProduct = async (id: string) => {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/products/${id}?populate[Images][fields][0]=url`
    );
    const { data } = await response.json();
    const info = data as ExternaProductData;

    const externalProduct: Product = {
      id: info.documentId,
      name: info.Name,
      description: info.Description,
      price: info.Price,
      category: info.Category,
      images: info.Images.map((image) => `${BACKEND_HOST}${image.url}`),
      stock: info.Stock,
    };
    return externalProduct;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};
