<template>
  <div class="background">
    <div class="ball" style="top: 50px; left: 100px"></div>
    <div class="ball-b" style="top: 400px; left: 200px"></div>
    <div class="ball-b" style="top: 540px; left: 700px"></div>
    <div class="ball-b" style="top: 290px; left: 1100px"></div>
    <div class="ball" style="top: 750px; left: 900px"></div>
    <div class="ball-b" style="top: 500px; left: 1400px"></div>

    <img class="logo-acc" src="../assets/quizmegpt-logo.png" />
    <div class="container">
      <div class="form-container">
        <h2 v-if="isLoginForm">LOG IN</h2>
        <h2 v-else>SIGN UP</h2>
        <form @submit.prevent="isLoginForm ? logIn() : signUp()">
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" v-model="email" />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" v-model="password" />
          </div>
          <div class="form-group" v-if="!isLoginForm">
            <label for="passwordConfirmation">Confirm Password:</label>
            <input
              type="password"
              id="passwordConfirmation"
              v-model="passwordConfirmation"
            />
          </div>
          <button class="submit-button" type="submit">
            {{ isLoginForm ? "Log In" : "Create account" }}
          </button>
        </form>
        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="successMessage" class="success">{{ successMessage }}</p>
        <p v-if="accountCreated" class="account-created">
          Account successfully created, go to log in to access your account.
        </p>
        <button @click="toggleForm" class="toggle-button">
          {{
            isLoginForm
              ? "Don't have an account? Sign Up"
              : "Already have an account? Log In"
          }}
        </button>
        <div v-if="loading" class="loading">Loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase.js"; // assuming you've exported Firestore instance as 'db' in firebase.js
import { ref } from "vue";
import { auth } from "@/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  setup() {
    const accountCreated = ref(false);
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const passwordConfirmation = ref("");
    const error = ref("");
    const isLoginForm = ref(true);
    const successMessage = ref("");
    const store = useStore();
    const loading = ref(false);

    const logIn = async () => {
      loading.value = true;
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        error.value = "";
        const user = auth.currentUser;
        if (user) {
          await store.dispatch("fetchUserData", user.uid);
        }
        router.push({ name: "MyAccount" }); // Redirect to MyAccount page after successful login
      } catch (e) {
        error.value = e.message;
      } finally {
        loading.value = false;
      }
    };

    const signUp = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );

        // Set initial user data in Firestore
        const userData = {
          email: email.value,
          level: 1,
          xp: 0,
          title: "Newbie Quizzer",
        };
        await setDoc(
          doc(collection(db, "users"), userCredential.user.uid),
          userData
        );

        await store.dispatch("fetchUserData", userCredential.user.uid);

        successMessage.value = "Account created successfully!";
        accountCreated.value = true;
        error.value = "";
        router.push({ name: "MyAccount" });
      } catch (e) {
        error.value = e.message;
      }
    };

    const toggleForm = () => {
      isLoginForm.value = !isLoginForm.value;
      error.value = ""; // Reset the error message when toggling forms
      accountCreated.value = false; // Reset the accountCreated flag when toggling forms
    };

    return {
      email,
      password,
      passwordConfirmation,
      error,
      successMessage,
      logIn,
      signUp,
      isLoginForm,
      toggleForm,
      accountCreated,
    };
  },
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90vh;
  padding: 0;
}

.form-container {
  width: 400px;
  height: 450px;
  background-color: #ffc973;
  padding: 2rem;
  border-radius: 41px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
}

h2 {
  margin-bottom: 1.5rem;
  box-shadow: inset 0 -2px 0 #ffe3b3;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

label {
  margin-bottom: 0.5rem;
}

input {
  box-shadow: 0 -4px 0 #ffe3b3;
  border: none;
  padding: 0.7rem;
  font-size: 1rem;
  border-radius: 41px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: medium;
}

input:focus {
  outline: none;
}

.submit-button {
  width: 250px;
  margin-left: 8px;
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  background-color: #30a0e0;
  color: #ffffff;
  border: none;
  border-radius: 41px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  box-shadow: inset 0 -2px 0 #267aaa;
}

.submit-button:hover {
  background-color: #267aaa;
}

.submit-button:focus {
  outline: none;
  transform: scale(0.95);
  transition: all 0.3s ease-in-out;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.toggle-button {
  background-color: transparent;
  color: black;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
}

.toggle-button:hover {
  color: #267aaa;
}

.success {
  color: green;
  font-weight: bold;
}
.logo-acc {
  display: block;
  margin: auto;
  width: 70px;
  height: 79px;
}

.ball {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: #30a0e0;
  opacity: 0.3;
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
}

.ball-b {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background-color: #ffc973;
  opacity: 0.4;
  border-radius: 50%;
  animation: float 3s infinite ease-in-out;
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
