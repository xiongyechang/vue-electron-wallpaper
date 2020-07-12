import Vue from "vue";
import VueRouter from "vue-router";
import routes from "../models/menu";

Vue.use(VueRouter);

const router = new VueRouter({
  history: "history",
  routes,
});

export default router;
