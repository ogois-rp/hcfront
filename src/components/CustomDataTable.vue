<!-- components/CustomDataTable.vue -->
<template>
	<v-data-table :headers="headers" :items="items" class="elevation-1">
		<template
			v-for="header in headers"
			v-slot:[`item.${header.value}`]="{ item }"
		>
			<slot :name="header.value" :item="item">{{ item[header.value] }}</slot>
		</template>

		<template v-slot:item.actions="{ item }">
			<slot name="actions" :item="item"></slot>
		</template>
	</v-data-table>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
	headers: Array<{
		title: string;
		value: string;
		key?: string;
		sortable?: boolean;
	}>;
	items: Array<Record<string, any>>;
}>();
</script>

<style scoped></style>
