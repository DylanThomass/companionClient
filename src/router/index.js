import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/modules/user";

// 路由配置
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/TabbarLayout.vue"),
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: "",
        redirect: "/hall",
      },
      {
        path: "hall",
        name: "SellerHall",
        component: () => import("@/views/SellerHall.vue"),
        meta: {
          title: "店员大厅",
          requiresAuth: true,
        },
      },
      {
        path: "user",
        name: "User",
        component: () => import("@/views/UserInfo.vue"),
        meta: {
          title: "个人中心",
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: "/orders",
    name: "OrderList",
    component: () => import("@/views/OrderList.vue"),
    meta: {
      title: "订单管理",
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
    path: "/user/edit",
    name: "UserEdit",
    component: () => import("@/views/UserEdit.vue"),
    meta: {
      title: "编辑资料",
      requiresAuth: true,
    },
  },
  {
    path: "/tags-manage",
    name: "TagsManage",
    component: () => import("@/views/TagsManage.vue"),
    meta: {
      title: "个性标签",
      requiresAuth: true,
    },
  },
  {
    path: "/order/:id",
    name: "OrderDetail",
    component: () => import("@/views/OrderDetail.vue"),
    meta: {
      title: "订单详情",
      requiresAuth: true,
    },
  },
  {
    path: "/favorites",
    name: "FavoriteList",
    component: () => import("@/views/FavoriteList.vue"),
    meta: {
      title: "我的收藏",
      requiresAuth: true,
    },
  },
  {
    path: "/seller/:id",
    name: "SellerDetail",
    component: () => import("@/views/SellerDetail.vue"),
    meta: {
      title: "店员详情",
      requiresAuth: true,
    },
  },
  {
    path: "/seller/customize",
    name: "SellerCustomize",
    component: () => import("@/views/SellerCustomize.vue"),
    meta: {
      title: "装修主页",
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

  // 开发环境且配置跳过鉴权时，直接通过
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_SKIP_AUTH === "true"
  ) {
    next();
    return;
  }

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
