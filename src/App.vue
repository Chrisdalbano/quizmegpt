<template>
  <div id="app">
    <nav>
      <router-link to="/" class="nav-link">Quiz me!</router-link>
      <router-link to="/login" class="nav-link">Log In</router-link>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
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