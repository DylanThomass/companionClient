import request from "@/utils/request";

/**
 * 获取用户信息
 * @param {string} openid - 用户 openid
 * @returns {Promise<Object>} 用户信息
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
 * 更新用户信息
 * @param {Object} data - 用户信息
 * @returns {Promise<Object>} 更新结果
 */
export function updateUserInfo(data) {
  return request({
    url: "/updateUser",
    method: "post",
    data,
  });
}
