import request from "@/utils/request";

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export function getUserInfo() {
  return request({
    url: "/selectUser",
    method: "post",
  });
}

/**
 * 获取vip信息
 * @returns {Promise<Object>} vip信息
 */
export function getVipInfo() {
  return request({
    url: "/selectVipInfo",
    method: "post",
  });
}

/**
 * 获取其他信息
 * @returns {Promise<Object>} 其他信息
 */
export function getOtherInfo() {
  return request({
    url: "/selectOtherInfo",
    method: "post",
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
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
}
