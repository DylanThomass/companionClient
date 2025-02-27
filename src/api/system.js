import request from "@/utils/request";

export const getUserTagInfo = (data) => {
  return request({
    url: "/selectUserTagInfo",
    method: "post",
    data,
  });
};

export const updateUserTag = (data) => {
  return request({
    url: "/updateUserTagInfo",
    method: "post",
    data,
  });
};
