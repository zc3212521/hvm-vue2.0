<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb  /></div>
    <search-form :formOptions="searchFormItem" @onSearch="handleSubmit" @onReset="handleReset"/>
    <div class="content-bottom-section">
      <a-spin :spinning="false" style="text-align: center;width: 100%;">
        <a-table
          :columns="columns"
          :dataSource="data"
          :pagination="pagination"
          rowKey="id"
          @change="handleTableChange"
        >
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import SearchForm from '@/components/business/SearchForm'

import { queryAllSysGlobalAreaPage } from '@/http/system'

export default {
  name: 'regionalConfig',
  components: {
    Breadcrumb,
    SearchForm
  },
  data () {
    return {
      flod: true,
      data: [],
      columns: [
        {},
        { title: '区域名称', dataIndex: 'areaName', key: 'areaName' },
        { title: '区域编码', dataIndex: 'areaCode', key: 'areaCode' },
        {
          title: '区域类型',
          dataIndex: 'areaTypeTransName',
          key: 'areaTypeTransName'
        },
        {}
      ],
      searchFormItem: [
        {
          label: '区域名称',
          decorator: ['areaName']
        },
        {
          label: '区域编号',
          decorator: ['areaCode'],
          placeholder: '请输入区域编号（查询条件为后模糊匹配）'
        }
      ],
      pagination: {},
      searchParams: {},
      form: this.$form.createForm(this, {}),
      addForm: this.$form.createForm(this, {})
    }
  },
  created () {
    this.getData()
  },
  methods: {
    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getData()
    },

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
     * @param {type}
     * @return:
     */
    handleSubmit (values) {
      this.searchParams = values
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.getData()
    },

    /**
     * @description:重置筛选
     * @param {type}
     * @return:
     */
    handleReset () {
      this.handleSubmit(null)
    },
    /**
     * @description: 获取所有区域
     * @param {type}
     * @return:
     */
    getData () {
      const pagination = this.pagination
      const params = this.searchParams
      queryAllSysGlobalAreaPage(params, pagination).then(res => {
        this.data = res.data.records
        this.pagination = res.pagination
      })
    }
  }
}
</script>
