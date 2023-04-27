<template>
  <div id="app">
    <NavBar :userData="userData"></NavBar>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import NavBar from "./components/NavBar.vue";

export default {
  components: {
    NavBar,
  },
  created() {
    this.$store.dispatch("initAuthObserver");
  },
  setup() {
    const store = useStore();

    const userData = computed(() => store.getters.loggedInUser);

    onMounted(() => {
      // Dispatch the action to fetch user data when the component is created
      // Replace "yourUserId" with the actual user ID or a dynamic value
      if (userData.value) {
        store.dispatch("fetchUserData", userData.value.uid);
      }
    });

    return {
      userData,
    };
  },
};
</script>
