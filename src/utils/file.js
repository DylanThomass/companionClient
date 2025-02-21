/**
 * 将 base64 转换为文件对象
 * @param {string} base64Data base64字符串
 * @param {string} filename 文件名
 * @returns {File} 文件对象
 */
export const base64ToFile = (base64Data, filename = "image.png") => {
  console.log("开始转换 base64 到文件");
  if (!base64Data) {
    throw new Error("base64数据为空");
  }

  // 移除 base64 头部信息（如果有的话）
  const base64Clean = base64Data.replace(/^data:image\/\w+;base64,/, "");
  console.log("清理后的 base64 长度:", base64Clean.length);

  if (!base64Clean) {
    throw new Error("base64数据无效");
  }

  // 将 base64 转换为二进制数据
  const binaryData = atob(base64Clean);
  console.log("二进制数据长度:", binaryData.length);

  // 创建 Uint8Array
  const bytes = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    bytes[i] = binaryData.charCodeAt(i);
  }
  console.log("Uint8Array 长度:", bytes.length);

  // 验证数据是否有效
  if (bytes.length === 0) {
    throw new Error("转换后的数据为空");
  }

  // 创建 Blob 对象
  const blob = new Blob([bytes.buffer], { type: "image/jpeg" });
  console.log("Blob 大小:", blob.size);

  // 验证 blob 是否有效
  if (blob.size === 0) {
    throw new Error("创建的 Blob 为空");
  }

  // 创建 File 对象
  const file = new File([blob], filename, {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
  console.log("创建的文件大小:", file.size);
  return file;
};
