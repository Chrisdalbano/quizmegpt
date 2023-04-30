<template>
  <div class="my-account" v-if="loggedInUser">
    <h2>Welcome, {{ loggedInUser.email }}!</h2>
    <h3 v-if="userTitle !== null">{{ userTitle }}</h3>
    <div v-if="userLevel !== null">
      <!-- <div class="exp-bar-container">
        <div class="exp-bar" :style="{ width: expPercentage + '%' }"></div>
      </div> -->
      <h3>Your Quiz Score is:</h3>
      <p>{{ userXp }} points</p>
      <div class="quiz-history">
    <h2>Quiz History</h2>
    <div v-for="(quiz, index) in quizHistoryData" :key="index" class="quiz-history-item">
      <h3>Quiz {{ index + 1 }}</h3>
      <p>Score: {{ quiz.score }} / {{ quiz.questions.length }}</p>
      <ul>
        <li v-for="(question, qIndex) in quiz.questions" :key="qIndex" class="question-info">
          <p><strong>Question:</strong> {{ question.question }}</p>
        </li>
      </ul>
    </div>
  </div>
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
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
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
    const quizHistoryData = ref([]);

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

    const fetchQuizHistory = async () => {
      if (loggedInUser.value) {
        const userId = loggedInUser.value.uid;
        const quizHistoryRef = collection(db, "quizHistory");
        const querySnapshot = await getDocs(
          query(
            quizHistoryRef,
            where("userId", "==", userId),
            orderBy("timestamp", "desc")
          )
        );
        quizHistoryData.value = querySnapshot.docs.map((doc) => doc.data());
      }
    };

    watch(loggedInUser, () => {
      fetchUserData();
      fetchQuizHistory();
    });

    onMounted(async () => {
      await fetchUserData();
      await fetchQuizHistory();
    });

    return {
      logOut,
      loggedInUser,
      isLoading,
      userLevel: computed(() => userLevel.value),
      userTitle: computed(() => userTitle.value),
      userXp: computed(() => userXp.value),
      expPercentage: computed(() => expPercentage.value),
      nextLevelXp: computed(() => nextLevelXp.value),
      quizHistoryData: computed(() => quizHistoryData.value),
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

.quiz-history {
  margin-top: 1rem;
}

.quiz-history-item {
  background-color: #f0f0f0;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 5px;
}

.question-info {
  padding: 0.5rem 0;
}

.question-info:not(:last-child) {
  border-bottom: 1px solid #ccc;
}
</style>
