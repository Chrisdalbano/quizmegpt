<template>
  <nav>
    <router-link to="/">
      <img class="nav-icon" src="../assets/quizme-icon.png" alt="Quiz Me!" />
    </router-link>
    <router-link v-if="!loggedIn" to="/login">
      <img class="nav-icon" src="../assets/User-icon.png" alt="Log In" />
    </router-link>
    <transition name="page-fade" mode="out-in">
      <router-link v-if="loggedIn" to="/my-account">
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

.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s;
}
.page-fade-enter,
.page-fade-leave-to {
  opacity: 0;
}
</style>
