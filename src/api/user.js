import request from "@/utils/request";

/**
 * 获取用户信息
 */
export function getUserInfo(openid) {
  console.log("获取用户信息，openid:", openid);
  return request({
    url: "/selectUser",
    method: "post",
    data: { openId: openid },
  });
}
