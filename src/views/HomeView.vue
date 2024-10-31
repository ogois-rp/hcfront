<template>
	<main>
		<div class="header-container">
			<h1 class="update-title">Users</h1>
			<RouterLink :to="{ name: 'createUser' }">
				<v-btn class="mt-3" color="primary">Create New User</v-btn>
			</RouterLink>
		</div>
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

const loadData = async () => {
	await userStore.loadUsers();
};

const handleDeleteUser = async (id: number) => {
	await userStore.removeUser(id);
};

onMounted(() => {
	loadData();
});
</script>

<style scoped>
/* Your styles here */

.header-container {
	display: flex;
	justify-content: space-between; /* Aligns the title and button on the same line */
	align-items: center; /* Vertically center the items */
	margin-bottom: 20px; /* Adds space below the header */
}

.update-title {
	flex-grow: 1; /* Allows the title to take available space, pushing the button to the right */
}
</style>
