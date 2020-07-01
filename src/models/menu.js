const router = [
  {
    path: "/",
    name: "all",
    icon: require("@/assets/img/all.png"),
    description: "全部",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/landscape",
    name: "landscape",
    icon: require("@/assets/img/landscape.png"),
    description: "风景",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/city",
    name: "city",
    icon: require("@/assets/img/city.png"),
    description: "城市",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/beauty",
    name: "beauty",
    icon: require("@/assets/img/beauty.png"),
    description: "美女",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/car",
    name: "car",
    icon: require("@/assets/img/car.png"),
    description: "跑车",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/universe",
    name: "universe",
    icon: require("@/assets/img/universe.png"),
    description: "宇宙",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/cartoon",
    name: "cartoon",
    icon: require("@/assets/img/cartoon.png"),
    description: "卡通",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/movie",
    name: "movie",
    icon: require("@/assets/img/movie.png"),
    description: "影视",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
  {
    path: "/game",
    name: "game",
    icon: require("@/assets/img/game.png"),
    description: "游戏",
    component: () =>
      import(/* webpackChunkName: 'index.vue' */ "@/views/index.vue"),
  },
];

router.forEach((r) => {
  r.props = (route) => ({ keyword: route.query.keyword });
  if (r.description !== "全部") {
    r.keyword = r.description;
  }
});

export default router;
