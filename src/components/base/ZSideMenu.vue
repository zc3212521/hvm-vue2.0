<!--自定义布局组件-->
<template>
  <a-menu
    :theme="theme"
    :mode="mode"
    :selectedKeys="selectedKey"
    :openKeys="openKey"
    @openChange="toggleOpenKey"
    v-if="selectedKey !== ''"
    :style="{ height: 'calc(100% - 64)px', borderRight: 0, paddingTop: '10px' }"
  >
    <template v-for="item in menu">
      <a-menu-item
        v-if="!item.children || item.children.length === 0"
        :key="item.name"
      >
        <router-link :to="{ name: item.name }">
          <my-icon :type="item.meta.icon" />
          <span>{{ item.meta.title }}</span>
        </router-link>
      </a-menu-item>
      <a-sub-menu
        v-else
        :key="item.name"
      >
        <span slot="title"><my-icon :type="item.meta.icon" />{{ item.meta.title }}</span>
        <template
          v-for="it in item.children"
        >
          <a-menu-item
            v-if="!it.children || it.children.length === 0"
            :key="it.name"
          >
            <router-link :to="{ name: it.name }">
              <my-icon :type="it.meta.icon" />
              <span>{{ it.meta.title }}</span>
            </router-link>
          </a-menu-item>
          <a-sub-menu
            v-else
            :key="it.name"
          >
            <span slot="title"><my-icon :type="it.meta.icon" />{{ it.meta.title }}</span>
            <a-menu-item
              v-for="subit in it.children"
              :key="subit.name"
            >
              <router-link :to="{ name: subit.name }">
                <span>{{ subit.meta.title }}</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<script>
import { mapState } from 'vuex'
import { getMenuNameArr } from '@/utils/auth'

export default {
  name: 'ZIndexMenu',
  props: {
    mode: {
      type: String,
      default: 'inline'
    }
  },
  data () {
    return {
      selectedKey: [],
      openKey: []
    }
  },
  created () {
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
    }
  },
  methods: {
    toggleOpenKey (openKeys) {
      const latestOpenKey = openKeys.find(key => this.openKey.indexOf(key) === -1)
      if (latestOpenKey) {
        if (latestOpenKey.split('_')[0] === this.openKey[0]) {
          openKeys = openKeys.filter(item => !item.includes('_')).concat(latestOpenKey)
          this.openKey = openKeys
        } else {
          this.openKey = latestOpenKey ? [latestOpenKey] : []
        }
      } else {
        this.openKey = openKeys
      }
    },
    updateMenu () {
      let currentMenuNameArr = getMenuNameArr(this.routerName)
      this.selectedKey = currentMenuNameArr
      this.openKey = currentMenuNameArr
    }
  }
}
</script>

<style lang="less" scoped>

</style>
