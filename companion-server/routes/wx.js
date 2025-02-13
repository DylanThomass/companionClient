const express = require("express");
const router = express.Router();
const axios = require("axios");
const crypto = require("crypto");

// 缓存微信接口调用凭证
const wxCache = {
  accessToken: null,
  accessTokenExpires: 0,
  jsapiTicket: null,
  jsapiTicketExpires: 0,
};

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

    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.WX_APPID}&secret=${process.env.WX_APP_SECRET}`;
    const response = await axios.get(url);

    if (response.data.access_token) {
      wxCache.accessToken = response.data.access_token;
      wxCache.accessTokenExpires = Date.now() + (7200 - 300) * 1000;
      return wxCache.accessToken;
    }
    throw new Error("获取 access_token 失败");
  } catch (error) {
    console.error("获取 access_token 失败:", error);
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
    const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${accessToken}&type=jsapi`;
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
      return res.status(400).json({
        code: -1,
        message: "URL 参数缺失",
      });
    }

    const cleanUrl = url.split("#")[0];
    const noncestr = generateNonceStr();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const ticket = await getJsapiTicket();
    const signature = generateSignature(ticket, noncestr, timestamp, cleanUrl);

    res.json({
      code: 0,
      data: {
        appId: process.env.WX_APPID,
        timestamp,
        nonceStr: noncestr,
        signature,
      },
    });
  } catch (error) {
    console.error("获取微信配置失败：", error);
    res.status(500).json({
      code: -1,
      message: "获取微信配置失败",
    });
  }
});

// 微信登录接口
router.post("/login", async (req, res) => {
  try {
    const { code } = req.body;

    // 1. 通过 code 获取 access_token
    const tokenResponse = await axios.get(
      "https://api.weixin.qq.com/sns/oauth2/access_token",
      {
        params: {
          appid: process.env.WX_APPID,
          secret: process.env.WX_APP_SECRET,
          code: code,
          grant_type: "authorization_code",
        },
      }
    );

    const { access_token, openid } = tokenResponse.data;

    // 2. 通过 access_token 和 openid 获取用户信息
    const userInfoResponse = await axios.get(
      "https://api.weixin.qq.com/sns/userinfo",
      {
        params: {
          access_token,
          openid,
          lang: "zh_CN",
        },
      }
    );

    // 3. 返回用户信息和 token
    res.json({
      code: 0,
      data: {
        token: "some-token", // TODO: 使用 JWT 生成真实的 token
        userInfo: {
          openid: userInfoResponse.data.openid,
          nickname: userInfoResponse.data.nickname,
          sex: userInfoResponse.data.sex,
          province: userInfoResponse.data.province,
          city: userInfoResponse.data.city,
          country: userInfoResponse.data.country,
          headimgurl: userInfoResponse.data.headimgurl,
          privilege: userInfoResponse.data.privilege,
          unionid: userInfoResponse.data.unionid,
        },
      },
    });
  } catch (error) {
    console.error("微信登录失败:", error.response?.data || error);
    res.status(500).json({
      code: -1,
      message: "登录失败",
    });
  }
});

module.exports = router;
