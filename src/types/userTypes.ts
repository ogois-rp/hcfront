// src/types/userTypes

export type User = {
  id: number
  fullName: string
  email: string
  createdAt: string // You may use Date if parsing is needed
  updatedAt: string // You may use Date if parsing is needed
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'> & {
  password: string
}
