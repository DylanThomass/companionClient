/**
 * 微信JS-SDK工具函数
 * 提供微信JS-SDK的初始化、配置缓存和分享等功能
 */

import wx from "weixin-js-sdk";
import { getWxConfig } from "@/api/wx";

// 常量定义
const WX_CONFIG_CACHE_KEY = "wx_js_config"; // 缓存键前缀
const CONFIG_EXPIRE_TIME = 7100 * 1000; // 微信配置有效期(7200s)，预留100s余量
const DEFAULT_JS_API_LIST = [
  "updateAppMessageShareData",
  "updateTimelineShareData",
  "chooseImage",
  "getLocalImgData",
  "previewImage",
  "uploadImage",
  "downloadImage",
];
// 默认开放标签列表
const DEFAULT_OPEN_TAG_LIST = ["wx-open-launch-app", "wx-open-launch-weapp"];
// 日志级别: 0=关闭所有, 1=只显示错误, 2=显示错误和警告, 3=显示所有
const LOG_LEVEL = process.env.NODE_ENV === "development" ? 3 : 1;

/**
 * 自定义日志函数
 */
const logger = {
  error: (...args) => {
    if (LOG_LEVEL >= 1) console.error(...args);
  },
  warn: (...args) => {
    if (LOG_LEVEL >= 2) console.warn(...args);
  },
  log: (...args) => {
    if (LOG_LEVEL >= 3) console.log(...args);
  },
};

/**
 * 检查是否在微信环境中
 * @returns {boolean} 是否在微信环境
 */
export function isWxEnv() {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("micromessenger");
}

/**
 * 生成缓存键
 * @param {string} url - 当前页面URL
 * @returns {string} 缓存键
 */
function generateCacheKey(url) {
  if (!url) return WX_CONFIG_CACHE_KEY;

  try {
    const urlObj = new URL(url);
    // 只使用域名和路径部分作为缓存键，忽略查询参数
    return `${WX_CONFIG_CACHE_KEY}_${urlObj.origin}${urlObj.pathname}`;
  } catch (e) {
    return `${WX_CONFIG_CACHE_KEY}_${url}`;
  }
}

/**
 * 从缓存获取微信配置
 * @param {string} url - 当前页面URL
 * @returns {Object|null} 微信配置或null
 */
function getConfigFromCache(url) {
  const cacheKey = generateCacheKey(url);
  const cached = localStorage.getItem(cacheKey);

  logger.log("尝试获取微信配置缓存，键:", cacheKey);

  if (!cached) {
    return null;
  }

  try {
    const cacheData = JSON.parse(cached);

    // 检查缓存是否过期
    if (
      cacheData.cacheTimestamp &&
      Date.now() - cacheData.cacheTimestamp < CONFIG_EXPIRE_TIME
    ) {
      logger.log("找到有效的微信配置缓存");

      return {
        appId: cacheData.appId,
        timestamp: cacheData.timestamp,
        nonceStr: cacheData.nonceStr,
        signature: cacheData.signature,
      };
    } else {
      logger.log("微信配置缓存已过期", {
        cacheTime: new Date(cacheData.cacheTimestamp || 0).toLocaleString(),
        currentTime: new Date().toLocaleString(),
        expireTime: CONFIG_EXPIRE_TIME / 1000 + "秒",
      });
    }
  } catch (error) {
    logger.error("解析微信配置缓存失败:", error);
  }

  return null;
}

/**
 * 保存微信配置到缓存
 * @param {Object} config - 微信配置
 * @param {string} url - 当前页面URL
 */
function saveConfigToCache(config, url) {
  try {
    const cacheKey = generateCacheKey(url);

    const cacheData = {
      cacheTimestamp: Date.now(), // 缓存时间戳，用于过期检查
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
    };

    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    logger.log("微信配置已缓存:", { cacheKey, url });
  } catch (error) {
    logger.error("保存微信配置到缓存失败:", error);
  }
}

/**
 * 清除微信配置缓存
 * @param {string} url - 当前页面URL
 */
function clearConfigCache(url) {
  const cacheKey = generateCacheKey(url);
  localStorage.removeItem(cacheKey);
  logger.log("已清除微信配置缓存:", cacheKey);
}

