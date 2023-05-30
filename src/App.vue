<template>
  <div id="app">
    <NavBar :loggedIn="loggedIn"></NavBar>
    <transition name="page-fade" mode="out-in">
      <router-view @loggedInUserChanged="updateLoggedInState" :loggedInUser="loggedInUser"></router-view>
    </transition>
    <footer>
    <p class="footer-title">QuizMEGPT build by Christian D'Albano</p>
    <a class="footer-link" href="https://chrisdalbano.com" target="_blank">chrisdalbano.com</a>
  </footer>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  setup() {
    const store = useStore();
    const loggedInUser = computed(() => store.getters.loggedInUser);
    const loggedIn = computed(() => !!store.getters.loggedInUser);

    const updateLoggedInState = (user) => {
      store.commit("setLoggedInUser", user);
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
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s;
}
.page-fade-enter,
.page-fade-leave-to {
  opacity: 0;
}

.footer-title {
  display: flex;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.footer-link {
  text-decoration: none;
  display: flex;
  justify-content: center;

}

footer {
  font-size: 1rem;
  font-family: "Roboto", sans-serif;
  padding-top: 0.5rem;
  padding-bottom: 1rem; 
  background-color: #30a0e0;
  color:#161616;
}
</style>