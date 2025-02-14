import request from "@/utils/request";

/**
 * 获取数据字典
 * @param {string} type 字典类型
 * @returns {Promise} 返回字典数据
 */
export function getDictByType(type) {
  return request({
    url: "/system/dict/data",
    method: "get",
    params: { type },
  });
}

/**
 * 获取系统配置
 * @param {string} key 配置键名
 * @returns {Promise} 返回配置数据
 */
export function getConfig(key) {
  return request({
    url: "/system/config",
    method: "get",
    params: { key },
  });
}

/**
 * 获取敏感词列表
 * @returns {Promise} 返回敏感词列表
 */
export function getSensitiveWords() {
  return request({
    url: "/system/sensitive/words",
    method: "get",
  });
}

/**
 * 获取系统版本信息
 * @returns {Promise} 返回版本信息
 */
export function getVersion() {
  return request({
    url: "/system/version",
    method: "get",
  });
}
