import "virtual:svg-icons-register";
import "uno.css";
import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";
import "normalize.css";
import "./styles/main.scss";
import { routerPermission } from "./router/permission";
import plugin from "./views/vue3/plugin";
import { createMiniPinia } from './views/vue3/mini-pinia/index';

const app = createApp(App);
app.use(createPinia());
app.use(plugin);
app.use(router);
app.use(createMiniPinia());
routerPermission(router);
app.mount("#app");
