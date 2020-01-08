import '@babel/polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { log } from '@/utils'
import { baseUrl } from '@/base/axios'

import './helper/filter'
import myPlugin from './helper/plugin'
import './base/antd-vue-config.js'
import './base/icon'

process.env.NODE_ENV === 'mock' && require('./mock/index.js')

Vue.config.productionTip = false

if (process.env.NODE_ENV !== 'production') {
  log('%c 当前接口地址：' + baseUrl, 'color: #1a6dd8')
  log('%c 当前运行环境：%c' + process.env.NODE_ENV, 'color: #1a6dd8', 'color: red')
  Vue.config.performance = true
}

Vue.use(myPlugin)

window.vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
