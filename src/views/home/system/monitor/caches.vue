<template>
  <div>
    <h-top-bar
      @handleSearch="handleSubmit"
      @handleReset="handleReset"
      @toggleFlod="toggleFlod"
      :canFlod="false"
    >
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col
            :span="flod ? '11' : '8'"
            v-for="item in searchFormItem"
            :key="item.id"
          >
            <custom-form-item
              :item="item"
              :formInlineItemLayout="{
                labelCol: { span: 6 },
                wrapperCol: { span: 18 }
              }"
              inline-style=""
            >
            </custom-form-item>
          </a-col>
        </a-row>
      </a-form>
    </h-top-bar>
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="data"
      :pagination="pagination"
      @change="handleTableChange"
    >
    </a-table>
  </div>
</template>

<script>

import HTopBar from '@com/business/HTopBar.vue'
import CustomFormItem from '@com/business/CustomFormItem'
import {
  getSysGlobalInstanceMetrics,
  getSysGlobalInstanceEnvByProp,
  getSysGlobalInstanceMetricsByName,
  getSysGlobalInstanceRedis
} from '@/http/system'

export default {
  name: 'caches',
  components: { HTopBar, CustomFormItem },
  data () {
    return {
      flod: true,
      searchFormItem: [],
      form: this.$form.createForm(this, {}),
      size: 50,
      pages: 1,
      total: 0,
      columns: [
        { title: 'name', dataIndex: 'name' },
        { title: 'value', dataIndex: 'value' }
      ],
      data: [],
      initData: [],
      tempData: []
    }
  },
  computed: {
    /**
     * @description: 页码条数实时响应
     * @return:
     */
    pagination () {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        pageSize: this.size,
        current: this.pages,
        total: Number(this.total)
      }
    }
  },
  created () {
    this.searchFormItem = [
      {
        label: '监控指标',
        decorator: ['content'],
        placeholder: '请输入监控指标，同时匹配各列指标信息'
      }
    ]
    this.getEnvProp('spring.cache.type')
  },
  methods: {
    /**
     * @description: 展开筛选项
     * @param {Boolean} flod
     * @return:
     */
    toggleFlod (flod) {
      this.flod = flod
    },

    /**
     * @description: 筛选
     * @return:
     */
    handleSubmit () {
      this.pages = 1
      let content = this.form.getFieldValue('content')
      if (content !== undefined && content !== '') {
        this.tempData = []
        for (let idx in this.initData) {
          let obj = this.initData[idx]
          for (let key in obj) {
            let val = obj[key] + ''
            if (val.toLowerCase().indexOf(this.form.getFieldValue('content').toLowerCase()) !== -1) {
              this.tempData.push(obj)
              break
            }
          }
        }
        [...this.data] = this.tempData
      } else {
        [...this.data] = this.initData
      }
      this.total = this.data.length
    },

    /**
     * @description:重置筛选
     * @param {type}
     * @return:
     */
    handleReset () {
      // this.$refs.addForm.form.resetFields()
      this.form.resetFields()
      this.handleSubmit()
    },
    /**
     * @description: 点击页码和条数
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.size = pageSize
      this.pages = current
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
          let measure = res.data.measurements
          let value = 0
          if (measure && Object.prototype.toString.call(measure) === '[object Array]' && measure.length > 0) {
            value = measure[0].value
          }
          this.initData.push({ name: res.data.name, value: value })
          this.data.push({ name: res.data.name, value: value })
          this.total = this.data.length
        }
      )
    },
    getRedis () {
      let params = {
        instIp: this.$route.query.ip,
        instPort: this.$route.query.port,
        instCtx: this.$route.query.ctx
      }
      getSysGlobalInstanceRedis(params, null).then(
        res => {
          if (res.data.code === 99998 || res.data.code === 99999) {
            this.$message.error(res.data.msg)
          } else {
            for (let key in res.data) {
              this.initData.push({ name: key, value: res.data[key] })
            }
            [...this.data] = this.initData
            this.total = this.data.length
          }
        }
      )
    },
    getMetrics () {
      let params = {
        instIp: this.$route.query.ip,
        instPort: this.$route.query.port,
        instCtx: this.$route.query.ctx
      }
      getSysGlobalInstanceMetrics(params, null).then(
        res => {
          if (res.data.code === 99998 || res.data.code === 99999) {
            this.$message.error(res.data.msg)
          } else {
            for (let metricsName of res.data.names) {
              if (this.startWith(metricsName, 'cache.')) {
                this.getMetricsByName(metricsName)
              }
            }
          }
        }
      )
    },
    getEnvProp (toMatch) {
      let params = {
        instIp: this.$route.query.ip,
        instPort: this.$route.query.port,
        instCtx: this.$route.query.ctx
      }
      let urlParams = {
        toMatch: toMatch
      }
      getSysGlobalInstanceEnvByProp(params, urlParams).then(
        res => {
          if (res.data.code === 99998 || res.data.code === 99999) {
            this.$message.error(res.data.msg)
          } else {
            let cacheType = res.data.property.value
            this.initData.push({ name: 'cache.type', value: cacheType, desc: cacheType })
            this.total = 1
            if (cacheType === 'ehcache') {
              this.getMetrics()
            } else if (cacheType === 'redis') {
              this.getRedis()
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
