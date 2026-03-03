import "virtual:svg-icons-register";
import "uno.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import "normalize.css";
import "./styles/main.scss";
createApp(App).use(createPinia()).use(router).mount("#app");
