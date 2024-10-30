// src/userService.ts
import axiosInstance from '../axiosInstance.js'

// src/userService.ts
import type { User, NewUser } from '../types/userTypes'

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get('/users')
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Create new user with error handling
export const createUser = async (newUser: NewUser): Promise<User | null> => {
  try {
    const response = await axiosInstance.post('/users', newUser)
    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error // Return null in case of error
  }
}

// Get user by ID with error handling
export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const response = await axiosInstance.get(`/users/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user by ID:', error)
    throw error // Return null in case of error
  }
}

export const deleteUserById = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/users/${id}`)
    console.log(`User with ID ${id} deleted successfully.`)
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error)
    // You can add more detailed error handling here if needed
    throw new Error(`Failed to delete user with ID ${id}.`)
  }
}

export const updateUserById = async (
  id: number,
  userData: Partial<User>,
): Promise<User | null> => {
  try {
    const response = await axiosInstance.put(`/user/${id}/edit`, userData)
    return response.data
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error)
    return null // Return null in case of an error
  }
}