import wx from "weixin-js-sdk";
import { showToast } from "vant";
import request from "./request";

// 初始化微信配置
export const initWxConfig = async () => {
  try {
    // 获取当前页面 URL，不包含 hash
    const url = window.location.href.split("#")[0];

    // 获取微信配置
    const response = await request({
      url: "/wx/config",
      method: "get",
      params: { url },
    });

    // 配置微信 SDK
    wx.config({
      debug: process.env.VUE_APP_ENV === "development",
      appId: response.appId,
      timestamp: response.timestamp,
      nonceStr: response.nonceStr,
      signature: response.signature,
      jsApiList: [
        "updateAppMessageShareData",
        "updateTimelineShareData",
        "chooseImage",
        "getLocation",
      ],
    });

    // 监听配置成功
    wx.ready(() => {
      console.log("微信 SDK 配置成功");
    });

    // 监听配置失败
    wx.error((res) => {
      console.error("微信 SDK 配置失败", res);
      showToast({
        message: "微信配置失败",
        type: "fail",
      });
    });
  } catch (error) {
    console.error("初始化微信配置失败:", error);
    showToast({
      message: "微信配置失败",
      type: "fail",
    });
    throw error;
  }
};

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
