import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
const Layout = () => import("@/layouts/index.vue");
const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
    meta: {
      title: "登录",
    },
  },
  {
    path: "/",
    name: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/vue3/reactivity/watch.vue"),
        meta: {
          title: "dashboard",
        },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior() {
    return { left: 0, top: 0 };
  },
});

export function resetRouter() {
  router.replace({ path: "/login" });
}

export default router;
