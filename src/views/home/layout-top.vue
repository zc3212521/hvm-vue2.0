<template>
  <a-layout id="components-layout-top">
    <a-layout-header :class="{'light-theme': theme !== 'dark'}">
      <logo />
      <z-side-menu
        mode="horizontal"
      />
      <div class="global-header-right">
        <header-element />
      </div>
    </a-layout-header>
    <a-layout-content style="padding-right: 50px;padding-left: 50px;">
      <div class="view-history" v-if="showHistoryStack === '1'">
        <router-history />
      </div>
      <div :style="{margin: layoutMode=== 'top'? '20px 0' : '20px 24px'}">
        <router-view />
      </div>
    </a-layout-content>
    <layout-footer />
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
  computed: mapState({
    layoutMode: state => state.layoutMode,
    theme: state => state.frontSettings.theme,
    showHistoryStack: state => state.frontSettings.showHistoryStack
  })
}
</script>

<style lang="less" scoped>
  .view-history {
    margin-top: 5px;
  }
  .light-theme {
    color: rgba(255, 255, 255, 0.65);
    background: #fff;
  }
</style>
