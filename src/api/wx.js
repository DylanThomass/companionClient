import request from "@/utils/request";

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
    method: "get",
    params: { url },
  });
}

/**
 * 微信分享配置
 * @param {Object} shareData - 分享配置
 * @param {string} shareData.title - 分享标题
 * @param {string} shareData.desc - 分享描述
 * @param {string} shareData.link - 分享链接
 * @param {string} shareData.imgUrl - 分享图片
 */
export function configWxShare(shareData) {
  const defaultConfig = {
    title: process.env.VUE_APP_TITLE,
    desc: "让温暖永远相伴",
    link: window.location.href,
    imgUrl: `${process.env.VUE_APP_BASE_URL}/logo.png`,
  };

  const config = { ...defaultConfig, ...shareData };

  // 配置分享到朋友圈
  wx.updateTimelineShareData({
    ...config,
    success: () => {
      console.log("分享到朋友圈配置成功");
    },
    fail: (err) => {
      console.error("分享到朋友圈配置失败:", err);
    },
  });

  // 配置分享给朋友
  wx.updateAppMessageShareData({
    ...config,
    success: () => {
      console.log("分享给朋友配置成功");
    },
    fail: (err) => {
      console.error("分享给朋友配置失败:", err);
    },
  });
}
