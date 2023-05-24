<template>
  <div id="app">
    <NavBar :loggedIn="loggedIn"></NavBar>
    <transition name="page-fade" mode="out-in">
      <router-view @loggedInUserChanged="updateLoggedInState" :loggedInUser="loggedInUser"></router-view>
    </transition>
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


</style>