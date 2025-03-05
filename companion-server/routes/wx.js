const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config");

// 微信接口常量配置
const WX_API = {
  // OAuth2 相关接口
  ACCESS_TOKEN: "https://api.weixin.qq.com/sns/oauth2/access_token",
  USER_INFO: "https://api.weixin.qq.com/sns/userinfo",
  // 基础接口
  BASE_TOKEN: "https://api.weixin.qq.com/cgi-bin/token",
  JSAPI_TICKET: "https://api.weixin.qq.com/cgi-bin/ticket/getticket",
};

// 微信接口调用凭证缓存
const wxCache = {
  accessToken: null,
  accessTokenExpires: 0,
  jsapiTicket: null,
  jsapiTicketExpires: 0,
};

/**
 * 生成用户 Token
 * @param {string} openid - 用户 openid
 * @returns {string} JWT token
 */
function generateToken(openid) {
  return jwt.sign({ openid }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
}

/**
 * 生成随机字符串
 * @returns {string} 随机字符串
 */
function generateNonceStr() {
  return Math.random().toString(36).substr(2, 15);
}

/**
 * 生成 JS-SDK 签名
 * @param {string} ticket - jsapi_ticket
 * @param {string} noncestr - 随机字符串
 * @param {string} timestamp - 时间戳
 * @param {string} url - 当前页面 URL
 * @returns {string} 签名
 */
function generateSignature(ticket, noncestr, timestamp, url) {
  const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  return crypto.createHash("sha1").update(str).digest("hex");
}

/**
 * 获取微信 access_token
 * @returns {Promise<string>} access_token
 * @throws {Error} 获取失败时抛出错误
 */
async function getAccessToken() {
  try {
    // 检查缓存是否有效
    if (wxCache.accessToken && Date.now() < wxCache.accessTokenExpires) {
      return wxCache.accessToken;
    }

    // 检查配置
    if (!config.wx.appId || !config.wx.appSecret) {
      throw new Error("微信配置缺失，请检查环境变量");
    }

    // 请求 access_token
    const url = `${WX_API.BASE_TOKEN}?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.appSecret}`;
    const response = await axios.get(url);

    if (response.data.access_token) {
      // 更新缓存
      wxCache.accessToken = response.data.access_token;
      wxCache.accessTokenExpires = Date.now() + (7200 - 300) * 1000; // 提前5分钟过期
      return wxCache.accessToken;
    }

    throw new Error(`获取 access_token 失败: ${JSON.stringify(response.data)}`);
  } catch (error) {
    console.error("获取 access_token 失败:", error.message);
    if (error.response) {
      console.error("微信返回错误:", error.response.data);
    }
    throw error;
  }
}

/**
 * 获取微信 jsapi_ticket
 * @returns {Promise<string>} jsapi_ticket
 * @throws {Error} 获取失败时抛出错误
 */
async function getJsapiTicket() {
  try {
    // 检查缓存是否有效
    if (wxCache.jsapiTicket && Date.now() < wxCache.jsapiTicketExpires) {
      return wxCache.jsapiTicket;
    }

    // 获取 access_token
    const accessToken = await getAccessToken();

    // 请求 jsapi_ticket
    const url = `${WX_API.JSAPI_TICKET}?access_token=${accessToken}&type=jsapi`;
    const response = await axios.get(url);

    if (response.data.ticket) {
      // 更新缓存
      wxCache.jsapiTicket = response.data.ticket;
      wxCache.jsapiTicketExpires = Date.now() + (7200 - 300) * 1000; // 提前5分钟过期
      return wxCache.jsapiTicket;
    }

    throw new Error("获取 jsapi_ticket 失败");
  } catch (error) {
    console.error("获取 jsapi_ticket 失败:", error);
    throw error;
  }
}

/**
 * 获取微信 JS-SDK 配置
 * @route GET /api/wx/config
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
router.get("/config", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      throw new Error("URL 参数缺失");
    }

    // 清理 URL（移除 hash 部分）
    const cleanUrl = url.split("#")[0];

    // 生成签名所需参数
    const noncestr = generateNonceStr();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const ticket = await getJsapiTicket();
    const signature = generateSignature(ticket, noncestr, timestamp, cleanUrl);

    // 返回配置信息
    res.success({
      appId: config.wx.appId,
      timestamp,
      nonceStr: noncestr,
      signature,
    });
  } catch (error) {
    console.error("获取微信配置失败：", error);
    res.error(error.message || "获取微信配置失败");
  }
});

/**
 * 微信登录
 * @route POST /api/wx/login
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
router.post("/login", async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      throw new Error("登录失败：缺少授权码");
    }

    // 1. 获取 access_token
    const tokenUrl = `${WX_API.ACCESS_TOKEN}?appid=${config.wx.appId}&secret=${config.wx.appSecret}&code=${code}&grant_type=authorization_code`;
    const tokenRes = await axios.get(tokenUrl);

    if (tokenRes.data.errcode) {
      throw new Error(tokenRes.data.errmsg);
    }

    const { access_token, openid } = tokenRes.data;

    // 2. 获取用户信息
    const userInfoUrl = `${WX_API.USER_INFO}?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
    const userInfoRes = await axios.get(userInfoUrl);

    if (userInfoRes.data.errcode) {
      throw new Error(userInfoRes.data.errmsg);
    }

    // 3. 返回用户信息和 token
    res.success({
      token: generateToken(openid),
      userInfo: userInfoRes.data,
    });
  } catch (error) {
    console.error("微信登录失败:", error);
    res.error(error.message || "登录失败");
  }
});

module.exports = router;
