<template>
  <nav>
    <router-link class="nav-link" to="/">Quiz Me!</router-link>
    <router-link v-if="!loggedIn" class="nav-link" to="/login">Log In</router-link>
    <router-link v-if="loggedIn" class="nav-link" to="/my-account">My Account</router-link>
  </nav>
  <router-view
    @loggedInUserChanged="updateLoggedInState"
    :loggedInUser="loggedInUser"
  ></router-view>
</template>

<script>
import { computed } from "vue";

export default {
  name: "NavBar",
  props: {
    userData: Object,
  },
  setup(props) {
    const loggedInUser = computed(() => props.userData);
    const loggedIn = computed(() => !!props.userData);

    const updateLoggedInState = (user) => {
      loggedInUser.value = user;
      loggedIn.value = user ? true : false;
    };

    return {
      loggedInUser,
      loggedIn,
      updateLoggedInState,
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