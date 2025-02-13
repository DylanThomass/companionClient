import request from "@/utils/request";

// 微信相关接口
export function getWxConfig(data) {
  return request({
    url: "/wx/config",
    method: "get",
    params: data,
  });
}

export function getWxAuthUrl(redirect) {
  return request({
    url: "/wx/auth-url",
    method: "get",
    params: { redirect },
  });
}
