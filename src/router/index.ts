import { createRouter, createWebHistory } from "vue-router";
import CreateUserView from "@/views/CreateUserView.vue";
import HomeView from "../views/HomeView.vue";
import UserView from "../views/UserView.vue";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/users/create",
			name: "createUser",
			component: CreateUserView,
		},
		{
			path: "/users/:id",
			name: "user",
			component: UserView,
			props: true,
		},
	],
});

export default router;
