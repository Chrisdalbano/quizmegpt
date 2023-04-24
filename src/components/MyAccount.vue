<template>
    <div class="my-account" v-if="loggedInUser">
      <h1>Welcome, {{ loggedInUser.email }}!</h1>
      <button @click="logOut">Log Out</button>
    </div>
    <div v-else>
        <div class="loading-spinner"></div>
    </div>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  import { auth } from "@/firebase.js";
  import { signOut } from "firebase/auth";
  
  export default {
    name: "MyAccount",
    props: {
      loggedInUser: Object,
    },
    setup(_, { emit }) {
      const router = useRouter();
  
      const logOut = async () => {
        try {
          await signOut(auth);
          router.push("/login");
          emit("loggedInUserChanged", null);
        } catch (e) {
          console.error(e);
        }
      };
  
      return {
        logOut,
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
</style>
