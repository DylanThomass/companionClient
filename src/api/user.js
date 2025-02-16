import request from "@/utils/request";

/**
 * 获取用户信息
 */
export function getUserInfo(openid) {
  console.log("获取用户信息，openid:", openid);
  return request({
    url: "/selectUser",
    method: "post",
    data: { openId: openid },
  });
}

/**
 * 账号密码登录
 * @param {Object} data - 登录参数
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 */
export function login(data) {
  return request({
    url: "/user/login",
    method: "post",
    data,
  });
}

/**
 * 退出登录
 */
export function logout() {
  return request({
    url: "/user/logout",
    method: "post",
  });
}
