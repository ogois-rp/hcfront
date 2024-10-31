<template>
	<div>
		<div class="header-container">
			<h1 class="update-title">Update User</h1>
			<RouterLink :to="{ name: 'home' }">
				<v-btn color="primary" class="back-button">Back to users</v-btn>
			</RouterLink>
		</div>

		<!-- Single Alert for Success/Error -->
		<CustomAlert
			v-if="showAlert"
			:message="alertMessage"
			:type="alertType"
			:show="showAlert"
			@dismiss="handleAlertDismiss"
		/>

		<FormSheet
			:width="300"
			submitText="Update"
			@submit="handleSubmit"
			@validityChange="(formValid) => (formValidity = formValid)"
		>
			<v-text-field
				v-model="fullName"
				label="Full Name"
				:rules="[fullNameError]"
			></v-text-field>

			<v-text-field
				v-model="email"
				label="Email"
				:rules="[emailError]"
			></v-text-field>
		</FormSheet>

		<div class="orders-header">
			<h2>User Orders for {{ displayName }}</h2>
			<v-btn @click="showModal = true" color="primary">Create New Order</v-btn>
		</div>

		<!-- Use CustomDataTable component here -->
		<CustomDataTable :headers="headers" :items="orders">
			<template #order_date="{ item }">
				<DateDisplay :date="item.order_date" />
				<!-- Format as needed -->
			</template>
			<template #actions="{ item }">
				<v-icon
					icon="mdi-pencil"
					@click="() => openEditOrderModal(item)"
				></v-icon>
				<v-icon
					icon="mdi-delete"
					size="default"
					@click="() => handleDeleteOrder(item.id)"
				></v-icon>
			</template>
		</CustomDataTable>

		<!-- Modal for creating a new order -->
		<v-dialog v-model="showModal" max-width="500px">
			<v-card>
				<v-card-title class="headline">Create New Order</v-card-title>
				<v-card-text>
					<FormSheet
						:width="300"
						submitText="Create"
						@submit="handleCreateOrder"
						@validityChange="(formValid) => (formValidityOrder = formValid)"
					>
						<v-text-field
							v-model="newOrder.product"
							label="Product"
							:rules="[productError]"
						></v-text-field>

						<v-text-field
							v-model="newOrder.orderDate"
							label="Order Date"
							type="date"
							:rules="[orderDateError]"
						></v-text-field>
					</FormSheet>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="showModal = false" text>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<!-- Modal for updating an order -->
		<v-dialog v-model="showEditModal" max-width="500px">
			<v-card>
				<v-card-title class="headline">Update Order</v-card-title>
				<v-card-text>
					<FormSheet
						:width="300"
						submitText="Update"
						@submit="handleUpdateOrder"
						@validityChange="(formValid) => (formValidityUpdate = formValid)"
					>
						<v-text-field
							v-model="editOrder.product"
							label="Product"
							:rules="[editProductError]"
						></v-text-field>

						<v-text-field
							v-model="editOrder.orderDate"
							label="Order Date"
							type="date"
							:rules="[editOrderDateError]"
						></v-text-field>
					</FormSheet>
				</v-card-text>
				<v-card-actions>
					<v-btn @click="showEditModal = false" text>Cancel</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script setup lang="ts">
import FormSheet from "@/components/FormSheet.vue";
import CustomDataTable from "@/components/CustomDataTable.vue";
import CustomAlert from "@/components/CustomAlert.vue";
import DateDisplay from "@/components/DateDisplay.vue";
import { ref, onMounted, computed } from "vue";
import { useUserStore } from "@/stores/useUserStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useRoute } from "vue-router";
import {
	fullNameRules,
	emailRules,
	orderDateRules,
} from "@/utils/validationRules";

const userStore = useUserStore();
const orderStore = useOrderStore();
const route = useRoute();
// Data for orders table
const orders = computed(() => orderStore.orders);
const headers = [
	{ title: "Order ID", value: "id" },
	{ title: "Product", value: "product" },
	{ title: "Order Date", value: "order_date" },
	{ title: "Actions", key: "actions", sortable: false },
];

const fullName = ref("");
const displayName = ref("");
const email = ref("");
const formValidity = ref(false);
const formValidityOrder = ref(false);
const formValidityUpdate = ref(false);
const showAlert = ref(false);
const showModal = ref(false);
const showEditModal = ref(false);
const newOrder = ref({
	product: "",
	orderDate: "",
});
const editOrder = ref({
	product: "",
	orderDate: "",
});

const alertMessage = ref(""); // Alert message
const alertType = ref("success");

