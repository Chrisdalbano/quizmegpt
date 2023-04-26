<template>
  <div id="app">
    <nav>
      <router-link class="nav-link" to="/">Quiz Me!</router-link>
      <router-link v-if="!loggedIn" class="nav-link" to="/login"
        >Log In</router-link
      >
      <router-link v-if="loggedIn" class="nav-link" to="/my-account"
        >My Account</router-link
      >
    </nav>
    <router-view
      @loggedInUserChanged="updateLoggedInState"
      :loggedInUser="loggedInUser"
    ></router-view>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "@/firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export default {
  setup() {
    const loggedInUser = ref(null);
    const loggedIn = ref(false);

    onAuthStateChanged(auth, (user) => {
      loggedInUser.value = user;
      loggedIn.value = user ? true : false;
    });

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
