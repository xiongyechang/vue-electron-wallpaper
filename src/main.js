import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import ElementUI from "element-ui";

import "./assets/iconfont/iconfont.css";
import "./assets/icon/iconfont.css";
import "element-ui/lib/theme-chalk/index.css";
// import "./element-variables.scss";
// import "@/utils/update";

Vue.use(ElementUI, { size: "mini", zIndex: 3000 });

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount("#app");
