import { createStore } from "vuex";
import { db } from "@/firebase.js";
import { collection, doc, getDoc } from "firebase/firestore";
import { auth } from "@/firebase.js";
import { updateDoc } from "firebase/firestore";

export default createStore({
  state: {
    loggedInUser: null,
    authObserver: null,
  },
  mutations: {
    setUserData(state, { title, xp }) {
      state.loggedInUser = { title, xp };
    },
  },
  actions: {
    async updateUserData({ getters }, dataToUpdate) {
      const userId = getters.loggedInUser.uid;
      const userRef = doc(collection(db, "users"), userId);
      try {
        await updateDoc(userRef, dataToUpdate);
        console.log("User data updated successfully");
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    },
    async updateUserXP({ state, commit }, xpGained) {
      if (state.loggedInUser) {
        const userDocRef = doc(collection(db, "users"), state.loggedInUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const updatedXP = userData.xp + xpGained;
            await updateDoc(userDocRef, { xp: updatedXP });
            commit("setLoggedInUser", { title: userData.title, xp: updatedXP });
            console.log("User XP updated successfully");
          } else {
            console.error("User document not found");
          }
        } catch (error) {
          console.error("Error updating user XP:", error);
        }
      }
    },
    async fetchUserData({ commit }, userId) {
      if (!userId) {
        console.error("fetchUserData: userId is required");
        return;
      }
    
      const userRef = doc(collection(db, "users"), userId);
      const snapshot = await getDoc(userRef);
      const userData = snapshot.data();
      console.log("userData:", userData);
    
      commit("setUserData", userData);
    },
    initAuthObserver({ state, commit, dispatch }) {
      if (!state.authObserver) {
        state.authObserver = auth.onAuthStateChanged(async (user) => {
          if (user) {
            await dispatch("fetchUserData", user.uid);
          } else {
            commit("setUserData", null);
          }
        });
      }
    },
  },
  getters: {
    loggedInUser: (state) => state.loggedInUser,
  },
});
