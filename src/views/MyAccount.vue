<template>
  <div class="my-account" v-if="loggedInUser">
    <div class="top-wrap">
      <h3 class="user-display">{{ loggedInUser.email }}</h3>
      <button @click="logOut" class="logout-bt">Log Out</button>
      
    </div>

    <p class="greeting-msg"></p>
    <h3 v-if="userTitle" class="user-tag">{{ userTitle }}</h3>
    <div v-if="userLevel !== null" class="user-score">
      <p><b>Your Quiz Score is</b></p>
      <p class="user-points">{{ userXp }} </p>
    </div>
    <img class="illustration-bookshelf" v-if="!quizGenerated" src="../assets/bookshelf-ill.png" />
    <div v-else>
      <div class="loading-spinner"></div>
    </div>
    <div class="quiz-history">
      <button class="history-bt" @click="toggleQuizHistory">
        <span v-if="!isQuizHistoryOpen">Past quizzes ↓</span>
        <span v-else>Past quizzes ↑</span>
      </button>
      <div v-if="!isQuizHistoryOpen">
        <div
          v-for="(quiz, index) in quizHistoryData"
          :key="index"
          class="quiz-history-item"
        >
          <div class="quiz-header">
            <h3>Quiz {{ index + 1 }}</h3>
            <p>Your score: {{ quiz.score }} / {{ quiz.questions.length }}</p>
          </div>
          <div class="quiz-questions">
            <div
              v-for="(question, qIndex) in quiz.questions"
              :key="qIndex"
              class="question-info"
            >
              <p>Question {{ question.question }}</p>
              <p><strong>Answer:</strong> {{ question.correctAnswer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    const isQuizHistoryOpen = ref(false);
    const showQuizHistory = ref(false);

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

    const toggleQuizHistory = () => {
      isQuizHistoryOpen.value = !isQuizHistoryOpen.value;
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
      isQuizHistoryOpen: computed(() => isQuizHistoryOpen.value),
      toggleQuizHistory,
      showQuizHistory,
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
  background-color: #FFE3B3;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 40.09px;
}

.question-info {
  padding: 0.5rem 0;
}

.question-info:not(:last-child) {
  border-bottom: 1px solid #ccc;
}

.logout-bt {
  background-color: #f64c4c;
  margin: 20px;
  max-height: 40px;
  min-width: 15px;
}

.logout-bt:hover{
  background-color: #ff7979;
}
.user-tag {
  padding: 10px;
  background-color: #ffc973;
  border-radius: 41px;
  padding-top: 20px;
  padding-bottom: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.user-score {
  padding: 10px;
  background-color: #ffc973;
  border-radius: 41px;
  padding-top: 10px;
  padding-bottom: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.user-points {
  padding: 0;
  margin: 0;
  font-size: 60px;
  font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
  color: white;
  -webkit-text-stroke: 2px #000000;
}

.history-bt {
  background: none;
  color: black;
  font-weight: bold;
  display: block;
}

.top-wrap {
  display: inline-flex;
}

.user-display {
  
  color: rgb(43, 43, 43);
  padding: 0.5rem 1rem;
  border: solid 5px #FFC973;
  border-radius: 41px;
  font-size: 1rem;
  margin-top: 1rem;
}

.illustration-bookshelf {
  padding: 0;
  margin: 0;
  width: 30%;
  height: 30%;
}
</style>
