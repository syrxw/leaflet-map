import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404Page.vue"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error/401Page.vue"),
    hidden: true,
  },
  {
    path: "",
    // component: Layout,
    redirect: "/index",
    children: [
      {
        path: "/index",
        component: () => import("@/views/index.vue"),
        name: "index",
        meta: { title: "首页", icon: "dashboard", affix: true },
      },
      {
        path: "/map/index",
        component: () => import("@/views/map/index.vue"),
        name: "mapIndex",
        meta: { title: "基础地图", icon: "dashboard", affix: true },
      },
      {
        path: "/map/toggleLayer",
        component: () => import("@/views/map/toggleLayer.vue"),
        name: "mapToggle",
        meta: { title: "自带底图切换", icon: "dashboard", affix: true },
      },
      {
        path: "/plugins/mask",
        component: () => import("@/views/plugins/mask.vue"),
        name: "pluginsMask",
        meta: { title: "遮罩地图", icon: "dashboard", affix: true },
      },
      {
        path: "/plugins/contextmenu",
        component: () => import("@/views/plugins/contextmenu.vue"),
        name: "pluginsContextmenu",
        meta: { title: "右键菜单", icon: "dashboard", affix: true },
      },
      {
        path: "/service/localSearch",
        component: () => import("@/views/service/localSearch.vue"),
        name: "serviceLocalSearch",
        meta: { title: "poi搜索", icon: "dashboard", affix: true },
      },
      {
        path: "/service/getLocationByIp",
        component: () => import("@/views/service/getLocationByIp.vue"),
        name: "serviceGetLocationByIp",
        meta: { title: "ip定位", icon: "dashboard", affix: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
