import { defineStore } from "pinia";
import { ref } from "vue";
import type { User, NewUser } from "@/types/userTypes";
import {
	fetchUsers,
	createUser,
	deleteUserById,
	updateUserById,
} from "@/services/userService";

export const useUserStore = defineStore("user", () => {
	const users = ref<User[]>([]);

	const loadUsers = async () => {
		try {
			users.value = await fetchUsers();
		} catch (error) {
			throw error;
		}
	};

	const addUser = async (userData: NewUser) => {
		try {
			const newUser = await createUser(userData);
			users.value.push(newUser);
		} catch (error) {
			throw error;
		}
	};

	const removeUser = async (id: number) => {
		try {
			await deleteUserById(id);
			users.value = users.value.filter((user) => user.id !== id);
		} catch (error) {
			throw error;
		}
	};

	const updateUser = async (id: number, userData: Partial<User>) => {
		try {
			debugger;
			await updateUserById(id, userData);
			const index = users.value.findIndex((user) => user.id === id);
			if (index !== -1) {
				users.value[index] = {
					...users.value[index],
					...userData,
				};
			}
		} catch (error) {
			throw error;
		}
	};

	return {
		users,
		loadUsers,
		addUser,
		removeUser,
		updateUser,
	};
});
