/**
 * 系统配置
 */
const config = {
  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || "your-jwt-secret",
    expiresIn: "7d", // Token 过期时间
  },

  // 微信配置
  wx: {
    appId: process.env.WX_APPID,
    appSecret: process.env.WX_APP_SECRET,
    validate() {
      if (!this.appId || !this.appSecret) {
        console.error("微信配置缺失：", {
          appId: !!this.appId,
          appSecret: !!this.appSecret,
        });
        return false;
      }
      return true;
    },
  },

  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || "development",
  },
};

// 打印环境变量检查
console.log("配置文件加载时的环境变量:", {
  WX_APPID: process.env.WX_APPID,
  WX_APP_SECRET: !!process.env.WX_APP_SECRET,
});

module.exports = config;
