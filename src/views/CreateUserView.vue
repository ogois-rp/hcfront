<template>
  <div>
    <h1>Create User View</h1>
    <RouterLink :to="{ name: 'home' }">
      <v-btn class="mt-3" color="primary">Back to users</v-btn>
    </RouterLink>
    <FormSheet
      :width="300"
      :initialValid="valid"
      @submit="handleSubmit"
      @validityChange="formValid => (formValidity = formValid)"
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
import FormSheet from '@/components/FormSheet.vue'
import { ref, computed } from 'vue'
import { createUser } from '@/services/userService'
import {
  fullNameRules,
  emailRules,
  passwordRules,
} from '@/utils/validationRules'
// Adjust the path as necessary

// Reactive state
const fullName = ref('')
const email = ref('')
const password = ref('')
const formValidity = ref(false) // To track the form validity

const fullNameError = computed(() => fullNameRules(fullName.value))
const emailError = computed(() => emailRules(email.value))
const passwordError = computed(() => passwordRules(password.value))

// Handle form submission
const handleSubmit = async () => {
  try {
    // Make the API call to create the user
    await createUser({
      fullName: fullName.value,
      email: email.value,
      password: password.value,
    })
    alert('User created successfully!')
  } catch (error) {
    console.error('Error creating user:', error)
    alert('Failed to create user. Please try again.')
  }
}
</script>

<style scoped>
/* Add any styles if needed */
</style>
