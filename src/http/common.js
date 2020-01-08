import http from '@/base/http'
import api from './api'

// 字典项
const getGlobalDict = (params) => {
  return http.get(api.getGlobalDict, params)
}

// 获取指定字典项
const getSomeDict = (params) => {
  return http.get(api.getSomeDict, params)
}

// 登录验证码开关
const getLoginCaptchaConfig = () => {
  return http.get(api.loginCaptchaConfig)
}
// 登录验证码
const getLoginCaptchaCode = (urlParams) => {
  return http.get(api.loginCaptchaCode, {}, urlParams)
}
// 登录
const getLogin = (params) => {
  return http.post(api.login, params)
}
// 退出
const logout = (params) => {
  return http.get(api.logout, params)
}
// 菜单列表
const getMenuList = () => {
  return http.get(api.getMenuList)
}
// 登录用户信息
const getLoginedUserInfo = () => {
  return http.get(api.getLoginedUserInfo)
}

// 当前用户的菜单权限
const getCurrentUserMenuList = () => {
  return http.get(api.getCurrentUserMenuList)
}

// 当前用户的所有权限
const getCurrentUserAllAuthList = () => {
  return http.get(api.getCurrentUserAllAuthList)
}

export {
  getGlobalDict,
  getLogin,
  getLoginCaptchaConfig,
  getLoginCaptchaCode,
  logout,
  getLoginedUserInfo,
  getMenuList,
  getCurrentUserMenuList,
  getCurrentUserAllAuthList,
  getSomeDict
}
