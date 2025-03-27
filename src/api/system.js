import request from "@/utils/request";
import {
  MOCK_SYSTEM_TAGS,
  MOCK_USER_TAGS,
  createMockResponse,
  mockDelay,
} from "@/mock";

/**
 * 获取系统标签信息
 * @returns {Promise<Object>} 系统标签信息
 */
export const getSystemTagInfo = async () => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse(MOCK_SYSTEM_TAGS);
  }

  return request({
    url: "/selectSysTagInfo",
    method: "post",
  });
};

/**
 * 获取用户标签信息
 * @returns {Promise<Object>} 用户标签信息
 */
export const getUserTagInfo = async (params) => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse({
      sysTagInfo: MOCK_SYSTEM_TAGS,
      userTagInfo: MOCK_USER_TAGS,
    });
  }

  return request({
    url: "/selectUserTagInfo",
    method: "post",
    data: params,
  });
};

/**
 * 更新用户标签
 * @param {Object} params - 用户标签信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateUserTagInfo = async (params) => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    return createMockResponse(null);
  }

  return request({
    url: "/updateUserTagInfo",
    method: "post",
    data: params,
  });
};
