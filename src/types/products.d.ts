export interface Product {
  id: number | string;
  name: string;
  price: number;
  images: string[];
  category: Category;
  description?: string;
  stock?: number;
}

export interface Category {
  id?: number;
  documentId?: string;
  Name: string;
}
export interface ExternalCategoryData {
  id: number
  documentId: string
  Name: string
  createdAt: string
  updatedAt: string
  publishedAt: string
}
export interface ExternaProductData {
  id: number
  documentId: string
  Name: string
  Description: string
  Category: Category
  Stock: number
  Price: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  Images: Image[]
}

export interface Image {
  id: number
  documentId: string
  url: string
}

export interface ExternalMostViewedProductData {
  id: number
  attributes: Attributes
}

export interface Attributes {
  documentId: string
  Name: string
  Description: string
  Price: number
  Stock: number
  createdAt: string
  updatedAt: string
  publishedAt: Date | null
  locale: string | null
  Images: Image[]
  viewCount: number
  Category: Category
}