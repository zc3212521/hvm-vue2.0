<!--系统标题logo-->
<template>
  <div class="logo-wrap" :class="theme === 'light' ? 'logo-light' : 'logo-dark'">
    <a href="/">
      <my-icon type="iconkejixitong" class="logo-img"/>
      <div class="logo-text">鸿冠管理系统</div>
    </a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'logo',
  computed: mapState({
    theme: state => state.frontSettings.theme
  }),
  methods: {
    goHome () {
      this.$router.push({
        name: 'layout'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .logo-wrap {
    width: 200px;
    height: 64px;
    float: left;
    overflow: hidden;
    margin-right: 16px;

    a {
      display: inline-block;
      height: 64px;
      width: 200px;
      overflow: hidden;
    }
    .logo-img {
      padding-left: 20px;
      font-size: 24px;
      line-height: 64px;
    }

    .logo-text {
      display: inline-block;
      margin: 0 0 0 15px;
      color: #fff;
      font-weight: 600;
      font-size: 20px;
      line-height: 64px;
    }
    &::after {
      content: ' ';
      clear: both;
    }
  }
</style>
