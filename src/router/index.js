import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/modules/user";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/UserInfo.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/wx-auth",
    name: "WxAuth",
    component: () => import("@/views/WxAuth.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 添加调试日志
  console.log("路由守卫:", {
    to: to.path,
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    hasToken: !!userStore.token,
  });

  // 如果是 wx-auth 路由，直接放行
  if (to.name === "WxAuth") {
    next();
    return;
  }

  // 需要登录但没有 token
  if (to.meta.requiresAuth && !userStore.token) {
    next({
      name: "Login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
