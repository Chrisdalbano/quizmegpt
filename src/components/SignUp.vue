<template>
    <div>
      <h2>Sign Up</h2>
      <form @submit.prevent="signUp">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" />
        </div>
        <div>
          <label for="password">Create new Password:</label>
          <input type="password" id="password" v-model="password" />
        </div>
        <div>
          <label for="passwordConfirmation">Confirm Password:</label>
          <input type="password" id="passwordConfirmation" v-model="passwordConfirmation" />
        </div>
        <p v-if="passwordMismatch" class="error">Passwords do not match</p>
        <button type="submit" :disabled="!isFormValid">Sign Up</button>
      </form>
      <p v-if="error">{{ error }}</p>
      <p v-if="success">Successfully signed up!</p>
    </div>
  </template>
  
  <script>
  import { ref, computed } from "vue";
  import { auth } from "@/firebase.js";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  
  export default {
    setup() {
      const email = ref("");
      const password = ref("");
      const passwordConfirmation = ref("");
      const error = ref("");
      const success = ref(false);
  
      const signUp = async () => {
        if (isFormValid.value) {
          try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
            success.value = true;
            error.value = "";
          } catch (e) {
            error.value = e.message;
          }
        }
      };
  
      const passwordMismatch = computed(() => {
        return password.value !== passwordConfirmation.value;
      });
  
      const isFormValid = computed(() => {
        return (
          email.value &&
          password.value &&
          passwordConfirmation.value &&
          !passwordMismatch.value
        );
      });
  
      return {
        email,
        password,
        passwordConfirmation,
        error,
        success,
        signUp,
        passwordMismatch,
        isFormValid,
      };
    },
  };
  </script>
  
  <style scoped>
  .error {
    color: red;
  }
  </style>