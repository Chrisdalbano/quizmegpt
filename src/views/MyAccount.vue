<template>
  <div v-if="!isLoading" class="my-account">
    <div class="my-account" v-if="loggedInUser">
      <div class="top-wrap">
        <h3 class="user-display">{{ loggedInUser.email }}</h3>
        <button @click="logOut" class="logout-bt">Log Out</button>
      </div>

      <p class="greeting-msg"></p>

      <h3 v-if="userTitle" class="user-tag">{{ userTitle }}</h3>
      <div v-if="userLevel !== null" class="user-score">
        <p><b>Your Quiz Score is</b></p>
        <p class="user-points">{{ userXp }}</p>
      </div>
      <img
        class="illustration-bookshelf"
        v-if="!quizGenerated"
        src="../assets/bookshelf-ill.png"
      />
      <div v-else>
        <div class="loading-spinner"></div>
      </div>
      <div class="quiz-history">
        <button class="history-bt" @click="toggleQuizHistory">
          <span v-if="isQuizHistoryOpen">Past quizzes ↑</span>
          <span v-else>Past quizzes ↓</span>
        </button>
        <div v-if="!isQuizHistoryOpen">
          <transition-group name="quiz-history-item-transition" tag="div">
            <div
              v-for="(quiz, index) in quizHistoryData"
              :key="quiz.id"
              class="quiz-history-item"
            >
              <div class="quiz-header">
                <h3>Quiz {{ index + 1 }}</h3>
                <p>
                  Your score: {{ quiz.score }} / {{ quiz.questions.length }}
                </p>
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
              <button @click="deleteQuiz(quiz.id)">Delete Quiz</button>
            </div>
          </transition-group>
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
import { deleteDoc } from "firebase/firestore";

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

    const deleteQuiz = async (quizId) => {
      if (!quizId) {
        console.error("QuizId is undefined");
        return;
      }

      try {
        const quizRef = doc(db, "quizHistory", quizId);
        await deleteDoc(quizRef);
        // After the quiz is deleted, fetch the updated quiz history.
        await fetchQuizHistory();
      } catch (error) {
        console.error("Error deleting document: ", error);
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
        quizHistoryData.value = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id, // Add this line to store the id
        }));
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
      deleteQuiz,
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
  background-color: #ffe3b3;
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

.logout-bt:hover {
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
.top-wrap {
  display: flex;
  justify-content: space-between; /* This will keep the items at the opposite ends of the container */
  align-items: center;
}

.user-display,
.logout-bt {
  /* The flex property is a shorthand property for flex-grow, flex-shrink, and flex-basis */
  flex: 1 0 auto;
}

/* Media query */
@media screen and (max-width: 600px) {
  .top-wrap {
    flex-direction: column;
  }

  .user-display,
  .logout-bt {
    flex: none;
  }
}

.user-display {
  color: rgb(43, 43, 43);
  padding: 0.5rem 1rem;
  border: solid 5px #ffc973;
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

.loading-spinner {
  display: flex;
  width: 80px;
  height: 80px;
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #ffc973;
  animation: spin 0.7s linear infinite;
  margin: 300px auto;
}

.loading-spinner {
  display: flex;
  width: 80px;
  height: 80px;
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid #ffc973;
  animation: spin 0.7s linear infinite;
  margin: 300px auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media only screen and (max-width: 600px) {
  .logout-bt {
    min-width: 60px;
    font-size: 1rem;
    padding: 0.4rem 0.8rem;
  }
}

@media only screen and (max-width: 400px) {
  .logout-bt {
    min-width: 50px;
    font-size: 0.6rem;
    padding: 0.3rem 0.6rem;
  }
}

.quiz-history-item-transition-enter-active,
.quiz-history-item-transition-leave-active {
  transition: all 0.5s ease;
}

.quiz-history-item-transition-enter,
.quiz-history-item-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
