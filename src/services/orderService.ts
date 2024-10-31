import axiosInstance from "../axiosInstance.js";
import type { Order } from "@/types/orderTypes";

// Get orders by user ID with error handling
export const getOrdersByUserId = async (
	userId: number
): Promise<Order[] | null> => {
	try {
		const response = await axiosInstance.get(`/orders/${userId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching orders by user ID:", error);
		throw error; // Return null in case of error
	}
};

// Create order with error handling
export const createOrder = async (orderData: {
	userId: number;
	orderDate: string;
	product: string;
}): Promise<Order | null> => {
	try {
		console.log(orderData);
		const response = await axiosInstance.post("/orders", orderData);
		return response.data;
	} catch (error) {
		throw error; // Return null in case of error
	}
};

// Delete order by ID with error handling
export const deleteOrderById = async (id: number): Promise<void> => {
	try {
		await axiosInstance.delete(`/orders/${id}`);
	} catch (error) {
		throw error;
	}
};

// Get order by ID with error handling
export const getOrderById = async (id: number): Promise<Order | null> => {
	try {
		const response = await axiosInstance.get(`/order/${id}`);
		return response.data;
	} catch (error) {
		throw error; // Return null in case of error
	}
};

// Update order by ID with error handling
export const updateOrderById = async (
	id: number,
	updatedData: { orderDate: string; product: string }
): Promise<Order | null> => {
	try {
		const response = await axiosInstance.put(`/order/${id}/edit`, updatedData);
		return response.data;
	} catch (error) {
		throw error; // Return null in case of error
	}
};
