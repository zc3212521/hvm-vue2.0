import Vue from 'vue'
import Router from 'vue-router'
import { originChildren } from './getRoutes'

import { getCurrentDicts } from '@/utils'

import Home from '@/views/home/index'

Vue.use(Router)

export const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: {}
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: originChildren
  }
]

const router = new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (!to.name) {
    next({
      name: 'system_exception_404_list'
    })
  }
  next()
})
router.afterEach((to, from) => {
  if (window.vm) {
    // 登录页、首页不再路由栈范围内
    if (to.name === 'login' || to.name === 'home') {
      return
    }
    Vue.prototype.$dict = getCurrentDicts()
    window.vm.$store.dispatch('updateRouterStack', {
      name: to.name,
      title: to.meta.title,
      params: to.params
    })
  }
})

export default router
