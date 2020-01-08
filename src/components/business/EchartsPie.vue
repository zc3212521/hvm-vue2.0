<!--
 * echarts饼状图组件
 * @Param id 组件自动生成，无需传入
 * @Param chartWidth 图表宽度，支持百分比 默认 100%
 * @Param chartHeight 图表高度，支持百分比 默认400px
 * @Param chartTitle 图表标题 默认‘饼状图’
 * @Param chartSubTitle 图表子标题 默认为空
 * @Param chartData 图表数据，必传
 * @Param tooltipFormat 图表tooltip显示数据格式
 * 前提：使用时，需要引入组件：import EchartsPie from '@com/business/EchartsPie.vue'
 * 使用示例：参见demo管理-员工统计
 -->
<template>
  <div :id="id"
       :style="{width: chartWidth, height: chartHeight}"></div>
</template>

<script>
import echarts from 'echarts'
import { mapState } from 'vuex'
import { echartsColors } from '@/utils/config'

export default {
  name: 'echartsPie',

  components: {},

  props: {
    chartWidth: {
      type: String,
      default: '400px'
    },
    chartHeight: {
      type: String,
      default: '100%'
    },
    chartTitle: {
      type: String,
      default: '饼状图'
    },
    chartSubTitle: {
      type: String,
      default: ''
    },
    chartData: {
      type: Array,
      required: true
    },
    tooltipFormat: {
      type: String,
      default: '{a} <br/>{b} : {c} ({d}%)'
    }
  },

  data () {
    return {
      id: '',
      myChart: null,
      themeColor: []
    }
  },
  computed: {
    ...mapState({
      primaryColor: state => state.frontSettings.primaryColor
    })
  },

  watch: {
    chartData: {
      handler (newValue, oldValue) {
        // 数据变化时，刷新图表
        this.chartInit()
      }
    },
    primaryColor (val) {
      this.themeColor = echartsColors[val]
      this.chartInit()
    }
  },
  created () {
    this.id = this.genID(4)
  },

  mounted () {
    this.myChart = echarts.init(document.getElementById(this.id))
    this.themeColor = echartsColors[localStorage.getItem('primaryColor')]
    this.chartInit()
  },
  /**
   * 销毁组件
   */
  beforeDestroy () {
    if (!this.myChart) {
      return
    }
    this.myChart.dispose()
    this.myChart = null
  },

  methods: {
    genID (length) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    },
    /**
     * 初始化图表
     */
    chartInit () {
      this.myChart.clear()
      // 饼图属性配置
      let option = {
        toolbox: {
          show: false, // 暂不显示
          feature: {
            dataView: { readOnly: true }, // 数据视图
            saveAsImage: {} // 保存图片
          }
        },
        title: {
          text: this.chartTitle,
          // subtext: '饼状图', // 子标题
          x: 'center'
        },
        tooltip: { // 鼠标经过时，提示信息
          trigger: 'item',
          formatter: this.tooltipFormat
        },
        // 图例
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: this.chartTitle,
            type: 'pie',
            radius: '55%', // 饼图的半径
            center: ['50%', '55%'], // 饼图的中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
            data: this.chartData, // 饼图数据
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ],
        // 设置颜色，循环使用
        color: this.themeColor
      }
      this.myChart.setOption(option)
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
