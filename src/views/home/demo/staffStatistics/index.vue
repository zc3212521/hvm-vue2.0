<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb  /></div>
    <h-top-bar
      @handleSearch="handleSubmit"
      @handleReset="handleReset"
      :canFlod="false"
    >
      <a-form :form="form">
        <a-row :gutter="24">
          <a-col :span="'11'">
            <a-form-item
              label="选择部门"
              :label-col="{ span: 6 }"
              :wrapper-col="{ span: 18 }">
              <a-select
                v-decorator="['orgId']"
                placeholder="请选择部门">
                <a-select-option
                  :value="item.orgId"
                  v-for="(item,index) in firstLevelOrgList"
                  :key="index">
                  {{item.orgName}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </h-top-bar>
    <div class="chart-wrap">
      <echarts-pie :chartWidth="'100%'"
                  :chartHeight="'400px'"
                  :chartTitle="'员工数量分布图'"
                  :chartData="chartData">
      </echarts-pie>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import HTopBar from '@com/business/HTopBar.vue'
import EchartsPie from '@com/business/EchartsPie.vue'
import { getFirstLevelOrgList, getStaffStatisticsChartData } from '@/http/system'
export default {
  name: 'statisticsChart',
  components: {
    HTopBar,
    Breadcrumb,
    EchartsPie
  },
  data () {
    return {
      staffChart: null,
      chartData: [],
      form: this.$form.createForm(this, {}),
      orgId: null,
      loading: false,
      firstLevelOrgList: []
    }
  },
  mounted () {
    // 加载部门下拉框
    this.getSelectList()
    // 加载图表数据
    this.getData()
  },
  methods: {
    getSelectList () {
      getFirstLevelOrgList()
        .then(res => {
          this.firstLevelOrgList = res.data
        })
        .catch(error => {
          console.log(error) // 非200触发，无特殊操作可省略
        })
    },
    getData () {
      const params = {
        orgId: this.orgId
      }
      getStaffStatisticsChartData(params)
        .then(res => {
          this.chartData = res.data
        })
        .catch(error => {
          console.log(error) // 非200触发，无特殊操作可省略
        })
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.orgId = values.orgId
          this.getData()
        }
      })
    },
    /**
     * @description:重置筛选
     * @return:
     */
    handleReset () {
      this.form.resetFields()
      this.orgId = null
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
  .chart-wrap {
    padding: 24px;
    background-color: #fff;
  }
</style>
