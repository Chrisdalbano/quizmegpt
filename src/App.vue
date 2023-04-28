<template>
  <div id="app">
    <NavBar :loggedIn="loggedIn"></NavBar>
    <router-view @loggedInUserChanged="updateLoggedInState" :loggedInUser="loggedInUser"></router-view>
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