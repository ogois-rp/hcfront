<template>
	<span>{{ formattedDate }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
	date: string | Date;
}

const props = defineProps<Props>();

const formattedDate = computed(() => {
	debugger;
	const date = new Date(props.date);
	const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
	const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-indexed) and pad
	const year = date.getFullYear(); // Get full year

	return `${day}/${month}/${year}`; // Return formatted date as dd/mm/yyyy
});
</script>

<style scoped>
/* Optional: Add any styles for the DateDisplay component here */
</style>
