const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");
const config = require("../config");
const jwt = require("jsonwebtoken");

// 微信接口相关常量
const WX_API = {
  ACCESS_TOKEN: "https://api.weixin.qq.com/sns/oauth2/access_token",
  USER_INFO: "https://api.weixin.qq.com/sns/userinfo",
  BASE_TOKEN: "https://api.weixin.qq.com/cgi-bin/token",
  TICKET: "https://api.weixin.qq.com/cgi-bin/ticket/getticket",
};

// 缓存微信接口调用凭证
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

// 工具函数
function generateNonceStr() {
  return Math.random().toString(36).substr(2, 15);
}

function generateSignature(ticket, noncestr, timestamp, url) {
  const str = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`;
  return crypto.createHash("sha1").update(str).digest("hex");
}

// 获取 access_token
async function getAccessToken() {
  try {
    if (wxCache.accessToken && Date.now() < wxCache.accessTokenExpires) {
      return wxCache.accessToken;
    }

    // 检查配置是否存在
    if (!config.wx.appId || !config.wx.appSecret) {
      throw new Error("微信配置缺失，请检查环境变量");
    }

    const url = `${WX_API.BASE_TOKEN}?grant_type=client_credential&appid=${config.wx.appId}&secret=${config.wx.appSecret}`;
    console.log("请求微信 access_token URL:", url);

    const response = await axios.get(url);
    console.log("微信返回数据:", response.data);

    if (response.data.access_token) {
      wxCache.accessToken = response.data.access_token;
      wxCache.accessTokenExpires = Date.now() + (7200 - 300) * 1000;
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

// 获取 jsapi_ticket
async function getJsapiTicket() {
  try {
    if (wxCache.jsapiTicket && Date.now() < wxCache.jsapiTicketExpires) {
      return wxCache.jsapiTicket;
    }

    const accessToken = await getAccessToken();
    const url = `${WX_API.TICKET}?access_token=${accessToken}&type=jsapi`;
    const response = await axios.get(url);

    if (response.data.ticket) {
      wxCache.jsapiTicket = response.data.ticket;
      wxCache.jsapiTicketExpires = Date.now() + (7200 - 300) * 1000;
      return wxCache.jsapiTicket;
    }
    throw new Error("获取 jsapi_ticket 失败");
  } catch (error) {
    console.error("获取 jsapi_ticket 失败:", error);
    throw error;
  }
}

// 获取微信 JS-SDK 配置
router.get("/config", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) {
      throw new Error("URL 参数缺失");
    }

    const cleanUrl = url.split("#")[0];
    const noncestr = generateNonceStr();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const ticket = await getJsapiTicket();
    const signature = generateSignature(ticket, noncestr, timestamp, cleanUrl);

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

// 微信登录
router.post("/login", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      throw new Error("登录失败：缺少授权码");
    }

    // 1. 通过 code 获取 access_token
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
