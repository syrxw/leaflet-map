import { createApp } from "vue";

// Element-Plus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "./styles/index.scss"; // 框架基础

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);

app.mount("#app");
