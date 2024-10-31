<template>
	<div>
		<div class="header-container">
			<h1 class="update-title">Create User View</h1>
			<RouterLink :to="{ name: 'home' }">
				<v-btn class="mt-3" color="primary">Back to users</v-btn>
			</RouterLink>
		</div>

		<CustomAlert
			:type="alertType"
			:message="alertMessage"
			:show="showAlert"
			@dismiss="handleAlertDismiss"
			style="position: fixed; top: 80px; right: 20px; width: 300px"
		/>

		<FormSheet
			:width="300"
			:initialValid="valid"
			@submit="handleSubmit"
			@validityChange="(formValid) => (formValidity = formValid)"
		>
			<v-text-field
				v-model="fullName"
				:rules="[fullNameError]"
				label="Full Name"
				required
			></v-text-field>

			<v-text-field
				v-model="email"
				:rules="[emailError]"
				label="Email"
				required
			></v-text-field>

			<v-text-field
				v-model="password"
				:rules="[passwordError]"
				label="Password"
				type="password"
				required
			></v-text-field>
		</FormSheet>
	</div>
</template>

<script setup lang="ts">
import FormSheet from "@/components/FormSheet.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/useUserStore";
import CustomAlert from "@/components/CustomAlert.vue";
import {
	fullNameRules,
	emailRules,
	passwordRules,
} from "@/utils/validationRules";
// Adjust the path as necessary

// Reactive state
const fullName = ref("");
const email = ref("");
const password = ref("");
const formValidity = ref(false); // To track the form validity

const userStore = useUserStore();

const fullNameError = computed(() => fullNameRules(fullName.value));
const emailError = computed(() => emailRules(email.value));
const passwordError = computed(() => passwordRules(password.value));

const router = useRouter();

// Alert state
const showAlert = ref(false);
const alertMessage = ref("");
const alertType = ref("success"); // or "error"

const handleSubmit = async () => {
	try {
		await userStore.addUser({
			fullName: fullName.value,
			email: email.value,
			password: password.value,
		});
		alertMessage.value = "User created successfully!";
		alertType.value = "success";
		showAlert.value = true;

		setTimeout(() => {
			handleAlertDismiss();
		}, 2000);
	} catch (error) {
		console.error("Error creating user:", error);
		alertMessage.value = "Failed to create user. Please try again.";
		alertType.value = "error";
		showAlert.value = true;

		setTimeout(() => {
			handleAlertDismiss();
		}, 2000);
	}
};

const handleAlertDismiss = () => {
	showAlert.value = false;
	if (alertType.value === "success") {
		router.push({ name: "home" });
	}
};
</script>

<style scoped>
/* Add any styles if needed */
.header-container {
	display: flex;
	justify-content: space-between; /* Aligns the title and button on the same line */
	align-items: center; /* Vertically center the items */
	margin-bottom: 20px; /* Adds space below the header */
}

.update-title {
	flex-grow: 1; /* Allows the title to take available space, pushing the button to the right */
}

/* Add any additional styles needed for the alert */
.narrow-alert {
	max-width: 300px; /* Adjust the width as necessary */
}
</style>
