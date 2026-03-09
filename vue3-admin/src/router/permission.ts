import type { Router } from "vue-router";

const whiteList = ["/login"];

export function routerPermission(router: Router) {
  router.beforeEach((to, _form, next) => {
    const isLoggedIn = localStorage.getItem("ACCESS_TOKEN");
    if (!isLoggedIn) {
      if (whiteList.includes(to.path)) {
        next();
      } else {
        next({ name: "login" });
      }
    }

    if (to.matched.length === 0) {
      next({ name: "404" });
    }

    next();
  });
}
