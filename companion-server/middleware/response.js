/**
 * 统一响应处理中间件
 */
function responseHandler(req, res, next) {
  // 扩展 res.success 方法
  res.success = function (data = null, msg = "success") {
    res.json({
      code: "0000",
      msg,
      data,
    });
  };

  // 扩展 res.error 方法
  res.error = function (msg = "操作失败", code = "5000") {
    res.json({
      code,
      msg,
      data: null,
    });
  };

  next();
}

module.exports = responseHandler;
