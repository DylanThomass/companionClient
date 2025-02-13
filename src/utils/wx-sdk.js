import wx from "weixin-js-sdk";
import { getWxConfig } from "@/api/wx";

// 默认的 JS 接口列表
const DEFAULT_JS_API_LIST = [
  "updateAppMessageShareData",
  "updateTimelineShareData",
];

/**
 * 检查是否在微信环境
 * @returns {boolean}
 */
export function isWxEnv() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
}

/**
 * 初始化微信 JS-SDK
 * @param {string} url - 当前页面 URL
 * @param {string[]} jsApiList - 需要使用的 JS 接口列表
 */
export async function initWxConfig(url, jsApiList = DEFAULT_JS_API_LIST) {
  try {
    // 非微信环境不初始化
    if (!isWxEnv()) {
      console.log("非微信环境，跳过 JS-SDK 初始化");
      return;
    }

    const { data } = await getWxConfig(url);

    wx.config({
      debug: process.env.NODE_ENV === "development",
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
      jsApiList,
      openTagList: ["wx-open-launch-weapp"], // 开放标签，用于跳转小程序
    });

    return new Promise((resolve, reject) => {
      wx.ready(() => {
        console.log("微信 JS-SDK 配置成功");
        resolve();
      });
      wx.error((err) => {
        console.error("微信 JS-SDK 配置失败:", {
          url,
          error: err,
          config: data,
        });
        reject(err);
      });
    });
  } catch (error) {
    console.error("初始化微信配置失败:", {
      url,
      error: error.message || error,
    });
    throw error;
  }
}

// 选择图片
export function chooseImage(count = 1) {
  return new Promise((resolve, reject) => {
    wx.chooseImage({
      count,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: (res) => resolve(res.localIds),
      fail: reject,
    });
  });
}

// 获取位置
export function getLocation() {
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: "gcj02",
      success: resolve,
      fail: reject,
    });
  });
}

/**
 * 设置微信分享
 * @param {Object} shareData - 分享配置
 * @param {string} shareData.title - 分享标题
 * @param {string} shareData.desc - 分享描述
 * @param {string} shareData.link - 分享链接
 * @param {string} shareData.imgUrl - 分享图标
 */
export function setWxShare(shareData) {
  if (!isWxEnv()) {
    console.warn("非微信环境，分享功能不可用");
    return;
  }

  const data = {
    title: shareData.title,
    desc: shareData.desc,
    link: shareData.link,
    imgUrl: shareData.imgUrl,
  };

  try {
    wx.updateAppMessageShareData(data);
    wx.updateTimelineShareData(data);
  } catch (error) {
    console.error("设置微信分享失败:", error.message || error);
    throw error;
  }
}

/**
 * 检查 JS-SDK 是否可用
 * @returns {Promise<boolean>}
 */
export function checkWxSdkAvailable() {
  return new Promise((resolve) => {
    if (!isWxEnv()) {
      resolve(false);
      return;
    }

    if (typeof wx === "undefined") {
      console.error("微信 JS-SDK 未加载");
      resolve(false);
      return;
    }

    wx.checkJsApi({
      jsApiList: ["updateAppMessageShareData", "updateTimelineShareData"],
      success: (res) => {
        resolve(true);
      },
      fail: (err) => {
        console.error("JS-SDK 接口检查失败:", err);
        resolve(false);
      },
    });
  });
}
