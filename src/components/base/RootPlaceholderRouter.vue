<template>
  <div>
    <template v-if="layoutMode === 'default'">
      <h-menu>
        <router-view />
      </h-menu>
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import HMenu from '@/components/base/HMenu.vue'
export default {
  name: 'rootPlaceholderRouter',
  components: {
    HMenu
  },
  data () {
    return {
      layoutMode: localStorage.getItem('layoutMode') || 'default'
    }
  }
}
</script>

<style lang="less" scoped>

</style>
