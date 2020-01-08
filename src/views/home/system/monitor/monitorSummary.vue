<template>
  <div>
    <echarts-pie :chartWidth="'50%'"
                 :chartHeight="'400px'"
                 :chartTitle="'磁盘使用'"
                 :chartData="disks"
                 :tooltipFormat="'{a} <br/>{b} : {c} G ({d}%)'"
                  style="float: left">
    </echarts-pie>
    <echarts-pie :chartWidth="'50%'"
                 :chartHeight="'400px'"
                 :chartTitle="'系统 CPU 使用'"
                 :chartData="cpu"
                 :tooltipFormat="'{a} <br/>{b} : {d}%'"
                 style="float: left">
    </echarts-pie>
    <echarts-pie :chartWidth="'50%'"
                 :chartHeight="'400px'"
                 :chartTitle="'process CPU 使用'"
                 :chartData="process"
                 :tooltipFormat="'{a} <br/>{b} : {d}%'"
                 style="float: left">
    </echarts-pie>
    <echarts-pie :chartWidth="'50%'"
                 :chartHeight="'400px'"
                 :chartTitle="'JVM内存使用'"
                 :chartData="memorys"
                 :tooltipFormat="'{a} <br/>{b} : {c} G ({d}%)'"
                 style="float: left">
    </echarts-pie>
  </div>
</template>

<script>

import EchartsPie from '@com/business/EchartsPie.vue'
import { getSysGlobalInstanceHealth, getSysGlobalInstanceMetricsByName } from '@/http/system'

export default {
  name: 'monitorSummary',
  components: { EchartsPie },
  data () {
    return {
      form: this.$form.createForm(this, {}),
      metrics: [],
      disks: [],
      cpu: [],
      memorys: [],
      process: [],
      jvmMemoryUsed: 0
    }
  },
  created () {
    this.getHealth()
    this.getMetricsByName('jvm.memory.used')
    this.getMetricsByName('system.cpu.usage')
    this.getMetricsByName('process.cpu.usage')
  },
  methods: {
    getHealth () {
      let params = {
        instIp: this.$route.query.ip,
        instPort: this.$route.query.port,
        instCtx: this.$route.query.ctx
      }
      getSysGlobalInstanceHealth(params, null).then(
        res => {
          if (res.data.code === 99998 || res.data.code === 99999) {
            this.$message.error(res.data.msg)
          } else {
            this.disks.push({
              name: 'disk.used',
              value: this.unitByteToG(res.data.details.diskSpace.details.total - res.data.details.diskSpace.details.free)
            })
            this.disks.push({ name: 'disk.free', value: this.unitByteToG(res.data.details.diskSpace.details.free) })
          }
        }
      )
    },
    unitByteToG (byt) {
      return byt ? (byt / 1024 / 1024 / 1024).toFixed(2) : 0
    },
    getMetricsByName (requiredMetricsName) {
      let params = {
        instIp: this.$route.query.ip,
        instPort: this.$route.query.port,
        instCtx: this.$route.query.ctx
      }
      let urlParams = {
        requiredMetricName: requiredMetricsName
      }
      getSysGlobalInstanceMetricsByName(params, urlParams).then(
        res => {
          if (res.data.code === 99998 || res.data.code === 99999) {
            this.$message.error(res.data.msg)
          } else {
            this.metrics.push(res.data)
            if (requiredMetricsName === 'jvm.memory.max') {
              this.memorys.push({
                name: 'jvm.memory.free',
                value: this.unitByteToG(res.data.measurements[0].value - this.jvmMemoryUsed)
              })
            } else if (requiredMetricsName === 'jvm.memory.used') {
              this.memorys.push({ name: res.data.name, value: this.unitByteToG(res.data.measurements[0].value) })
              this.jvmMemoryUsed = res.data.measurements[0].value
              this.getMetricsByName('jvm.memory.max')
            } else if (requiredMetricsName === 'system.cpu.usage') {
              this.cpu.push({ name: res.data.name, value: res.data.measurements[0].value })
              this.cpu.push({ name: 'system.cpu.free', value: 1 - res.data.measurements[0].value })
            } else if (requiredMetricsName === 'process.cpu.usage') {
              this.process.push({ name: res.data.name, value: res.data.measurements[0].value })
              this.process.push({ name: 'other', value: 1 - res.data.measurements[0].value })
            }
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
</style>
