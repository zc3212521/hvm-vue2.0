import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import frontSettings from './modules/frontSetting'
import orgstructure from './modules/orgstructure'
import { getGlobalDict, getSomeDict } from '@/http/common'
import { deepClone } from '@/utils'

import baseConfig from '@/baseConfig'
const { frontSetting, customFrontSetting } = baseConfig
const { layout } = customFrontSetting

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dicts: [],
    currentPageDicts: [],
    routerStack: [],
    routerStackLength: parseInt(localStorage.getItem('routerStackLength')) || 5,
    layoutMode: frontSetting ? (localStorage.getItem('layoutMode') || 'default') : layout,
    ifLogin: false,
    userInfo: null,
    globalLoading: false
  },
  modules: {
    permission,
    frontSettings,
    orgstructure
  },
  mutations: {
    setLayoutMode (state, mode) {
      state.layoutMode = mode
    },
    setDict (state, options) {
      let originOptions = state.dicts
      let result = deepClone(options)
      options.forEach((item, i) => {
        originOptions.forEach((it, n) => {
          if (Object.keys(item)[0] !== Object.keys(it)[0]) {
            let keyArr = result.map(item => {
              return Object.keys(item)[0]
            })
            if (!keyArr.includes(Object.keys(it)[0])) {
              result.push(it)
            }
          }
        })
      })
      state.dicts = result
    },
    setCurrentPageDict (state, options) {
      let result = []
      options.forEach(item => {
        state.dicts.forEach(it => {
          if (Object.keys(it)[0] === item) {
            result.push(it)
          }
        })
      })
      state.currentPageDicts = result
    },
    setRouterStack (state, route) {
      let ifInStack = false
      state.routerStack.forEach((item) => {
        if (item.name === route.name) {
          ifInStack = true
        }
      })
      if (ifInStack) return
      if (state.routerStack.length >= state.routerStackLength) {
        state.routerStack.shift()
      }
      state.routerStack.push(route)
    },
    removeRouterStack (state, routeName) {
      let routerStack = deepClone(state.routerStack)
      let i = routerStack.findIndex((value) => {
        return value.name === routeName
      })
      routerStack.splice(i, 1)
      state.routerStack = routerStack

      // 当前显示的页面和关闭的页面相同，则路由跳转到上一个
      if (routerStack.length > 0 && window.vm.$route.name === routeName) {
        let target = routerStack[routerStack.length - 1]
        window.vm.$router.push({
          name: target.name,
          params: target.params
        })
      }
    },
    clearRouterStack (state) {
      state.routerStack = []
    },
    setRouterStackLength (state, num) {
      state.routerStackLength = num
    },
    setLoginStatus (state, status) {
      state.ifLogin = status
    },
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    setLoading (state, status) {
      state.globalLoading = status
    }
  },
  actions: {
    generateDict ({ commit }) {
      return new Promise(resolve => {
        getGlobalDict().then(res => {
          let options = res.data
          let optionsArr = Object.keys(options).map(item => ({ [item]: options[item] }))
          commit('setDict', optionsArr)
          resolve()
        })
      })
    },
    generateSomeDict ({ commit }, types) {
      return new Promise((resolve, reject) => {
        if (!types) {
          reject(new Error('字典项修改参数错误'))
        } else {
          getSomeDict({
            groups: types
          }).then(res => {
            let options = res.data
            let optionsArr = Object.keys(options).map(item => ({ [item]: options[item] }))
            commit('setDict', optionsArr)
            resolve()
          })
        }
      })
    },
    updateCurrentPageDict ({ commit }, options = []) {
      commit('setCurrentPageDict', options)
    },
    updateRouterStack ({ commit }, route) {
      commit('setRouterStack', route)
    },
    removeOneRouter ({ commit }, routeName) {
      commit('removeRouterStack', routeName)
    },
    setClearRouterStack ({ commit }) {
      commit('clearRouterStack')
    },
    updateLayoutMode ({ commit }, mode) {
      localStorage.setItem('layoutMode', mode)
      commit('setLayoutMode', mode)
    },
    updateRouterStackLength ({ commit }, num) {
      localStorage.setItem('routerStackLength', num)
      commit('setRouterStackLength', num)
    },
    updateLoginStatus ({ commit }, status) {
      commit('setLoginStatus', status)
    },
    updateUserInfo ({ commit }, userInfo) {
      commit('setUserInfo', userInfo)
    },
    updateLoading ({ commit }, status) {
      commit('setLoading', status)
    }
  },
  getters: {
    // 获取指定字典项
    getDicts: (state) => (types) => {
      if (!(types instanceof Array)) {
        console.error('字典项获取参数错误')
        return
      }
      let result = []
      types.forEach((item, i) => {
        state.dicts.forEach((it, n) => {
          if (Object.keys(it)[0] === item) {
            result.push(state.dicts[n])
          }
        })
      })
      return result
    },
    getRouterStack: (state) => {
      return state.routerStack
    },
    getLayoutMode: (state) => {
      return state.layoutMode
    },
    getLoginStatus: (state) => {
      return state.ifLogin
    },
    getUserInfo: (state) => {
      return state.userInfo
    },
    getCurrentPageDicts: (state) => {
      return state.currentPageDicts
    },
    getLoading: (state) => {
      return state.globalLoading
    }
  }
})
