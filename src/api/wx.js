import request from "@/utils/request";

const MAX_RETRIES = 0;
const RETRY_DELAY = 2000;

/**
 * 微信登录
 * @param {string} code - 微信授权码
 */
export function wxLogin(code) {
  return request({
    url: "/wx/login",
    method: "post",
    data: { code },
  });
}

/**
 * 获取微信 JSSDK 配置
 * @param {string} url - 当前页面 URL
 */
export function getWxConfig(url) {
  return request({
    url: "/wx/config",
    method: "post",
    data: { url },
  });
}
