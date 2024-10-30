import { createRouter, createWebHistory } from 'vue-router'
import CreateUserView from '@/views/CreateUserView.vue'
import HomeView from '../views/HomeView.vue'
import UserView from '../views/UserView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/users/create', // Route for creating a new user
      name: 'createUser',
      component: CreateUserView, // Component to handle user creation
    },
    {
      path: '/users/:id', // Dynamic route for a specific user
      name: 'user',
      component: UserView,
      props: true, // Enable props to pass route params as props
    },
  ],
})

export default router
