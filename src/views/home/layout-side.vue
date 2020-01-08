<template>
  <a-layout id="components-layout-side">
    <a-layout-sider width="200" :style="{backgroundColor: theme === 'dark' ? '#001529' : '#fff'}">
      <logo />
      <div style="clear: both;"></div>
      <z-side-menu
        style="padding-top: 15px;"
      />
    </a-layout-sider>
    <a-layout>
      <a-layout-header :style="{ background: '#fff', padding: 0 }" >
        <div class="global-header-right">
          <header-element @changeLayoutCB="changeLayout"/>
        </div>
      </a-layout-header>
      <a-layout-content>
        <div class="view-history" v-if="showHistoryStack === '1'">
          <router-history />
        </div>
        <div class="layout-content" :style="{height: 'calc(100% - 100px)'}">
          <router-view style="height: 100%;"/>
        </div>
      </a-layout-content>
      <layout-footer />
    </a-layout>
  </a-layout>
</template>

<script>
import HeaderElement from '@/components/business/HeaderElement'
import Logo from '@/components/business/HeaderLogo'
import ZSideMenu from '@/components/base/ZSideMenu'
import RouterHistory from '@/components/base/routerHistory'
import LayoutFooter from '@/components/base/LayoutFooter'
import { mapState } from 'vuex'

export default {
  name: 'layout-side.vue',
  components: {
    Logo,
    ZSideMenu,
    HeaderElement,
    RouterHistory,
    LayoutFooter
  },
  data () {
    return {
      layout: 'side'
    }
  },
  methods: {
    changeLayout (type) {
      this.layout = type
    }
  },
  computed: mapState({
    theme: state => state.frontSettings.theme,
    showHistoryStack: state => state.frontSettings.showHistoryStack,
    menu: state => state.permission.userMenu
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
