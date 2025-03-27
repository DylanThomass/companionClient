import request from "@/utils/request";
import {
  MOCK_USER,
  MOCK_USER_VIP_INFO,
  MOCK_USER_OTHER_INFO,
  MOCK_USER_STATS,
  createMockResponse,
  mockDelay,
} from "@/mock";

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const getUserInfo = async () => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse(MOCK_USER);
  }

  return request({
    url: "/selectUser",
    method: "post",
  });
};

/**
 * 获取vip信息
 * @returns {Promise<Object>} vip信息
 */
export const getVipInfo = async () => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse(MOCK_USER_VIP_INFO);
  }

  return request({
    url: "/selectVipInfo",
    method: "post",
  });
};

/**
 * 获取其他信息
 * @returns {Promise<Object>} 其他信息
 */
export const getOtherInfo = async () => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse(MOCK_USER_OTHER_INFO);
  }
  return request({
    url: "/selectOtherInfo",
    method: "post",
  });
};

/**
 * 更新用户头像
 * @param {Object} params - 用户信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserAvatar = async (params) => {
  return request({
    url: "/updateUserAvatar",
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: params,
  });
};

/**
 * 更新用户信息
 * @param {Object} params - 用户信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserInfo = async (params) => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse({
      code: "0000",
      message: "success",
      data: {
        avatarUrl: params.avatar
          ? "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          : undefined,
      },
    });
  }

  return request({
    url: "/updateUser",
    method: "post",
    data: params,
  });
};

// 获取用户统计数据
export const getUserStats = async () => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse(MOCK_USER_STATS);
  }

  return request({
    url: "/selectUserStats",
    method: "post",
  });
};
