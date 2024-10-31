<template>
	<div>
		<div class="header-container">
			<h1 class="update-title">Update User</h1>
			<RouterLink :to="{ name: 'home' }">
				<v-btn color="primary" class="back-button">Back to users</v-btn>
			</RouterLink>
		</div>

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

		<CustomDataTable :headers="headers" :items="orders">
			<template #order_date="{ item }">
				<DateDisplay :date="item.order_date" />
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

const alertMessage = ref("");
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

const openEditOrderModal = (item) => {
	editOrder.value = { ...item };
	showEditModal.value = true;
};

const handleAlertDismiss = () => {
	setTimeout(() => {
		showAlert.value = false;
	}, 500);
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
			alertType.value = "success";
			showAlert.value = true;

			displayName.value = fullName.value;
			setTimeout(() => {
				handleAlertDismiss();
			}, 2000);
		}
	} catch (error) {
		console.error("Error updating user:", error);
		alertMessage.value = "Failed to update user. Please try again.";
		alertType.value = "error";
		showAlert.value = true;
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
			showModal.value = false;
			await orderStore.fetchOrdersByUserId(userId);

			alertMessage.value = "Order created successfully!";
			alertType.value = "success";
			showAlert.value = true;
		}
	} catch (error) {
		console.error("Error creating order:", error);
		alertMessage.value = "Failed to create order. Please try again.";
		alertType.value = "error";
		showAlert.value = true;
	}
};

const handleDeleteOrder = async (id: number) => {
	try {
		await orderStore.deleteOrder(id);
		await orderStore.fetchOrdersByUserId(userId);

		alertMessage.value = "Order deleted successfully!";
		alertType.value = "success";
		showAlert.value = true;
	} catch (error) {
		console.error("Error deleting order:", error);
		alertMessage.value = "Failed to delete order. Please try again.";
		alertType.value = "error";
		showAlert.value = true;
	}
};

const handleUpdateOrder = async () => {
	try {
		if (userId && editOrder.value.id) {
			await orderStore.updateOrder(editOrder.value.id, {
				product: editOrder.value.product,
				orderDate: editOrder.value.orderDate,
			});
			showEditModal.value = false;
			await orderStore.fetchOrdersByUserId(userId);

			alertMessage.value = "Order updated successfully!";
			alertType.value = "success";
			showAlert.value = true;
		}
	} catch (error) {
		console.error("Error updating order:", error);
		alertMessage.value = "Failed to update order. Please try again.";
		alertType.value = "error";
		showAlert.value = true;
	}
};

onMounted(async () => {
	const user = userStore.users.find((user) => user.id === Number(userId));
	if (user) {
		fullName.value = user.fullName || "";
		email.value = user.email || "";
		displayName.value = user.fullName || "";
	}
	await orderStore.fetchOrdersByUserId(userId);
});
</script>

<style scoped>
.header-container {
	display: flex
	justify-content: space-between
	align-items: center
	margin-bottom: 20px
}

.update-title {
	flex-grow: 1
}

.orders-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}
</style>
