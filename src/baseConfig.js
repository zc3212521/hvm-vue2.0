const baseConfig = {
  baseVersion: '4.0.0-beta3',
  env: { // 环境相关配置
    dev: {
      baseUrl: '/test',
      jsePublicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDavyfl/Sm5FJ9fn3WR1kUlR/aYS1LFwGxzBtoKia1qKTHJSCK/t04eSLuk8xlWmVS3PPJvwtg2Tuc9pQf8Zqq3VRcW4bMlWo+UAYqGSFsncX/Wy2Cl5oFfGYe5D4g4nDLf5RHHI91N2+/EJGylpqO+z8iKX3+uxdU0PxuvIE4XlwIDAQAB'
      // 其他dev环境相关配置可在此处定义，如 uploadUrl, 特殊变量等
    },
    prod: {
      baseUrl: '/hbm',
      jsePublicKey: ''
    },
    sit: {
      baseUrl: '/hbm',
      jsePublicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDavyfl/Sm5FJ9fn3WR1kUlR/aYS1LFwGxzBtoKia1qKTHJSCK/t04eSLuk8xlWmVS3PPJvwtg2Tuc9pQf8Zqq3VRcW4bMlWo+UAYqGSFsncX/Wy2Cl5oFfGYe5D4g4nDLf5RHHI91N2+/EJGylpqO+z8iKX3+uxdU0PxuvIE4XlwIDAQAB'
    },
    uat: {
      baseUrl: '/hbm',
      jsePublicKey: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr+r1c44Rnrl2rE2Erp9OXQt+hTnbuw9XkbzHKnQFNLWORAtcvTXhYz+EHZfWhITMT5i6p9ghBoIsh7LEnS+7OHULZub+Ll3iqKRooPxDH1PEgnFVbDm5Y/XJ2lfbs1nWc+73zuXDBheJSwMUa78B45XbM/Ehvv2m7HNXp7w7XHwIDAQAB'
    },
    yapi: {
      baseUrl: 'http://yapi.hongguaninfo.com/mock/26',
      jsePublicKey: ''
    }
  },
  icon: {
    localLoad: true, // 是否加载本地图标，是则读取src/assets/font/font.js文件中的图标，否则读取下面远程地址图标
    scriptUrl: '//at.alicdn.com/t/font_1487793_npchsmhasvb.js' // 在 iconfont.cn 上生成
  },
  login: {
    // captcha: true, // 是否开启验证码验证
    // captchaUrl: ''
  },
  queryWhiteList: ['/login'], // 不需要token验证的请求接口白名单
  loadingWhiteList: ['/login'], // 不需要显示loading的请求接口白名单
  frontSetting: true, // 前端配置开关，此配置项开启时，customFrontSettion将失效
  customFrontSetting: {
    layout: 'default', // 布局，'default' | 'side' | 'top'
    theme: 'light', // 主题，dark | linght
    // showHistoryStack: '0', // 是否显示历史浏览组件 '0' | '1'
    popType: 'drawer', // 弹窗还是抽屉显示, 'window' | 'drawer'
    primaryColor: '#722ED1' // 主题配色设置 值为 null | 颜色值，例如’#722ED1‘
  },
  tokenExpire: 2 * 24 * 60 * 60 // token 失效时间，单位：s
}
export default baseConfig
