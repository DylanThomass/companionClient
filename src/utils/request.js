import axios from "axios";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";
import router from "@/router";

// 响应码
const ResponseCode = {
  SUCCESS: "0000",
  TOKEN_INVALID: "4010",
  NOT_FOUND: "4040",
  SERVER_ERROR: "5000",
};

// 创建 axios 实例
const request = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 调试信息
    if (process.env.NODE_ENV === "development") {
      console.log("Request:", {
        url: config.url,
        method: config.method,
        data: config.data,
        params: config.params,
      });
    }

    const userStore = useUserStore();
    if (userStore.token) {
      config.headers["Authorization"] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
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
    // 网络错误处理
    let message = "请求失败";
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

export default request;
