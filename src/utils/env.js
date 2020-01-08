// 环境相关配置，如在baseConfig.js中添加其他环境变量，需要按照以下判断逻辑判断环境定义变量
import baseConfig from '@/baseConfig'

const envConfig = baseConfig.env

/**
 * 获取环境变量对象
 * @returns {{baseUrl: baseConfig.env.dev.baseUrl, jsePublicKey: (baseConfig.env.dev.jsePublicKey|string)}}
 */
const getEnvConfig = () => {
  let { baseUrl } = envConfig.dev
  let { jsePublicKey } = envConfig.dev
  if (process.env.NODE_ENV === 'production') {
    if (process.env.VUE_APP_DEPLOY_ENV === 'sit') {
      baseUrl = envConfig.sit.baseUrl
      jsePublicKey = envConfig.sit.jsePublicKey
    } else if (process.env.VUE_APP_DEPLOY_ENV === 'uat') {
      baseUrl = envConfig.uat.baseUrl
      jsePublicKey = envConfig.uat.jsePublicKey
    } else {
      baseUrl = envConfig.prod.baseUrl
      jsePublicKey = envConfig.prod.jsePublicKey
    }
  } else {
    if (process.env.VUE_APP_DEPLOY_ENV === 'yapi') {
      baseUrl = envConfig.yapi.baseUrl
    }
  }
  return {
    baseUrl,
    jsePublicKey
  }
}

const myEnvConfig = getEnvConfig()

export default myEnvConfig
