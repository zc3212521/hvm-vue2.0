<template>
  <div class="h-content-wrap">
    <h-top-bar @handleSearch="search" @handleReset="reset" @toggleFlod="toggleFlod">
      <a-form :form="searchForm">
        <a-row :gutter="24">
          <a-col :span="flod ? '11' : '7'">
            <a-form-item label="操作名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
              <dict-item-select-element v-decorator="['operCode']" :groupCode="'operCode'" placeholder="请选择操作模块名称" />
            </a-form-item>
          </a-col>
          <a-col :span="flod ? '11' : '7'">
            <a-form-item label="来源IP" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input placeholder="请输入来源IP" v-decorator="['operIp']"/>
            </a-form-item>
          </a-col>
          <a-col :span="flod ? '11' : '10'">
            <a-form-item label="时间" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
              <a-range-picker :showTime="{hideDisabledOptions: true}" @change="rangePicker" format="YYYY-MM-DD HH:mm:ss" v-decorator="['rangePicker', { rules: [{ type: 'array', message: '请选择时间!' }] }]"/>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </h-top-bar>
    <div class="content-bottom-section">
      <a-divider style="margin: 16px 0;" />
      <a-table :columns="columns" :dataSource="data" rowKey="id" :pagination="pagination" @change="handleTableChange">
        <template slot="createTime" slot-scope="text, record">
          <span>
            {{ record.createTime | dateFilter }}
          </span>
        </template>
        <template slot="contentDesc" slot-scope="text">
          <overflow-tool-tip :text="text"></overflow-tool-tip>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import HTopBar from '@com/business/HTopBar.vue'
import OverflowToolTip from '@/components/business/OverflowToolTip'
import DictItemSelectElement from '@/components/business/DictItemSelectElement'
import { getAllSysLog } from '@/http/system'
import { deleteEmpty, utc2localDate, localDate2utc } from '@/utils'

export default {
  name: 'userLog',
  components: { HTopBar, OverflowToolTip, DictItemSelectElement },
  userId: '',
  data () {
    return {
      flod: true,
      columns: [
        { title: '时间', dataIndex: 'createTime', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        { title: '操作名称', dataIndex: 'operName', key: 'operName' },
        { title: '业务类型', dataIndex: 'subOperCode', key: 'subOperCode' },
        { title: '来源IP', dataIndex: 'operIp', key: 'operIp' },
        { title: '来源用户', dataIndex: 'userName', key: 'userName' },
        { title: '日志内容', dataIndex: 'content', key: 'content', scopedSlots: { customRender: 'contentDesc' } }
      ],
      searchForm: this.$form.createForm(this, {}),
      beginTime: null,
      endTime: null,
      pagination: {},
      data: []
    }
  },
  filters: {
    dateFilter: value => utc2localDate(value, 'YYYY-MM-DD HH:mm:ss')
  },
  created () {
    this.userId = this.$route.query.id
    if (this.userId) {
      this.getData({ userId: this.userId })
    }
  },
  methods: {
    rangePicker (date, dateString) {
      this.beginTime = (dateString[0] !== '' ? localDate2utc(dateString[0]) : null)
      this.endTime = (dateString[1] !== '' ? localDate2utc(dateString[1]) : null)
    },
    /**
       * 列表数据
       */
    getData (params) {
      getAllSysLog(deleteEmpty(params), this.pagination).then(res => {
        this.pagination = res.pagination
        this.data = res.data.records
      })
    },
    /**
       * 展开
       */
    toggleFlod (flod) {
      this.flod = flod
    },
    /**
       * 查询
       */
    search () {
      this.pagination.current = 1
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          const params = {
            operCode: values.operCode,
            operIp: values.operIp,
            beginTime: this.beginTime,
            endTime: this.endTime,
            userId: this.userId
          }
          this.getData(params)
        }
      })
    },
    /**
       * 重置
       */
    reset () {
      this.pagination.current = 1
      this.searchForm.resetFields()
      this.beginTime = null
      this.endTime = null
      this.getData({ userId: this.userId })
    },
    /**
       * 分页
       */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.searchForm.validateFields((err, values) => {
        if (!err) {
          const params = {
            operCode: values.operCode,
            operIp: values.operIp,
            beginTime: this.beginTime,
            endTime: this.endTime,
            userId: this.userId
          }
          this.getData(params)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .control-bar {
    &:after {
      content: '';
      display: block;
      clear: both;
    }
    .bar-right {
      float: right;
      button {
        margin-right: 20px;
      }
    }
  }
  .action {
    position: absolute;
    right: 80px;
    top: 10px;

    button + button {
      margin-left: 20px;
    }
  }
</style>
