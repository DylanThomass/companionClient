import axios from "axios";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";
import router from "@/router";

// 不需要携带 token 的白名单
const NO_TOKEN_WHITELIST = [
  "/wx/config", // 微信配置接口
  "/wx/login", // 微信登录接口
  "/health", // 健康检查接口,
];

// 响应码
const ResponseCode = {
  SUCCESS: "0000",
  TOKEN_INVALID: "4010",
  NOT_FOUND: "4040",
  SERVER_ERROR: "5000",
};

// 添加图片服务器基础地址
export const IMAGE_BASE_URL =
  process.env.VUE_APP_IMAGE_SERVER_URL || "http://companion.cpolar.top";

// 创建 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 调试信息
    if (process.env.NODE_ENV === "development") {
      console.log("Request:", {
        url: config.url,
        fullUrl: `${config.baseURL}${config.url}`,
        method: config.method,
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
    }

    // 从 store 获取 token
    const userStore = useUserStore();
    const token = userStore.token;

    // 检查是否在白名单中
    const isInWhitelist = NO_TOKEN_WHITELIST.some((path) =>
      config.url.includes(path)
    );

    // 开发环境且使用 mock 数据时，不添加 token
    const useMock =
      process.env.NODE_ENV === "development" &&
      process.env.VUE_APP_USE_MOCK === "true";

    // 如果不在白名单中且有 token，则添加到请求头
    if (!isInWhitelist && token && !useMock) {
      config.headers["Authorization"] = token ? `Bearer ${token}` : "";
    }

    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 调试信息
    if (process.env.NODE_ENV === "development") {
      console.log("Response:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }

    const res = response.data;

    // 健康检查接口直接返回数据
    if (response.config.url === "/health") {
      return res;
    }

    // 这里处理后端统一的响应格式 { code, msg, data }
    if (res.code !== ResponseCode.SUCCESS) {
      showToast({
        message: res.msg || "请求失败",
        type: "fail",
      });

      // 处理特定错误码
      if (res.code === ResponseCode.TOKEN_INVALID) {
        const userStore = useUserStore();
        userStore.logout();
        router.replace({
          path: "/login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }

      return Promise.reject(new Error(res.msg || "请求失败"));
    }

    // 成功响应直接返回数据部分
    return res.data;
  },
  (error) => {
    // 网络错误特殊处理
    if (error.message === "Network Error") {
      console.error("网络连接失败，请检查网络设置或服务器状态");
      console.error("详细错误信息:", {
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        data: error.config.data,
        baseURL: error.config.baseURL,
      });
      showToast({
        message: "网络连接失败，请检查网络",
        type: "fail",
      });
    }

    // 网络错误处理
    let message;
    if (error.response) {
      message = error.response.data?.msg || `错误码: ${error.response.status}`;
    } else if (error.request) {
      message = "服务器无响应";
    } else {
      message = error.message;
    }

    showToast({
      message,
      type: "fail",
      duration: 3000,
    });

    // 401 错误处理
    if (error.response?.status === 401) {
      const userStore = useUserStore();
      userStore.logout();
      router.replace({
        path: "/login",
        query: { redirect: router.currentRoute.value.fullPath },
      });
    }

    return Promise.reject(error);
  }
);

export default service;
