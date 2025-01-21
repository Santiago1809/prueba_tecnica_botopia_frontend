"use server";
import { BACKEND_HOST } from "@/lib/constants";
import {
  ExternalMostViewedProductData,
  ExternaProductData,
  Product,
} from "@/types/products";

export const insertView = async (id: string, user_id: number | string) => {
  const data =
    typeof user_id === "number"
      ? { data: { user: user_id, product: id } }
      : { data: { product: id } };

  await fetch(`${BACKEND_HOST}/api/views`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .catch((error) => console.error("Error inserting view:", error));
};

export const getProducts = async (query = ""): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/products?populate[Images][fields][0]=url&populate[Category][fields][0]=Name${query}`
    );
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const { data } = await response.json();
    const fetchedProducts = data.map((item: ExternaProductData) => ({
      id: item.id,
      documentId: item.documentId,
      name: item.Name,
      price: item.Price,
      category: {
        documentId: item.Category.documentId,
        id: item.Category.id,
        Name: item.Category.Name,
      },
      images: item.Images.map((image) => `${BACKEND_HOST}${image.url}`),
      stock: item.Stock,
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
      id: info.id,
      documentId: info.documentId,
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

export async function getMostViewedProducts() {
  try {
    const response = await fetch(
      `${BACKEND_HOST}/api/get-most-viewed-products`
    );
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const { data } = await response.json();
    const fetchedProducts: Product[] = data.map(
      (item: ExternalMostViewedProductData) => ({
        id: item.id,
        documentId: item.attributes.documentId,
        name: item.attributes.Name,
        price: item.attributes.Price,
        images: item.attributes.Images.map(
          (image) => `${BACKEND_HOST}${image.url}`
        ),
        category: item.attributes.Category,
        stock: item.attributes.Stock,
      })
    );

    return fetchedProducts;
  } catch (error) {
    console.error("Error fetching most viewed products:", error);
    return null;
  }
}

export async function getRecommendedProducts(token: string) {
  if (token === "") return await getPublicProducts();
  return await getLoggedProducts(token);
}

async function getLoggedProducts(token: string) {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/recommendations`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const products = []
    const { categoryBased, popular } = await response.json();
    products.push(...categoryBased, ...popular);
    products.map((prod: Product) => {
      prod.images = prod.images.map((image) => `${BACKEND_HOST}${image}`);
    })
    return products;
  } catch {
    return []
  }
}

async function getPublicProducts() {
  try {
    const response = await fetch(`${BACKEND_HOST}/api/public/recommendations`);
  if (!response.ok) throw new Error(`Error ${response.status}`);
  const products = [];
  const { random, popular } = await response.json();
  products.push(...random, ...popular);
  products.map((prod: Product) => {
    prod.images = prod.images.map((image) => `${BACKEND_HOST}${image}`);
  })
  return products;
  } catch {
    return []
  }
}
