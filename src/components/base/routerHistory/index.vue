<template>
  <router-stack :list="list" />
</template>

<script>
import myMixin from './mixin'
import RouterStack from '@/components/base/RouterStack'
export default {
  name: 'routerHistory',
  mixins: [myMixin],
  components: {
    RouterStack
  }
}
</script>

<style lang="less" scoped>

</style>
