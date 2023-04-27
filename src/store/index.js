import { createStore } from "vuex";
import { db } from "@/firebase.js";
import { collection, doc, getDoc } from "firebase/firestore";

export default createStore({
    state: {
      loggedInUser: null,
    },
    mutations: {
      // Define your mutations here
      setLoggedInUser(state, user) {
        state.loggedInUser = user;
      }
    },
    actions: {
      async fetchUserData({ commit }, userId) {
        try {
          const userDoc = await getDoc(doc(collection(db, "users"), userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            commit("setLoggedInUser", userData);
          } else {
            console.error("No user data found for the given user ID");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      },
    },
    getters: {
      // Define your getters here
      loggedInUser: (state) => state.loggedInUser,
    },
  });