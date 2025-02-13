const express = require("express");
const cors = require("cors");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// SSL 配置
// const options = {
//   key: fs.readFileSync(path.join(__dirname, "../certs/localhost+1-key.pem")),
//   cert: fs.readFileSync(path.join(__dirname, "../certs/localhost+1.pem")),
// };

// JWT 密钥
const JWT_SECRET = "your-jwt-secret";

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
      return res.status(404).json({
        code: -1,
        message: "用户不存在",
      });
    }

    res.json({
      code: 0,
      data: userInfo,
    });
  } catch (error) {
    res.status(401).json({
      code: -1,
      message: "token 无效",
    });
  }
});

// 健康检查接口
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 注册路由
// 将 /api/wx 开头的请求转发到 wx.js 路由处理
app.use("/api/wx", require("./routes/wx"));

// 使用普通 HTTP 服务
// https.createServer(options, app).listen(3000, "0.0.0.0", () => {
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
