export interface Review {
  id: number
  documentId: string
  Text: string
  createdAt: string
  updatedAt: string
  publishedAt: any
  locale: any
  user: User
}

export interface User {
  id: number
  documentId: string
  display_name: string
}