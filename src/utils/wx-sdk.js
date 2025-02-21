import wx from "weixin-js-sdk";
import { getWxConfig } from "@/api/wx";

const WX_CONFIG_CACHE_KEY = "wx_js_config";
const CONFIG_EXPIRE_TIME = 7100 * 1000; // 微信 config 有效期为 7200s，留 100s 余量

// 默认的 JS 接口列表
const DEFAULT_JS_API_LIST = [
  "updateAppMessageShareData",
  "updateTimelineShareData",
];

/**
 * 从缓存获取配置
 * @param {string} url - 当前页面 URL
 * @returns {Object} 微信配置
 */
const getConfigFromCache = (url) => {
  const cached = localStorage.getItem(WX_CONFIG_CACHE_KEY);
  if (!cached) return null;

  try {
    const { timestamp, config } = JSON.parse(cached);
    // 检查是否过期和 URL 是否匹配
    if (Date.now() - timestamp < CONFIG_EXPIRE_TIME && config.url === url) {
      return config;
    }
  } catch (error) {
    console.error("解析缓存的微信配置失败:", error);
  }
  return null;
};

/**
 * 保存配置到缓存
 * @param {string} url - 当前页面 URL
 * @param {Object} config - 微信配置
 */
const saveConfigToCache = (url, config) => {
  try {
    const cacheData = {
      timestamp: Date.now(),
      config: { ...config, url },
    };
    localStorage.setItem(WX_CONFIG_CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error("保存微信配置到缓存失败:", error);
  }
};

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

    // 尝试从缓存获取配置
    const cachedConfig = getConfigFromCache(url);
    if (cachedConfig) {
      console.log("使用缓存的微信配置");
      return new Promise((resolve, reject) => {
        wx.config({
          debug: process.env.NODE_ENV === "development",
          ...cachedConfig,
          jsApiList,
        });

        wx.ready(() => {
          console.log("微信配置成功（使用缓存）");
          resolve();
        });

        wx.error((err) => {
          console.error("微信配置失败（使用缓存）:", err);
          // 配置失败时清除缓存
          localStorage.removeItem(WX_CONFIG_CACHE_KEY);
          reject(err);
        });
      });
    }

    // 获取微信配置
    const data = await getWxConfig(url);

    // 保存配置到缓存
    saveConfigToCache(url, {
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
    });

    return new Promise((resolve, reject) => {
      wx.config({
        debug: process.env.NODE_ENV === "development",
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList,
      });

      wx.ready(() => {
        console.log("微信配置成功");
        resolve();
      });

      wx.error((err) => {
        console.error("微信配置失败:", err);
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

/**
 * 选择图片
 * @param {number} count - 选择图片数量
 * @returns {Promise<string[]>} 本地图片 ID 列表
 */
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

/**
 * 获取本地图片 URL
 * @param {string} localId - 本地图片 ID
 * @returns {Promise<string>} 本地图片 URL
 */
export function getLocalImgUrl(localId) {
  return new Promise((resolve, reject) => {
    wx.getLocalImgData({
      localId,
      success: (res) => {
        // 在微信环境中，iOS 和 Android 返回的 localData 格式可能不同
        let localData = res.localData;
        console.log("微信返回的原始数据类型:", typeof localData);
        console.log("数据开头:", localData.substring(0, 50));

        // 对于 iOS，如果返回的是包含头部信息的完整 base64，直接使用
        if (localData.indexOf("data:image") !== 0) {
          // 对于 Android，需要手动添加头部信息
          localData = "data:image/jpeg;base64," + localData;
        }
        console.log("处理后的数据长度:", localData.length);
        resolve(localData);
      },
      fail: reject,
    });
  });
}

/**
 * 获取位置
 * @returns {Promise<Object>} 位置信息
 */
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
