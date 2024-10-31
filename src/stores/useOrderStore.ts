// src/stores/orderStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import {
	getOrdersByUserId,
	createOrder,
	deleteOrderById,
	getOrderById,
	updateOrderById,
} from "@/services/orderService";
import type { Order } from "@/types/orderTypes";

export const useOrderStore = defineStore("order", () => {
	const orders = ref<Order[]>([]);
	const order = ref<Order | null>(null);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchOrdersByUserId = async (userId: number) => {
		loading.value = true;
		error.value = null;
		try {
			const data = await getOrdersByUserId(userId);
			orders.value = data || [];
		} catch (err) {
			error.value = "Error fetching orders";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const fetchOrderById = async (id: number) => {
		loading.value = true;
		error.value = null;
		try {
			const data = await getOrderById(id);
			order.value = data;
		} catch (err) {
			error.value = "Error fetching order";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const createNewOrder = async (orderData: {
		userId: number;
		orderDate: string;
		product: string;
	}) => {
		loading.value = true;
		error.value = null;
		try {
			const data = await createOrder(orderData);
			orders.value.push(data as Order);
		} catch (err) {
			error.value = "Error creating order";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const deleteOrder = async (id: number) => {
		loading.value = true;
		error.value = null;
		try {
			await deleteOrderById(id);
			orders.value = orders.value.filter((order) => order.id !== id);
		} catch (err) {
			error.value = "Error deleting order";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	const updateOrder = async (
		id: number,
		updatedData: { orderDate: string; product: string }
	) => {
		loading.value = true;
		error.value = null;
		try {
			const updatedOrder = await updateOrderById(id, updatedData);
			orders.value = orders.value.map((order) =>
				order.id === id ? (updatedOrder as Order) : order
			);
		} catch (err) {
			error.value = "Error updating order";
			throw err;
		} finally {
			loading.value = false;
		}
	};

	return {
		orders,
		order,
		loading,
		error,
		fetchOrdersByUserId,
		fetchOrderById,
		createNewOrder,
		deleteOrder,
		updateOrder,
	};
});
