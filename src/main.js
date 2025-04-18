import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { createPinia } from "pinia";

const app = createApp(App);
const pinia = createPinia();

app.use(Vue3Toastify, {
  theme: "dark",
  type: "success",
  position: "top-center",
  transition: "flip",
  dangerouslyHTMLString: true,
  autoClose: 2000,
});
app.use(pinia);

app.mount("#app");
