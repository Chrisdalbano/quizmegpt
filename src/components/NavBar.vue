<template>
  <nav>
    <router-link to="/" exact :class="{ active: $route.path === '/' }">
      <img class="nav-icon" src="../assets/quizme-icon.png" alt="Quiz Me!" />
    </router-link>
    <div v-if="!loggedIn" class="login-overlay">
      <router-link to="/login" exact :class="{ activeLogin : $route.path === '/login' }">
        <img class="nav-icon" src="../assets/User-icon.png" alt="Log In" />
      </router-link>
      <div class="glow-effect"></div>
    </div>
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


.login-overlay {
  position: relative;
  display: inline-block;
}

.glow-effect {
  position: absolute;
  top: 4px;
  left: 0;
  width: 100%;
  height: 80%;
  border-radius: 50%;
  background-color: rgba(142, 255, 13, 0.8);
  animation: glowing 2s infinite;
  pointer-events: none;
  opacity: 40%;
}

@keyframes glowing {
  0% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }
}

@media only screen and (max-width: 600px) {
  .nav {
    padding: 1rem;
  }
  .nav-icon {
    width: 50px;
    height: 50px;
  }
}
</style>