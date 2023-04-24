import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import LogIn from "@/components/LogIn.vue";
import MyAccount from '@/components/MyAccount.vue';

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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
