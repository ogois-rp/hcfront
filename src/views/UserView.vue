<template>
  <div>
    <h1>Update User</h1>

    <v-alert
      v-if="showAlert"
      type="success"
      dismissible
      class="fade-alert narrow-alert"
      @input="showAlert = false"
    >
      User updated successfully!
    </v-alert>

    <FormSheet
      :width="300"
      submitText="Update"
      @submit="handleSubmit"
      @validityChange="formValid => (formValidity = formValid)"
    >
      <v-text-field
        v-model="fullName"
        label="Full Name"
        :rules="[fullNameError]"
      ></v-text-field>

      <v-text-field
        v-model="email"
        label="Email"
        :rules="[emailError]"
      ></v-text-field>
    </FormSheet>

    <RouterLink :to="{ name: 'home' }">
      <v-btn class="mt-3" color="primary">Back to users</v-btn>
    </RouterLink>

    <h2>User Orders</h2>
    <v-btn @click="showModal = true" class="mt-3" color="primary"
      >Create New Order</v-btn
    >
    <v-data-table
      :headers="headers"
      :items="orders"
      :loading="loading"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>Orders</v-toolbar-title>
        </v-toolbar>
      </template>
    </v-data-table>

    <!-- Modal for creating a new order -->
    <v-dialog v-model="showModal" max-width="500px">
      <v-card>
        <v-card-title class="headline">Create New Order</v-card-title>
        <v-card-text>
          <FormSheet
            :width="300"
            submitText="Create"
            @submit="handleCreateOrder"
            @validityChange="formValid => (formValidityOrder = formValid)"
          >
            <v-text-field
              v-model="newOrder.product"
              label="Product"
              :rules="[productError]"
            ></v-text-field>

            <v-text-field
              v-model="newOrder.orderDate"
              label="Order Date"
              type="date"
              :rules="[orderDateError]"
            ></v-text-field>
          </FormSheet>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showModal = false" text>Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import FormSheet from '@/components/FormSheet.vue'
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { useOrderStore } from '@/stores/useOrderStore'
import { useRoute } from 'vue-router'
import {
  fullNameRules,
  emailRules,
  orderDateRules,
} from '@/utils/validationRules'

const userStore = useUserStore()
const orderStore = useOrderStore()
const route = useRoute()

// Data for orders table
const orders = computed(() => orderStore.orders)
const loading = computed(() => orderStore.loading)
const headers = [
  { title: 'Order ID', value: 'id' },
  { title: 'Product', value: 'product' },
  { title: 'Order Date', value: 'order_date' },
]

const fullName = ref('')
const email = ref('')
const formValidity = ref(false)
const formValidityOrder = ref(false)
const showAlert = ref(false)
const showModal = ref(false)
const newOrder = ref({
  product: '',
  orderDate: '',
})

const userId = Number(route.params.id)

const handleSubmit = async () => {
  if (userId) {
    await userStore.updateUser(Number(userId), {
      fullName: fullName.value,
      email: email.value,
    })

    showAlert.value = true // Show success alert after update

    // Hide alert after a few seconds
    setTimeout(() => {
      showAlert.value = false
    }, 2000)
  }
}

const handleCreateOrder = async () => {
  if (userId) {
    await orderStore.createNewOrder({
      user: userId,
      product: newOrder.value.product,
      orderDate: newOrder.value.orderDate,
    })
    showModal.value = false
    await orderStore.fetchOrdersByUserId(userId)
  }
}

const fullNameError = computed(() => fullNameRules(fullName.value))
const productError = computed(() => fullNameRules(newOrder.value.product))
const emailError = computed(() => emailRules(email.value))
const orderDateError = computed(() => orderDateRules(newOrder.value.orderDate))

// Optionally load user data into the form fields
onMounted(async () => {
  const user = userStore.users.find(user => user.id === Number(userId))
  if (user) {
    fullName.value = user.fullName || ''
    email.value = user.email || ''
  }

  // Fetch orders for the user
  await orderStore.fetchOrdersByUserId(userId)
})
</script>

<style scoped>
/* Your styles here */
</style>
