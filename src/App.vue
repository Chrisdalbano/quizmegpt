<template>
  <div id="app">
    <nav>
      <router-link to="/" class="nav-link">Quiz me!</router-link>
      <router-link v-if="!isLoggedIn" to="/login" class="nav-link"
        >Log In</router-link
      >
      <router-link
        v-if="isLoggedIn"
        :to="{ name: 'MyAccount', params: { loggedInUser } }"
        class="nav-link"
      >
        <i class="user-icon"></i>
        My Account
      </router-link>
    </nav>
    <router-view :loggedInUser="loggedInUser" @loggedInUserChanged="updateLoggedInUser"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      loggedInUser: null,
    };
  },
  methods: {
    updateLoggedInUser(user) {
      this.loggedInUser = user;
    },
  },
  computed: {
    isLoggedIn() {
      return !!this.loggedInUser;
    },
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
