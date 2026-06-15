import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router/router.js";
import { useAppStore } from "./stores/useAppStore.js";
import "remixicon/fonts/remixicon.css";
import "./assets/style.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const appStore = useAppStore(pinia);
appStore.initializeDomainConfig();

app.mount("#app");
