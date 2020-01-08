<template>
  <div>
    <template v-if="layoutMode === 'default'">
      <a-layout style="min-height: 100%;">
        <a-layout-sider width="200" style="background: #fff">
          <a-menu :theme="theme"
                   mode="inline"
                  :defaultSelectedKeys="defaultSelectedMenu"
                  :style="{ height: '100%', borderRight: 0, paddingTop: '15px' }">
              <a-menu-item key="homePage">
                <router-link to="/homePage">
                  <my-icon type="iconshouye" />
                  <span>首页</span>
                </router-link>
              </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-content>
            <div class="view-history" v-if="showHistoryStack === '1'">
              <router-history />
            </div>
            <div class="layout-content" :style="{height: 'calc(100% - 100px)'}">
              <router-view />
            </div>
          </a-layout-content>
          <layout-footer />
        </a-layout>
      </a-layout>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import RouterHistory from '@/components/base/routerHistory'
import LayoutFooter from '@/components/base/LayoutFooter'
import { mapState } from 'vuex'

export default {
  name: 'myMain',
  components: {
    RouterHistory,
    LayoutFooter
  },
  data () {
    return {
      layoutMode: localStorage.getItem('layoutMode') || 'defalut',
      defaultSelectedMenu: ['homePage']
    }
  },
  computed: mapState({
    showHistoryStack: state => state.frontSettings.showHistoryStack,
    theme: state => state.frontSettings.theme
  })
}
</script>

<style lang="less" scoped>
  .layout-content {
    margin: 20px 24px;
  }
  .view-history {
    margin-top: 5px;
  }
</style>
