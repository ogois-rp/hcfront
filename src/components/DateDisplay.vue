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
	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();

	return `${day}/${month}/${year}`;
});
</script>

<style scoped></style>
