import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LogIn from "@/views/LogIn.vue";
import MyAccount from '@/views/MyAccount.vue';

const routes = [
  {
    path: "/",
    name: "HomeView",
    component: HomeView,
  },
  {
    path: "/login",
    name: "LogIn",
    component: LogIn,
  },

  {
    path: "/my-account",
    name: "MyAccount",
    component: MyAccount,
    props: (route) => ({ loggedInUser: route.params.loggedInUser }),
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
