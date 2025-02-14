import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/modules/user";

// 路由配置
const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    meta: {
      title: "首页",
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: {
      title: "登录",
      requiresAuth: false,
    },
  },
  {
    path: "/wx-auth",
    name: "WxAuth",
    component: () => import("@/views/WxAuth.vue"),
    meta: {
      title: "微信授权",
      requiresAuth: false,
    },
  },
  {
    path: "/user",
    name: "User",
    component: () => import("@/views/UserInfo.vue"),
    meta: {
      title: "个人中心",
      requiresAuth: true,
    },
  },
  {
    path: "/user/edit",
    name: "UserEdit",
    component: () => import("@/views/UserEdit.vue"),
    meta: {
      title: "编辑资料",
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.VUE_APP_BASE_URL),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || process.env.VUE_APP_TITLE;

  const userStore = useUserStore();
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 调试信息
  console.log("路由守卫:", {
    to: to.path,
    requiresAuth,
    isLoggedIn: userStore.isLoggedIn,
    token: userStore.token,
    hasUserInfo: !!userStore.userInfo,
  });

  if (requiresAuth && !userStore.isLoggedIn) {
    // 需要登录但未登录，重定向到登录页
    if (to.name === "WxAuth" && to.query.state) {
      next();
      return;
    }

    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

// 全局后置守卫
router.afterEach((to, from) => {
  // 页面切换后滚动到顶部
  window.scrollTo(0, 0);
});

export default router;
