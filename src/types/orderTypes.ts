// src/types/orderTypes

// Define Order type
export type Order = {
  id: number
  userId: string
  orderDate: string // You may use Date if parsing is needed
  product: string
}
