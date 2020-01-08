<template>
  <a-layout id="components-layout-demo-top-side">
    <a-layout-header class="header"
                     style="padding: 0;background-color: #fff;">
      <logo />
      <a-menu :theme="theme"
              mode="horizontal"
              :selectedKeys="[currentRouteKey]"
              :style="{ lineHeight: '64px' }">
        <a-menu-item v-for="item in menu"
                     :key="item.name">
          <router-link :to="{ name: item.name }"><my-icon :type="item.meta.icon" />{{ item.meta.title }}</router-link>
        </a-menu-item>
      </a-menu>
      <div class="global-header-right">
        <header-element />
      </div>
    </a-layout-header>
    <router-view style="min-height: calc(100% - 64px);" />
  </a-layout>
</template>

<script>
import HeaderElement from '@/components/business/HeaderElement'
import Logo from '@/components/business/HeaderLogo'
import { mapState } from 'vuex'
export default {
  name: 'layout-default',
  components: {
    HeaderElement,
    Logo
  },
  computed: {
    currentRouteKey: function () {
      return this.$route.name.split('_')[0]
    },
    ...mapState({
      theme: state => state.frontSettings.theme,
      menu: state => state.permission.userMenu
    })
  }
}
</script>

<style lang="less" scoped>
#components-layout-demo-top-side {
  height: 100%;
}
</style>
