import Vue from "vue";
import VueRouter from "vue-router";
import Menu from "../models/menu";

// import { WallpaperTypeService } from "@/services";
// console.log(WallpaperTypeService, "11111111");

Vue.use(VueRouter);

const router = new VueRouter({
  history: "history",
  routes: Menu,
});

// WallpaperTypeService.list().then((r) => {
//   console.log(r);
//   if (r.status === 0) {
// router.addRoutes([
//   {
//     path: "/landscape",
//     name: "landscape",
//     icon: require("@/assets/img/landscape.png"),
//     description: "风景",
//     component: () =>
//       import(/* webpackChunkName: 'landscape.vue' */ "@/views/landscape.vue"),
//   },
// ]);
// }
// });

export default router;
