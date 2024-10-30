<!-- FormSheet.vue -->
<template>
  <v-sheet class="mx-auto" :width="width">
    <v-form v-model="internalValid" @submit.prevent="handleFormSubmit">
      <slot />
      <v-btn class="mt-2" type="submit" block :disabled="!internalValid">
        {{ submitText }}
      </v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 300,
  },
  submitText: {
    type: String,
    default: 'Submit',
  },
  initialValid: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'validityChange'])

const internalValid = ref(props.initialValid)

watch(internalValid, newVal => emit('validityChange', newVal))

const handleFormSubmit = () => emit('submit')
</script>

<style scoped>
/* Add any reusable styles if needed */
</style>
