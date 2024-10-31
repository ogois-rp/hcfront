<template>
	<main>
		<div class="header-container">
			<h1 class="update-title">Users</h1>
			<RouterLink :to="{ name: 'createUser' }">
				<v-btn class="mt-3" color="primary">Create New User</v-btn>
			</RouterLink>
		</div>

		<CustomAlert
			:show="showAlert"
			:message="alertMessage"
			:type="alertType"
			@dismiss="handleAlertDismiss"
		/>
		<CustomDataTable :headers="headers" :items="users">
			<template #createdAt="{ item }">
				<DateDisplay :date="item.createdAt" />
			</template>
			<template #updatedAt="{ item }">
				<DateDisplay :date="item.updatedAt" />
			</template>
			<template #actions="{ item }">
				<v-icon
					icon="mdi-pencil"
					size="default"
					@click="() => router.push({ name: 'user', params: { id: item.id } })"
				></v-icon>
				<v-icon
					icon="mdi-delete"
					size="default"
					@click="() => handleDeleteUser(item.id)"
				></v-icon>
			</template>
		</CustomDataTable>
	</main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import DateDisplay from "@/components/DateDisplay.vue";
import CustomDataTable from "@/components/CustomDataTable.vue";
import CustomAlert from "@/components/CustomAlert.vue";

const userStore = useUserStore();
const headers = ref([
	{ title: "Full Name", value: "fullName", key: "name" },
	{ title: "Email", value: "email", key: "email" },
	{ title: "Created At", value: "createdAt", key: "createdAt" },
	{ title: "Updated At", value: "updatedAt", key: "updatedAt" },
	{ title: "Actions", key: "actions", sortable: false },
]);

const router = useRouter();
const users = computed(() => userStore.users);

const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("success");

const loadData = async () => {
	await userStore.loadUsers();
};

const handleDeleteUser = async (id: number) => {
	try {
		await userStore.removeUser(id);
		alertMessage.value = "User deleted successfully!";
		alertType.value = "success";
	} catch (error) {
		console.error("Error deleting user:", error);
		alertMessage.value = "Failed to delete user. Please try again.";
		alertType.value = "error";
	} finally {
		showAlert.value = true;
		setTimeout(() => {
			handleAlertDismiss();
		}, 2000);
	}
};

const handleAlertDismiss = () => {
	showAlert.value = false;
};

onMounted(() => {
	loadData();
});
</script>

<style scoped>
.header-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
}

.update-title {
	flex-grow: 1;
}
</style>
