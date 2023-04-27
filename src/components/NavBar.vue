<template>
  <nav>
    <router-link class="nav-link" to="/">Quiz Me!</router-link>
    <router-link v-if="!loggedIn" class="nav-link" to="/login"
      >Log In</router-link
    >
    <router-link v-if="loggedIn" class="nav-link" to="/my-account"
      >My Account</router-link
    >
  </nav>
  <router-view></router-view>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "NavBar",
  props: {
    userData: {
      type: Object,
      default: null,
    }
  },
  setup() {
    const store = useStore();
    const loggedInUser = computed(() => store.getters.loggedInUser);
    const loggedIn = computed(() => !!loggedInUser.value);

    return {
      loggedInUser,
      loggedIn,
    };
  },
};
</script>
<style>
nav {
  display: flex;
  justify-content: space-around;
  background-color: #333;
  padding: 1rem;
}

.nav-link {
  color: white;
  text-decoration: none;
}

.nav-link:hover {
  color: rgb(223, 175, 18);
}
</style>
