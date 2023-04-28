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
</template>

<script>
export default {
  name: "NavBar",
  props: {
    loggedIn: Boolean,
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
