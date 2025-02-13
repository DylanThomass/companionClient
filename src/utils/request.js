import axios from "axios";
import { showToast } from "vant";
import { useUserStore } from "@/store/modules/user";

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
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers["Authorization"] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  (error) => {
    console.error("请求错误：", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    console.log("Response interceptor:", {
      url: response.config.url,
      data: res,
    });

    // 健康检查接口直接返回数据
    if (response.config.url === "/health") {
      return res;
    }

    // 其他接口检查 code
    if (res.code !== 0) {
      showToast({
        message: res.message || "Error",
        type: "error",
        duration: 3000,
      });

      if (res.code === 401) {
        const userStore = useUserStore();
        userStore.logout();
      }
      return Promise.reject(new Error(res.message || "Error"));
    }

    return res.data;
  },
  (error) => {
    console.error("响应错误：", {
      error: {
        name: error.name,
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
      },
    });

    let message = "请求失败";
    if (error.response) {
      message =
        error.response.data?.message || `错误码: ${error.response.status}`;
    } else if (error.request) {
      message = "服务器无响应";
    } else {
      message = error.message;
    }

    showToast({
      message,
      type: "error",
      duration: 3000,
    });
    return Promise.reject(error);
  }
);

export default request;
