<template>
  <div class="my-account" v-if="loggedInUser">
    <h1>Welcome, {{ loggedInUser.email }}!</h1>
    <h3 v-if="userLevel">Level: {{ userLevel }}</h3>
    <h3 v-if="userTitle">{{ userTitle }}</h3>
    <h3 v-if="userXp">XP: {{ userXp }}</h3>
    <div v-if="userLevel">
      <div class="exp-bar-container">
        <div class="exp-bar" :style="{ width: expPercentage + '%' }"></div>
      </div>
      <p>{{ userXp }} / {{ nextLevelXp }} XP</p>
    </div>
    <div v-else>
      <div class="loading-spinner"></div>
    </div>

    <button @click="logOut">Log Out</button>
  </div>
  <div v-else>
    <div class="loading-spinner"></div>
  </div>
</template>

<script>
import { auth } from "@/firebase.js";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { computed, onMounted } from "vue";

export default {
  name: "MyAccount",
  props: {},

  setup() {
    const store = useStore();
    const router = useRouter();

    const loggedInUser = computed(() => store.getters.loggedInUser);
    onMounted(() => {
      store.dispatch("fetchUserData", loggedInUser.value?.uid);
    });

    const expPercentage = computed(() => {
      return (userXp.value / nextLevelXp.value) * 100;
    });

    const nextLevelXp = computed(() => {
      return userLevel.value * 100;
    });

    const logOut = async () => {
      try {
        await signOut(auth);
        router.push("/");
      } catch (e) {
        console.error(e);
      }
    };

    // Add these computed properties
    const userLevel = computed(() => loggedInUser.value?.level);
    const userTitle = computed(() => loggedInUser.value?.title);
    const userXp = computed(() => loggedInUser.value?.xp);

    return {
      logOut,
      loggedInUser,
      userLevel,
      userTitle,
      userXp,
      expPercentage,
      nextLevelXp,
    };
  },
};
</script>
<style scoped>
.my-account {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

button {
  background-color: #333;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

button:hover {
  background-color: rgb(223, 175, 18);
}

.exp-bar-container {
  width: 100%;
  height: 20px;
  background-color: #f3f3f3;
  border-radius: 5px;
}

.exp-bar {
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
  transition: width 0.5s ease;
}
</style>
