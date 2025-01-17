import { Product } from "./products"

export interface Order {
  createdAt: string
  id: number
  documentId: string
  updatedAt: string
  publishedAt: Date | null
  locale: string | null
  Products: OrderProduct[]
  PaymentMethod: string
  Stage: OrderStageType,
  TotalPrice: number
}
interface OrderProduct extends Product {
  quantity: number
  Name: string
}

enum OrderStage {
  Received = "Recibido",
  Packing = "Empaquetando",
  Sended = "Enviado",
  Delivered = "Entregado",
  Canceled = "Cancelado"
}
export type OrderStageType = keyof typeof OrderStage;