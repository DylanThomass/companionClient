import request from "@/utils/request";
import { createMockResponse, mockDelay } from "@/mock";

const MAX_RETRIES = 0;
const RETRY_DELAY = 2000;

// 生成模拟的 token
const generateMockToken = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `mock_token_${timestamp}_${random}`;
};

/**
 * 微信登录
 * @param {string} code - 微信授权码
 */
export const wxLogin = async (params) => {
  // 开发环境使用 mock 数据
  if (
    process.env.NODE_ENV === "development" &&
    process.env.VUE_APP_USE_MOCK === "true"
  ) {
    await mockDelay();
    const token = generateMockToken();
    return createMockResponse({
      code: "0000",
      message: "success",
      data: {
        token,
        userId: 10001,
        accessToken: `mock_access_token_${Date.now()}`,
      },
    });
  }

  return request({
    url: "/wx/login",
    method: "post",
    data: params,
  });
};

/**
 * 获取微信 JSSDK 配置
 * @param {string} url - 当前页面 URL
 */
export const getWxConfig = async (params) => {
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
        appId: "wx1234567890",
        timestamp: Date.now().toString(),
        nonceStr:
          "mock_nonce_str_" + Math.random().toString(36).substring(2, 15),
        signature:
          "mock_signature_" + Math.random().toString(36).substring(2, 15),
      },
    });
  }

  return request({
    url: "/wx/config",
    method: "post",
    data: params,
  });
};
