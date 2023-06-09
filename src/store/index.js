import { createStore } from "vuex";
import { db } from "@/firebase.js";
import { collection, doc, getDoc, updateDoc, addDoc } from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

export default createStore({
  state: {
    loggedInUser: null,
  },
  mutations: {
    // Define your mutations here
    setLoggedInUser(state, user) {
      state.loggedInUser = user;
    },

    updateUserXp(state, xp) {
      state.loggedInUser.xp = xp;
    },

    updateUserTitle(state, title) {
      state.loggedInUser.title = title;
    },
  },
  actions: {
    async fetchUserData({ commit }, userId) {
      try {
        const userDoc = await getDoc(doc(collection(db, "users"), userId));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          userData.uid = userId; // Add the user's uid to the userData object
          commit("setLoggedInUser", userData);
        } else {
          console.error("No user data found for the given user ID");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    },

    async updateUserXp({ commit, dispatch, state }, xp) {
      if (state.loggedInUser) {
        const userId = state.loggedInUser.uid;
        const userRef = doc(collection(db, "users"), userId);
        const newXP = state.loggedInUser.xp + xp;
        await updateDoc(userRef, { xp: newXP });

        commit("updateUserXp", newXP);
        dispatch("updateUserTitle", newXP); // Pass the newXP value to the updateUserTitle action
      }
    },

    async updateUserTitle({ commit, state }, newXP) {
      if (state.loggedInUser) {
        const userId = state.loggedInUser.uid;
        const userRef = doc(collection(db, "users"), userId);
        const currentXp = newXP || state.loggedInUser.xp; // Use the newXP value if provided

        let newTitle = state.loggedInUser.title;

        if (currentXp >= 250) {
          newTitle = "PRO Quizzer";
        } else if (currentXp >= 100) {
          newTitle = "Amateur Quizzer";
        }

        if (newTitle !== state.loggedInUser.title) {
          await updateDoc(userRef, { title: newTitle });
          commit("updateUserTitle", newTitle); // Use the new mutation
        }
      }
    },
    async saveQuizToHistory(
      { state },
      { score, xpEarned, questions }
    ) {
      if (state.loggedInUser) {
        const userId = state.loggedInUser.uid;
        const quizHistoryRef = collection(db, "quizHistory");

        const quizData = questions.map((question) => {
          const correctAnswer = question.options.find(
            (option) => option.value === question.correctAnswer
          ).text;
          return {
            question: question.question,
            correctAnswer: correctAnswer,
          };
        });

        const quizHistoryData = {
          userId,
          score,
          xpEarned,
          questions: quizData,
          timestamp: serverTimestamp(),
        };

        await addDoc(quizHistoryRef, quizHistoryData);
      }
    },
  },
  getters: {
    // Define your getters here
    loggedInUser: (state) => state.loggedInUser,
  },
});
