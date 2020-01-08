<!--菜单组件-->
<template>
  <a-layout style="min-height: 100%;">
    <a-layout-sider width="200" style="background: #fff">
      <side-menu />
    </a-layout-sider>
    <a-layout>
      <a-layout-content>
        <div class="view-history" v-if="showHistoryStack === '1'">
          <router-history />
        </div>
        <div class="layout-content" :style="{height: 'calc(100% - 100px)'}">
          <slot></slot>
        </div>
      </a-layout-content>
      <layout-footer />
    </a-layout>
  </a-layout>
</template>

<script>
import SideMenu from '@/components/base/SideMenu'
import RouterHistory from '@/components/base/routerHistory'
import LayoutFooter from '@/components/base/LayoutFooter'
import { mapState } from 'vuex'

export default {
  name: 'HMenu',
  components: {
    SideMenu,
    RouterHistory,
    LayoutFooter
  },
  computed: mapState({
    showHistoryStack: state => state.frontSettings.showHistoryStack
  })
}
</script>

<style lang="less">
  .layout-content {
    margin: 20px 24px;
  }
  .view-history {
    margin-top: 5px;
  }
</style>
