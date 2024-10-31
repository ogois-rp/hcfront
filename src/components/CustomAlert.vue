<template>
	<v-alert
		v-if="show"
		:type="type"
		dismissible
		@input="handleDismiss"
		class="fade-alert narrow-alert"
		style="position: fixed; top: 80px; right: 20px; width: 30%"
	>
		<slot>{{ message }}</slot>
	</v-alert>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

// Props for the alert
const props = defineProps({
	message: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: "success", // Default to success type
		validator: (value) =>
			["success", "error", "info", "warning"].includes(value),
	},
	duration: {
		type: Number,
		default: 3000, // Default duration for auto-dismiss
	},
	show: {
		type: Boolean,
		default: false,
	},
});

// Emit event to handle dismissal
const emit = defineEmits(["dismiss"]);

const handleDismiss = () => {
	emit("dismiss"); // Emit the dismiss event
};

// Automatically hide the alert after the specified duration
if (props.show) {
	setTimeout(() => {
		handleDismiss();
	}, props.duration);
}
</script>

<style scoped>
.fade-alert {
	transition: opacity 0.5s ease;
}

.narrow-alert {
	max-width: 300px; /* Adjust width as needed */
}
</style>
