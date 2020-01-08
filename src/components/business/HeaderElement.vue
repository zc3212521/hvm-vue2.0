<!--
头部右侧组件，非业务组件
-->
<template>
  <div class="header-element-wrap" :style="{margin: layoutMode === 'top' ? '0 50px' : '0 24px'}" :class="{dark: theme === 'dark' && layoutMode !== 'side'}">
    <h-avatar />
  </div>
</template>

<script>
import HAvatar from '@/components/base/HAvatar.vue'
import { mapState } from 'vuex'
export default {
  name: 'headerElement',
  components: {
    HAvatar
  },
  data () {
    return {
    }
  },
  methods: {
    changeLayout (type) {
      this.$store.dispatch('updateLayoutMode', type)
    },
    gotoHome () {
      this.$router.push({
        name: 'homePage'
      })
    }
  },
  computed: mapState({
    theme: state => state.frontSettings.theme,
    layoutMode: state => state.layoutMode
  })
}
</script>

<style lang="less" scoped>
  .header-element-wrap {
    color: #001529;

    & > span {
      display: inline-block;
      padding: 0 12px;
      cursor: pointer;
      height: 64px;
      line-height: 64px;
      vertical-align: middle;
      overflow: hidden;
      font-size: 16px;
    }
    &.dark {
      color: #fff;
    }
  }
</style>
