import request from "@/utils/request";

// 用户相关接口
export function wxLogin(code) {
  return request({
    url: "/wx/login",
    method: "post",
    data: { code },
  });
}

export function getUserInfo() {
  return request({
    url: "/user/info",
    method: "get",
  });
}

export function logout() {
  return request({
    url: "/user/logout",
    method: "post",
  });
}

export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

// 微信授权登录
export function wxAuth(data) {
  return request({
    url: "/wx/auth",
    method: "post",
    data,
  });
}
