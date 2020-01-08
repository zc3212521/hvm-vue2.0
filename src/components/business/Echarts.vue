<!--
echarts的vue封装
入参：option 同echarts的option
-->
<template>
  <div :id="id"></div>
</template>

<script>
import echarts from 'echarts'
import 'echarts/theme/macarons'

export default {
  name: 'echarts',

  mixins: [],

  components: {},

  props: {
    option: {
      required: true,
      type: Object
    }
  },

  data () {
    return {
      id: '',
      myChart: null
    }
  },
  computed: {},

  watch: {

  },

  created () {
    this.id = this.genID(4)
  },

  mounted () {
    this.myChart = echarts.init(document.getElementById(this.id), 'macarons')
    this.myChart.setOption(this.option)
  },

  destroyed () { },

  methods: {
    genID (length) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