const userId = Number(route.params.id);

const fullNameError = computed(() => fullNameRules(fullName.value));
const emailError = computed(() => emailRules(email.value));

const productError = computed(() => fullNameRules(newOrder.value.product));
const orderDateError = computed(() => orderDateRules(newOrder.value.orderDate));

const editProductError = computed(() => fullNameRules(editOrder.value.product));
const editOrderDateError = computed(() =>
	orderDateRules(editOrder.value.orderDate)
);

// Open the edit order modal with the selected order details
const openEditOrderModal = (item) => {
	editOrder.value = { ...item }; // Populate the edit form with selected order details
	showEditModal.value = true; // Show the edit modal
};

const handleAlertDismiss = () => {
	setTimeout(() => {
		showAlert.value = false;
	}, 500); // Match the duration of the slide-out animation
};

const handleSubmit = async () => {
	try {
		if (userId) {
			debugger;
			await userStore.updateUser(Number(userId), {
				fullName: fullName.value,
				email: email.value,
			});
			alertMessage.value = "User updated successfully!";
			alertType.value = "success"; // Set alert type to success
			showAlert.value = true; // Show alert
			// Optionally, navigate back after a short delay
			displayName.value = fullName.value;
			setTimeout(() => {
				handleAlertDismiss();
			}, 2000); // Duration for the alert to be visible
		}
	} catch (error) {
		console.error("Error updating user:", error);
		alertMessage.value = "Failed to update user. Please try again."; // Set error message
		alertType.value = "error"; // Set alert type to error
		showAlert.value = true; // Show alert
	}
};

const handleCreateOrder = async () => {
	try {
		if (userId) {
			await orderStore.createNewOrder({
				user: userId,
				product: newOrder.value.product,
				orderDate: newOrder.value.orderDate,
			});
			showModal.value = false; // Close create order modal
			await orderStore.fetchOrdersByUserId(userId); // Refresh orders

			// Show success alert
			alertMessage.value = "Order created successfully!";
			alertType.value = "success"; // Set alert type to success
			showAlert.value = true; // Show alert
		}
	} catch (error) {
		console.error("Error creating order:", error);
		alertMessage.value = "Failed to create order. Please try again."; // Set error message
		alertType.value = "error"; // Set alert type to error
		showAlert.value = true; // Show alert
	}
};

const handleDeleteOrder = async (id: number) => {
	try {
		await orderStore.deleteOrder(id);
		await orderStore.fetchOrdersByUserId(userId); // Refresh the orders after deletion

		// Show success alert
		alertMessage.value = "Order deleted successfully!";
		alertType.value = "success"; // Set alert type to success
		showAlert.value = true; // Show alert
	} catch (error) {
		console.error("Error deleting order:", error);
		alertMessage.value = "Failed to delete order. Please try again."; // Set error message
		alertType.value = "error"; // Set alert type to error
		showAlert.value = true; // Show alert
	}
};

const handleUpdateOrder = async () => {
	try {
		if (userId && editOrder.value.id) {
			await orderStore.updateOrder(editOrder.value.id, {
				product: editOrder.value.product,
				orderDate: editOrder.value.orderDate,
			});
			showEditModal.value = false; // Close edit modal
			await orderStore.fetchOrdersByUserId(userId); // Refresh orders after update

			// Show success alert
			alertMessage.value = "Order updated successfully!";
			alertType.value = "success"; // Set alert type to success
			showAlert.value = true; // Show alert
		}
	} catch (error) {
		console.error("Error updating order:", error);
		alertMessage.value = "Failed to update order. Please try again."; // Set error message
		alertType.value = "error"; // Set alert type to error
		showAlert.value = true; // Show alert
	}
};

// Optionally load user data into the form fields
onMounted(async () => {
	const user = userStore.users.find((user) => user.id === Number(userId));
	if (user) {
		fullName.value = user.fullName || "";
		email.value = user.email || "";
		displayName.value = user.fullName || "";
	}

	// Fetch orders for the user
	await orderStore.fetchOrdersByUserId(userId);
});
</script>

<style scoped>
.header-container {
	display: flex;
	justify-content: space-between; /* Aligns the title and button on the same line */
	align-items: center; /* Vertically center the items */
	margin-bottom: 20px; /* Adds space below the header */
}

.update-title {
	flex-grow: 1; /* Allows the title to take available space, pushing the button to the right */
}

.orders-header {
	display: flex;
	justify-content: space-between; /* Aligns items on either end */
	align-items: center; /* Vertically centers items */
	margin-bottom: 20px; /* Adds space below the header */
}
</style>
