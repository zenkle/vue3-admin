import "virtual:svg-icons-register";
import "uno.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import 'normalize.css' 

createApp(App).use(createPinia()).mount("#app");
