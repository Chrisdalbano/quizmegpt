<template>
  <div class="my-account" v-if="loggedInUser">
    <h2>Welcome, {{ loggedInUser.email }}!</h2>
    <h3 v-if="userLevel !== null">Level: {{ userLevel }}</h3>
    <h3 v-if="userTitle !== null">{{ userTitle }}</h3>
    <div v-if="userLevel !== null">
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
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase.js";
import { auth } from "@/firebase.js";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, computed, watch, onMounted } from "vue";

export default {
  name: "MyAccount",
  props: {},

  setup(_, { emit }) {
    const store = useStore();
    const router = useRouter();
    const userLevel = ref(null);
    const userTitle = ref(null);
    const userXp = ref(null);
    const isLoading = ref(true);

    const loggedInUser = computed(() => store.getters.loggedInUser);

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
    emit("loggedInUserChanged", null); // Add this line
  } catch (e) {
    console.error(e);
  }
};
    const fetchUserData = async () => {
      if (loggedInUser.value) {
        const userRef = doc(db, "users", loggedInUser.value.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          userLevel.value = userData.level;
          userTitle.value = userData.title;
          userXp.value = userData.xp;
          isLoading.value = false;
        }
      }
    };

    watch(loggedInUser, () => {
      fetchUserData();
    });

    onMounted(fetchUserData); // Call fetchUserData when the component is mounted

    return {
      logOut,
      loggedInUser,
      isLoading,
      userLevel: computed(() => userLevel.value),
      userTitle: computed(() => userTitle.value),
      userXp: computed(() => userXp.value),
      expPercentage: computed(() => expPercentage.value),
      nextLevelXp: computed(() => nextLevelXp.value),
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
