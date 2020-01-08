<template>
  <div class="home-wrap">
    <template v-if="!loading">
      <template v-if="layoutMode === 'default'">
        <layout-default />
      </template>

      <template v-else-if="layoutMode === 'side'">
        <layout-side />
      </template>

      <template v-else>
        <layout-top />
      </template>

      <template v-if="showFrontSetting">
        <front-setting />
      </template>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import LayoutSide from './layout-side'
import LayoutDefault from './layout-default'
import LayoutTop from './layout-top'
import { mapState, mapActions, mapGetters } from 'vuex'
import FrontSetting from '@/components/base/FrontSetting.vue'
import baseConfig from '@/baseConfig'

import { getCurrentUserMenuList, getCurrentUserAllAuthList, getLoginedUserInfo } from '@/http/common'
import { formatAuth, getMenuWithoutRoot, getMenuNameArr, getTopMenuFirstChildMenu, hasVisitPermission, getToken } from '@/utils/auth'
import { getCurrentDicts } from '@/utils'

export default {
  name: 'home',
  components: {
    LayoutSide,
    LayoutDefault,
    LayoutTop,
    FrontSetting
  },
  beforeRouteUpdate (to, from, next) {
    if (to.path === '/login' || to.path === '/' || to.name.indexOf('system_exception') >= 0) {
      this.initDicts(to, next)
    } else {
      let toRouteName = to.name
      // 如果是第一级，则默认跳转到有权限的第一个route
      let topMenuFirstChild = getTopMenuFirstChildMenu(to.redirectedFrom, this.menu)
      // 如果是首页，就一层菜单，直接跳转就；其他的顶层菜单，跳转下面的子菜单
      if (topMenuFirstChild) {
        this.initDicts(to, next, {
          name: topMenuFirstChild
        })
      } else {
        let nameArr = getMenuNameArr(toRouteName)
        if (hasVisitPermission(nameArr, this.auth)) {
          this.initDicts(to, next)
        } else {
          // this.$message.error('暂无权限访问此页面！')
          next({
            name: 'system_exception_404_list'
          })
        }
      }
    }
  },
  data () {
    return {
      loading: true,
      visible: false,
      showFrontSetting: baseConfig.frontSetting
    }
  },
  created () {
    window.less.modifyVars({
      '@primary-color': baseConfig.primaryColor || this.primaryColor
    })
    this.init()
  },
  computed: {
    ...mapState({
      layoutMode: state => state.layoutMode,
      menu: state => state.permission.userMenu,
      auth: state => state.permission.userAuth,
      primaryColor: state => state.frontSettings.primaryColor
    }),
    ...mapGetters([
      'getCurrentPageDicts'
    ])
  },
  watch: {
    primaryColor (val) {
      window.less.modifyVars({
        '@primary-color': val
      })
    }
  },
  methods: {
    init () {
      if (!getToken()) {
        this.$router.push({
          path: '/login'
        })
      } else {
        if (!this.menu || this.menu.length <= 1) {
          Promise.all([getCurrentUserMenuList(), getCurrentUserAllAuthList(), getLoginedUserInfo(), this.generateDict()]).then(res => {
            let menuRes = res[0]
            let authRes = res[1]
            let userInfo = res[2]

            this.updateUserInfo(userInfo.data)
            this.updateCurrentPageDict(this.$route.meta.dicts).then(() => {
              Vue.prototype.$dict = getCurrentDicts()
              let userMenu = []
              let userAuth = []
              formatAuth(menuRes.data, userMenu)
              formatAuth(authRes.data, userAuth)
              userMenu = getMenuWithoutRoot(userMenu)
              this.generateMenuAndAuth([userMenu, userAuth]).then(() => {
                this.loading = false
                if (this.$route.name === 'home') {
                  this.$router.push({ name: this.menu[0].name })
                }
              })
            })
          }).catch(err => {
            console.log('promise error', err)
          })
        } else {
          this.loading = false
          this.$router.push({ name: this.menu[0].name })
        }
      }
    },
    initDicts (to, callback, param) {
      let dictsKeys = to.meta.dicts ? to.meta.dicts.join(',') : ''
      if (dictsKeys.length) {
        this.generateSomeDict(dictsKeys).then(() => {
          this.updateCurrentPageDict(to.meta.dicts)
        }).then(() => {
          if (param) {
            callback(param)
          } else {
            callback()
          }
        })
      } else {
        if (param) {
          callback(param)
        } else {
          callback()
        }
      }
    },
    showDrawer () {
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    changeLayout (type) {
      this.updateLayoutMode(type)
    },
    ...mapActions([
      'updateLayoutMode',
      'generateMenuAndAuth',
      'updateUserInfo',
      'generateDict',
      'updateCurrentPageDict',
      'generateSomeDict'
    ])
  }
}
</script>

<style lang="less" scoped>
  .home-wrap .ant-layout {
    min-height: 100%;
  }
  .home-wrap {
    height: 100%;
    position: relative;
    .header {
      background-color: #fff;
      .header-search {
        padding: 0 12px;
        height: 64px;
        line-height: 64px;
        vertical-align: middle;
        overflow: hidden;
      }
    }
  }
</style>
<style scoped>
  .home-wrap >>> .ant-spin-container {
    height: 100%;
  }
</style>
<style>
  .global-header-right {
    position: absolute;
    height: 64px;
    display: inline-block;
    line-height: 64px;
    top: 0;
    right: 0;
    color: #fff;
  }
</style>
