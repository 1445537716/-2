import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token' // 设置 一个独一无二的key值
const timeKey = 'hrsaas-timestamp-key' // 设置 一个独一无二的key值

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获取时间戳
export function getTimeStamp() {
  return Cookies.get(timeKey)
}

// 存入时间戳
export function setTimeStamp() {
  return Cookies.set(timeKey, Date.now())
}
