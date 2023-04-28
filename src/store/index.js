import { createStore } from "vuex";
import { db } from "@/firebase.js";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";

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

      updateUserLevel(state, level) {
        state.loggedInUser.level = level;
      }
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

      async updateUserXp({ commit, state }, xp) {
        if (state.loggedInUser) {
          const userId = state.loggedInUser.uid;
          const userRef = doc(collection(db, "users"), userId);
          const newXP = state.loggedInUser.xp + xp; // Add the XP earned to the user's current XP
          await updateDoc(userRef, { xp: newXP }); // Update the XP value in the Firestore
      
          commit("updateUserXp", newXP); // Commit the new XP value
        }
      },

      async updateUserLevel({ commit, state}, level) {
        if (state.loggedInUser) {
          const userId = state.loggedInUser.uid;
          const userRef = doc(collection(db, "users"), userId);
          const newLevel = state.loggedInUser.level + level;
          await updateDoc(userRef, { level: newLevel });

          commit("updateUserLevel", newLevel);
        }
      }
    },
    getters: {
      // Define your getters here
      loggedInUser: (state) => state.loggedInUser,
    },
  });