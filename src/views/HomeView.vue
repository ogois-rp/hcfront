<template>
  <main>
    <h1>Users</h1>
    <RouterLink :to="{ name: 'createUser' }">
      <v-btn class="mt-3" color="primary">Create New User</v-btn>
    </RouterLink>
    <v-data-table :headers="headers" :items="users" class="elevation-1">
      <template v-slot:item.createdAt="{ item }">
        <DateDisplay :date="item.createdAt" />
      </template>
      <template v-slot:item.updatedAt="{ item }">
        <DateDisplay :date="item.updatedAt" />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          style="background-color: purple"
          icon="mdi-pencil"
          color="deep-purple"
          size="small"
          @click="() => router.push({ name: 'user', params: { id: item.id } })"
        ></v-icon>
        <v-icon
          style="background-color: red"
          icon="mdi-delete"
          color="deep-purple"
          size="small"
          @click="() => handleDeleteUser(item.id)"
        ></v-icon>
      </template>
    </v-data-table>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import DateDisplay from '@/components/DateDisplay.vue'

const userStore = useUserStore()
const headers = ref([
  { title: 'Full Name', value: 'fullName' },
  { title: 'Email', value: 'email' },
  { title: 'Created At', value: 'createdAt' },
  { title: 'Updated At', value: 'updatedAt' },
  { title: 'Actions', key: 'actions', sortable: false },
])

const router = useRouter()
const users = computed(() => userStore.users)

const loadData = async () => {
  await userStore.loadUsers()
}

const handleDeleteUser = async (id: number) => {
  await userStore.removeUser(id)
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* Your styles here */
</style>
