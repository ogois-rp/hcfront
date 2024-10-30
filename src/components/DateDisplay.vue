<template>
  <span>{{ formattedDate }}</span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  date: string | Date
}

const props = defineProps<Props>()

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleString()
})
</script>

<style scoped>
/* Optional: Add any styles for the DateDisplay component here */
</style>
