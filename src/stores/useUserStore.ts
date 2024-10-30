import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, NewUser } from '@/types/userTypes'
import {
  fetchUsers,
  createUser,
  deleteUserById,
  updateUserById,
} from '@/services/userService'

export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])

  const loadUsers = async () => {
    try {
      users.value = await fetchUsers()
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const addUser = async (userData: NewUser) => {
    try {
      const newUser = await createUser(userData)
      users.value.push(newUser)
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Failed to create user.')
    }
  }

  const removeUser = async (id: number) => {
    try {
      await deleteUserById(id)
      users.value = users.value.filter(user => user.id !== id)
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error)
      alert(`Failed to delete user with ID ${id}.`)
    }
  }

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      await updateUserById(id, userData)
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = {
          ...users.value[index],
          ...userData,
        }
      }
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error)
      alert(`Failed to update user with ID ${id}.`)
    }
  }

  return {
    users,
    loadUsers,
    addUser,
    removeUser,
    updateUser,
  }
})