/**
 * 设置默认分享内容
 * @param {string} url - 分享链接
 * @param {boolean} silent - 是否静默设置（不显示成功/失败提示）
 */
function setDefaultShare(url, silent = false) {
  // 如果不在微信环境中，直接返回
  if (!isWxEnv()) {
    logger.warn("非微信环境，跳过设置分享");
    return;
  }

  const title = "Companion - 治愈系陪伴";
  const desc = "一起来体验温暖的陪伴吧";
  const link = url || window.location.href.split("#")[0];
  // 使用绝对路径的图片URL，确保微信可以正确加载
  const imgUrl =
    process.env.VUE_APP_SHARE_IMG_URL || "https://your-domain.com/logo.png";

  try {
    // 设置分享给朋友
    wx.updateAppMessageShareData({
      title,
      desc,
      link,
      imgUrl,
      success: () => !silent && logger.log("设置分享到朋友成功"),
      fail: (err) => logger.error("设置分享到朋友失败:", err),
    });

    // 设置分享到朋友圈
    wx.updateTimelineShareData({
      title,
      link,
      imgUrl,
      success: () => !silent && logger.log("设置分享到朋友圈成功"),
      fail: (err) => logger.error("设置分享到朋友圈失败:", err),
    });
  } catch (e) {
    logger.error("设置默认分享失败:", e);
  }
}

/**
 * 配置微信JS-SDK
 * @param {Object} config - 微信配置
 * @param {Array} jsApiList - 需要使用的JS接口列表
 * @param {Array} openTagList - 需要使用的开放标签列表
 * @returns {Promise} 配置结果
 */
function configWxJsSdk(config, jsApiList, openTagList = DEFAULT_OPEN_TAG_LIST) {
  return new Promise((resolve, reject) => {
    // 使用环境变量控制调试模式，默认在开发环境关闭
    const enableDebug = process.env.VUE_APP_WX_DEBUG === "true";

    wx.config({
      debug: enableDebug,
      appId: config.appId,
      timestamp: config.timestamp,
      nonceStr: config.nonceStr,
      signature: config.signature,
      jsApiList,
      openTagList,
    });

    wx.ready(() => {
      logger.log("微信JS-SDK配置成功");
      resolve();
    });

    wx.error((err) => {
      logger.error("微信JS-SDK配置失败:", JSON.stringify(err));
      reject(err);
    });
  });
}

/**
 * 初始化微信JS-SDK
 * @param {string} url - 当前页面URL，不传则使用当前页面URL
 * @param {Array} jsApiList - 需要使用的JS接口列表
 * @param {boolean} enableShare - 是否启用默认分享设置
 * @param {boolean} silentShare - 是否静默设置分享（不显示成功/失败提示）
 * @returns {Promise} 初始化结果
 */
export async function initWxConfig(
  url,
  jsApiList = DEFAULT_JS_API_LIST,
  enableShare = true,
  silentShare = true
) {
  try {
    // 非微信环境不初始化
    if (!isWxEnv()) {
      logger.log("非微信环境，跳过JS-SDK初始化");
      return;
    }

    // 获取当前页面完整URL，不包含hash部分
    const currentUrl = url || window.location.href.split("#")[0];
    logger.log("微信配置URL:", currentUrl);

    // 尝试从缓存获取配置
    const cachedConfig = getConfigFromCache(currentUrl);

    if (cachedConfig) {
      try {
        // 使用缓存配置
        logger.log("使用缓存的微信配置");
        await configWxJsSdk(cachedConfig, jsApiList);

        // 根据参数决定是否设置分享
        if (enableShare) {
          setDefaultShare(currentUrl, silentShare);
        }

        return;
      } catch (err) {
        logger.error("使用缓存配置失败，将重新获取:", err);
        clearConfigCache(currentUrl);
      }
    }
    console.log("从服务器获取微信配置:", currentUrl);
    // 从服务器获取新的微信配置
    logger.log("从服务器获取微信配置...");
    const data = await getWxConfig(currentUrl);

    if (!data?.appId) {
      throw new Error("获取微信配置失败，返回数据无效");
    }

    logger.log("获取到新的微信配置");

    // 构建配置对象
    const config = {
      appId: data.appId,
      timestamp: data.timestamp,
      nonceStr: data.nonceStr,
      signature: data.signature,
    };

    // 保存配置到缓存
    saveConfigToCache(config, currentUrl);

    // 配置微信JS-SDK
    await configWxJsSdk(config, jsApiList);

    // 根据参数决定是否设置分享
    if (enableShare) {
      setDefaultShare(currentUrl, silentShare);
    }
  } catch (error) {
    logger.error("初始化微信JS-SDK失败:", {
      url,
      error: error.message || error,
    });
    throw error;
  }
}

