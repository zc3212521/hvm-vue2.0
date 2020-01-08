<!--历史记录组件-->
<template>
  <div class="router-stack-wrap">
    <span
      v-for="(item, i) in list"
      :key="i"
      @click="goRouter(item, i)"
      :class="{ active: item.name === $route.name,shu: i == curr - 1}"
    >
      <span :style="{color: item.close ? '#000' : '#40a9ff'}">{{ item.title }}</span>
      <a-icon
        v-if="item.close"
        type="close"
        class="router-icon"
        @click.stop="filterRouter(item.name)"
      />
    </span>
  </div>
</template>

<script>
export default {
  name: 'routerStack',
  data () {
    return {
      curr: 1
    }
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  methods: {
    goRouter (item, i) {
      this.$router.push({
        name: item.name,
        params: item.params
      })
      this.curr = i
    },
    filterRouter (name) {
      this.$store.dispatch('removeOneRouter', name)
    }
  }
}
</script>

<style lang="less" scoped>
  .router-stack-wrap {
    height: 40px;
    padding: 0 24px;
    background-color: #fff;

    & > span {
      display: inline-block;
      height: 40px;
      line-height: 40px;
      padding: 0 16px;
      background-color: #fff;
      cursor: default;
      position:relative;
      &.shu{
        &::after{
          content: '';
          position: absolute;
          width: 0px;
          height: 14px;
          background: #ddd;
          top: 13px;
          right: 0;
        }
      }
      &::after{
        content: '';
        position: absolute;
        width: 1px;
        height: 14px;
        background: #ddd;
        top: 13px;
        right: 0;
      }
      &:hover, &.active {
        background-color: #f0f2f5;
        &::after{
          content: '';
          position: absolute;
          width: 0px;
          height: 14px;
          background: #ddd;
          top: 13px;
          right: 0;
        }

        & .router-icon {
          color: #ff0000;
        }
      }
    }
    .router-icon {
      margin-left: 8px;
      font-size: 10px;
      font-weight: bold;
      cursor: pointer;
    }
  }
</style>
