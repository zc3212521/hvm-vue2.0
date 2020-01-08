<!--侧边布局组件-->
<template>
  <a-menu :theme="theme"
          mode="inline"
          :selectedKeys="selectedKey"
          :openKeys="openKey"
          @openChange="toggleOpenKey"
          v-if="selectedKey !== ''"
          :style="{ height: '100%', borderRight: 0, paddingTop: '15px' }">
    <template v-for="item in routeData">
      <a-menu-item v-if="!item.children || item.children.length === 0"
                   :key="item.name">
        <router-link :to="{ path: item.path }">
          <my-icon :type="item.meta.icon"/>
          <span>{{ item.meta.title }}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu v-else
                  :key="item.name">
        <span slot="title">
          <my-icon :type="item.meta.icon"/>{{ item.meta.title }}
        </span>
        <a-menu-item v-for="it in item.children"
                     :key="it.name">
          <router-link :to="{ path: it.path }">
            <span>{{ it.meta.title }}</span>
          </router-link>
        </a-menu-item>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script>
import { mapState } from 'vuex'
import { getMenuNameArr } from '@/utils/auth'

export default {
  name: 'sideMenu',
  data () {
    return {
      routeData: [],
      currentMenuArr: this.$route.path.split('/').slice(1),
      openKey: [],
      selectedKey: ''
    }
  },
  mounted () {
    this.updateMenu()
  },
  computed: {
    routerName () {
      return this.$route.name
    },
    ...mapState({
      theme: state => state.frontSettings.theme,
      menu: state => state.permission.userMenu
    })
  },
  watch: {
    routerName: function () {
      this.updateMenu()
    },
    menu: function () {
      this.updateMenu()
    }
  },
  methods: {
    toggleOpenKey (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKey.indexOf(key) === -1)
      this.openKey = latestOpenKey ? [latestOpenKey] : []
    },
    updateMenu () {
      this.menu.forEach(item => {
        if (this.routerName.indexOf(item.name) >= 0) {
          this.routeData = item.children || []
        }
      })
      let currentMenuNameArr = getMenuNameArr(this.routerName)
      this.selectedKey = currentMenuNameArr
      this.openKey = currentMenuNameArr
    }
  }
}
</script>

<style lang="less" scoped>
</style>
