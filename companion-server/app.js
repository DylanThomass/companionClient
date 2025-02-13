const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// 首先加载环境变量
const result = dotenv.config();

if (result.error) {
  console.error("加载 .env 文件失败:", result.error);
  process.exit(1);
}

// 打印环境变量检查
console.log("环境变量检查:", {
  WX_APPID: process.env.WX_APPID,
  WX_APP_SECRET: !!process.env.WX_APP_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});

// 然后再加载其他模块
const responseHandler = require("./middleware/response");
const config = require("./config");

// 检查必要的配置
if (!config.wx.validate()) {
  console.error("缺少必要的微信配置，请检查 .env 文件");
  process.exit(1);
}

const app = express();
const port = config.server.port;

// SSL 配置
// const options = {
//   key: fs.readFileSync(path.join(__dirname, "../certs/localhost+1-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "../certs/localhost+1.pem")),
// };

// 更新 CORS 配置
app.use(
  cors({
    origin: "*", // 允许所有来源
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false,
  })
);

app.use(express.json());
app.use(responseHandler);

// 模拟数据库
const userDB = new Map();

// 获取用户信息接口
app.get("/api/user/info", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      code: -1,
      message: "未登录",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userInfo = userDB.get(decoded.openid);

    if (!userInfo) {
      return res.error("用户不存在", "4040");
    }

    res.success(userInfo);
  } catch (error) {
    res.error("token 无效", "4010");
  }
});

// 健康检查接口
app.get("/api/health", (req, res) => {
  res.success({ status: "ok" });
});

// 注册路由
// 将 /api/wx 开头的请求转发到 wx.js 路由处理
app.use("/api/wx", require("./routes/wx"));

// 使用普通 HTTP 服务
// https.createServer(options, app).listen(3000, "0.0.0.0", () => {
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
