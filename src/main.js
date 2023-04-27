import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store"; // Change the import here to match the default export

createApp(App).use(router).use(store).mount("#app"); // Use the store here