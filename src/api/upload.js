import request from "@/utils/request";

/**
 * 上传图片
 * @param {File} file 文件对象
 */
export const uploadHeadImg = async (data) => {
  return request({
    url: "/api/updateUser",
    method: "POST",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