/**
 * 检查微信JS-SDK是否可用
 * @returns {Promise<boolean>} 是否可用
 */
export function checkWxSdkAvailable() {
  return new Promise((resolve) => {
    if (!isWxEnv()) {
      resolve(false);
      return;
    }

    if (typeof wx === "undefined") {
      logger.error("微信JS-SDK未加载");
      resolve(false);
      return;
    }

    wx.checkJsApi({
      jsApiList: DEFAULT_JS_API_LIST,
      success: () => resolve(true),
      fail: (err) => {
        logger.error("JS-SDK接口检查失败:", err);
        resolve(false);
      },
    });
  });
}

/**
 * 自定义分享内容
 * @param {Object} shareData - 分享数据
 * @param {string} shareData.title - 分享标题
 * @param {string} shareData.desc - 分享描述
 * @param {string} shareData.link - 分享链接
 * @param {string} shareData.imgUrl - 分享图片
 * @param {boolean} silent - 是否静默设置（不显示成功/失败提示）
 * @returns {Promise} 设置结果
 */
export function setCustomShare(shareData, silent = false) {
  return new Promise((resolve, reject) => {
    // 如果不在微信环境中，直接返回成功
    if (!isWxEnv()) {
      logger.warn("非微信环境，跳过设置分享");
      resolve();
      return;
    }

    try {
      wx.updateAppMessageShareData({
        ...shareData,
        success: () => {
          !silent && logger.log("设置分享到朋友成功");
          resolve();
        },
        fail: (err) => {
          logger.error("设置分享到朋友失败:", err);
          reject(err);
        },
      });

      wx.updateTimelineShareData({
        title: shareData.title,
        link: shareData.link,
        imgUrl: shareData.imgUrl,
        success: () => !silent && logger.log("设置分享到朋友圈成功"),
        fail: (err) => logger.error("设置分享到朋友圈失败:", err),
      });
    } catch (e) {
      logger.error("设置自定义分享失败:", e);
      reject(e);
    }
  });
}

/**
 * 清除所有微信配置缓存
 */
export function clearAllWxConfigCache() {
  try {
    // 获取所有localStorage键
    const keys = Object.keys(localStorage);

    // 过滤出微信配置相关的键
    const wxConfigKeys = keys.filter(
      (key) =>
        key === WX_CONFIG_CACHE_KEY || key.startsWith(`${WX_CONFIG_CACHE_KEY}_`)
    );

    // 删除所有微信配置缓存
    wxConfigKeys.forEach((key) => localStorage.removeItem(key));

    logger.log(`已清除所有微信配置缓存，共 ${wxConfigKeys.length} 项`);
  } catch (error) {
    logger.error("清除所有微信配置缓存失败:", error);
  }
}

/**
 * 选择图片
 * @param {Object} options - 选择图片的配置选项
 * @param {number} options.count - 最多可以选择的图片张数，默认9
 * @param {Array} options.sizeType - 所选的图片的尺寸，original 原图，compressed 压缩图，默认二者都有
 * @param {Array} options.sourceType - 选择图片的来源，album 相册，camera 相机，默认二者都有
 * @returns {Promise<Array>} 返回选择的图片本地ID列表
 */
