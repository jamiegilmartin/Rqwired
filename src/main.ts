import { createApp } from "vue";
import { createPinia } from "pinia";

// element plus
import ElementPlus from "element-plus";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/display.css";
import "element-plus/theme-chalk/dark/css-vars.css";

import "./style.css";
import App from "./App.vue";

const app = createApp(App);
app.use(createPinia());
app.use(ElementPlus);
// add element plus icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
app.mount("#app");
