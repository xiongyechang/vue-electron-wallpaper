import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "首页",
    },
    component: () => import( /* webpackChunkName: 'home.vue' */ "@/views/home.vue"),
    props: (route:any) => ({
      type: route.query.type
    }),
  },
  {
    path: "/about",
    name: "about",
    meta: {
      title: "关于",
    },
    component: () => import(/* webpackChunkName: 'about.vue' */ "@/views/about.vue"),
    props: (route:any) => ({
      type: route.query.type
    }),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router
