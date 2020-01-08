<template>
  <div class="wrap">
    <img :src="img" width="600" height="450"/>
  </div>
</template>

<script>
import img from '@/assets/images/404.png'
export default {
  name: 'notFound',
  data () {
    return {
      img
    }
  }
}
</script>

<style lang="less" scoped>
  .wrap {
    background-color: #fff;
    height: 100%;
    text-align: center;
    img {
      margin: 50px auto;
    }
  }
</style>
