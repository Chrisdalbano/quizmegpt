<template>
  <nav>
    <router-link to="/" exact :class="{ active: $route.path === '/' }">
      <img class="nav-icon" src="../assets/quizme-icon.png" alt="Quiz Me!" />
    </router-link>
    <router-link v-if="!loggedIn" to="/login" exact :class="{ active: $route.path === '/login' }">
      <img class="nav-icon" src="../assets/User-icon.png" alt="Log In" />
    </router-link>
    <transition name="slide">
      <router-link v-if="loggedIn" to="/my-account" exact :class="{ active: $route.path === '/my-account' }">
        <img class="nav-icon" src="../assets/User-icon.png" alt="My Account" />
      </router-link>
    </transition>
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
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0px;
  background-color: #30a0e0;
  padding: 0.5rem;
  border-bottom-left-radius: 41px;
  border-bottom-right-radius: 41px;
}

.nav-icon {
  width: 36px;
  height: 36px;
  cursor: pointer;
  margin-bottom: 15px;
  margin-top: 10px;
}

.nav-icon:hover {
  opacity: 0.7;
}

.active {
  background-color: #006BB9;
  color: white;
  border-radius: 41px;
  
  transform: scale(0.85);
  transition: all 0.3s ease-in-out;
}




</style>