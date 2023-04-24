<template>
  <div class="container">
    <div class="form-container">
      <h2 v-if="isLoginForm">Log in</h2>
      <h2 v-else>Sign Up</h2>
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
</template>

<script>
import { ref } from "vue";
import { auth } from "@/firebase.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  setup(props, { emit }) {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const passwordConfirmation = ref("");
    const error = ref("");
    const isLoginForm = ref(true);
    const successMessage = ref("");
    const loggedInUser = ref(props.loggedInUser);

    onAuthStateChanged(auth, (user) => {
      loggedInUser.value = user;
      emit("loggedInUserChanged", user);
    });

    const logOut = async () => {
      try {
        await signOut(auth);
        successMessage.value = "";
        error.value = "";
        emit("loggedInUserChanged", null);
        router.push({ name: "LogIn" }); // Redirect to LogIn page after logging out
      } catch (e) {
        error.value = e.message;
      }
    };

    const logIn = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        error.value = "";
        const user = auth.currentUser;
        emit("loggedInUserChanged", user); // emit the loggedInUserChanged event with the user object
        router.push({ name: "MyAccount" }); // Redirect to MyAccount page after successful login
      } catch (e) {
        error.value = e.message;
      }
    };

    const signUp = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email.value,
          password.value
        );
        loggedInUser.value = userCredential.user;
        successMessage.value = "Account created successfully!";
        error.value = "";
        router.push({ name: "MyAccount" }); // Redirect to MyAccount page after successful sign-up
      } catch (e) {
        error.value = e.message;
      }
    };

    const toggleForm = () => {
      isLoginForm.value = !isLoginForm.value;
      error.value = ""; // Reset the error message when toggling forms
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
      loggedInUser,
      logOut,
    };
  },
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  width: 400px;
  height: 500px;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 1.5rem;
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
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  margin-left: 8px;
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 12px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.submit-button:hover {
  background-color: #0265cf;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.toggle-button {
  background-color: transparent;
  color: #007bff;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
}

.toggle-button:hover {
  color: #0063cc;
}

.success {
  color: green;
  font-weight: bold;
}
</style>