export function chooseImage(options = {}) {
  return new Promise((resolve, reject) => {
    // 如果不在微信环境中，直接拒绝
    if (!isWxEnv()) {
      logger.error("非微信环境，无法使用chooseImage");
      reject(new Error("非微信环境，无法使用chooseImage"));
      return;
    }

    // 检查wx对象是否存在
    if (typeof wx === "undefined" || !wx.chooseImage) {
      logger.error("微信JS-SDK未加载或不支持chooseImage");
      reject(new Error("微信JS-SDK未加载或不支持chooseImage"));
      return;
    }

    // 默认配置
    const defaultOptions = {
      count: 1, // 默认只选择一张
      sizeType: ["original", "compressed"], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
    };

    // 合并配置
    const mergedOptions = { ...defaultOptions, ...options };

    wx.chooseImage({
      ...mergedOptions,
      success: (res) => {
        logger.log("选择图片成功:", res);
        resolve(res.localIds);
      },
      fail: (err) => {
        logger.error("选择图片失败:", err);
        reject(err);
      },
      cancel: () => {
        logger.log("用户取消选择图片");
        reject(new Error("用户取消选择图片"));
      },
    });
  });
}

/**
 * 获取本地图片的base64数据
 * @param {string} localId - 图片的本地ID
 * @returns {Promise<string>} 返回图片的base64数据
 */
export function getLocalImgUrl(localId) {
  return new Promise((resolve, reject) => {
    // 如果不在微信环境中，直接拒绝
    if (!isWxEnv()) {
      logger.error("非微信环境，无法使用getLocalImgData");
      reject(new Error("非微信环境，无法使用getLocalImgData"));
      return;
    }

    // 检查wx对象是否存在
    if (typeof wx === "undefined" || !wx.getLocalImgData) {
      logger.error("微信JS-SDK未加载或不支持getLocalImgData");
      reject(new Error("微信JS-SDK未加载或不支持getLocalImgData"));
      return;
    }

    wx.getLocalImgData({
      localId: localId, // 图片的localID
      success: (res) => {
        logger.log("获取本地图片数据成功");
        // localData是图片的base64数据，可以用img标签显示
        resolve(res.localData);
      },
      fail: (err) => {
        logger.error("获取本地图片数据失败:", err);
        reject(err);
      },
    });
  });
}

/**
 * 上传图片到微信服务器
 * @param {string} localId - 需要上传的图片的本地ID
 * @returns {Promise<string>} 返回图片的服务器ID
 */
export function uploadImage(localId) {
  return new Promise((resolve, reject) => {
    // 如果不在微信环境中，直接拒绝
    if (!isWxEnv()) {
      logger.error("非微信环境，无法使用uploadImage");
      reject(new Error("非微信环境，无法使用uploadImage"));
      return;
    }

    // 检查wx对象是否存在
    if (typeof wx === "undefined" || !wx.uploadImage) {
      logger.error("微信JS-SDK未加载或不支持uploadImage");
      reject(new Error("微信JS-SDK未加载或不支持uploadImage"));
      return;
    }

    wx.uploadImage({
      localId: localId, // 需要上传的图片的本地ID
      isShowProgressTips: 1, // 默认为1，显示进度提示
      success: (res) => {
        logger.log("上传图片成功:", res);
        // 返回图片的服务器端ID
        resolve(res.serverId);
      },
      fail: (err) => {
        logger.error("上传图片失败:", err);
        reject(err);
      },
    });
  });
}

/**
 * 预览图片
 * @param {Object} options - 预览图片的配置选项
 * @param {string} options.current - 当前显示图片的链接
 * @param {Array} options.urls - 需要预览的图片链接列表
 * @returns {Promise} 预览结果
 */
export function previewImage(options) {
  return new Promise((resolve, reject) => {
    // 如果不在微信环境中，直接拒绝
    if (!isWxEnv()) {
      logger.error("非微信环境，无法使用previewImage");
      reject(new Error("非微信环境，无法使用previewImage"));
      return;
    }

    // 检查wx对象是否存在
    if (typeof wx === "undefined" || !wx.previewImage) {
      logger.error("微信JS-SDK未加载或不支持previewImage");
      reject(new Error("微信JS-SDK未加载或不支持previewImage"));
      return;
    }

    wx.previewImage({
      current: options.current, // 当前显示图片的链接
      urls: options.urls, // 需要预览的图片链接列表
      success: () => {
        logger.log("预览图片成功");
        resolve();
      },
      fail: (err) => {
        logger.error("预览图片失败:", err);
        reject(err);
      },
    });
  });
}
