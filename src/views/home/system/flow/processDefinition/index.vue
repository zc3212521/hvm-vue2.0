<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><Breadcrumb :limit="3" /></div>
    <search-form :formOptions="searchFormItem" @onSearch="submitSearchForm" @onReset="resetSearchForm"/>
    <div class="content-bottom-section">
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="id"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, record">
          <a href="javascript:;" @click="detailWindow(record)">查看</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="detailWindow(record)">挂起</a>
          <a-divider type="vertical" />
          <a href="javascript:;" @click="detailWindow(record)">恢复</a>
        </template>
      </a-table>
    </div>

    <!-- 弹窗抽屉组件 -->
    <pop-toggle
      :title="popupWindow.title + '流程定义'"
      @close="closeWindow"
      :visible="popupWindow.visible"
      :custom-footer="false"
      :show-footer="false"
    >
      <template #content>
        <add-form @formCancel="closeWindow"
                  :visible="popupWindow.visible"
                  :readonly="popupWindow.readonly"
                  :showIndex="popupWindow.showIndex"
                  ref="refAddForm"/>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import SearchForm from '@/components/business/SearchForm'
import PopToggle from '@/components/business/PopToggle'
import { queryAllFlowProcessDefinition, getFlowProcessDefinitionById } from '@/http/system'
import { deleteEmpty } from '@/utils'
import AddForm from './addForm'

const columns = [
  { title: '流程名称', dataIndex: 'name', key: 'name' },
  { title: '流程key', dataIndex: 'key', key: 'key' },
  { title: '流程状态', dataIndex: 'state', key: 'state' },
  { title: '流程状态名称', dataIndex: 'stateStr', key: 'stateStr' },
  { title: '流程版本', dataIndex: 'version', key: 'version' },
  { title: '创建时间', dataIndex: 'crtTime', key: 'crtTime' },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  name: 'userManagement',
  components: {
    SearchForm,
    AddForm,
    PopToggle,
    Breadcrumb
  },
  data () {
    return {
      flod: true,
      data: [],
      columns,
      pagination: {},
      searchForm: this.$form.createForm(this, {}),
      searchFormItem: [
        { itemType: 'input', label: '流程名称', decorator: ['name'] },
        { itemType: 'input', label: '流程key', decorator: ['key'] },
        { itemType: 'input', label: '流程状态', decorator: ['state'] },
        { itemType: 'input', label: '流程状态名称', decorator: ['stateStr'] },
        { itemType: 'input', label: '流程版本', decorator: ['version'] },
        { itemType: 'input', label: '创建时间', decorator: ['crtTime'] }
      ],
      popupWindow: {
        visible: false,
        title: '新增',
        recordId: '', // 记录Id
        readonly: true, // 是否表单为只读状态，默认为 true = '只读'
        selectedRecord: {},
        showIndex: 0// 0 新增，1 编辑，2 查看 默认为 '新增'
      },
      searchParams: {}
    }
  },

  created () {
    this.listData()
  },
  methods: {
    /**
     * @description: 获取列表数据
     * @param {type}
     * @return:
     */
    listData () {
      const searchParams = deleteEmpty(this.searchParams)
      queryAllFlowProcessDefinition(searchParams, this.pagination).then(res => {
        this.pagination = res.pagination
        // TODO 改成最新的，原来的res.pagination.data
        this.data = res.data.records
      })
    },
    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.listData()
    },

    /**
     * @description: 筛选
     * @param {type}
     * @return:
     */
    submitSearchForm (values) {
      this.searchParams = deleteEmpty(values)
      this.pagination.current = 1
      this.listData()
    },
    /**
     * @description: 重置筛选
     * @param {type}
     * @return:
     */
    resetSearchForm () {
      this.searchParams = {}
      this.pagination.current = 1
      this.listData()
    },
    /**
     * @description: 查询某条数据
     * @return:
     */
    queryRecordById (id) {
      let urlParams = {
        id: id
      }
      getFlowProcessDefinitionById(null, urlParams).then(
        res => {
          // let formData = res.data
          let formData = {
            name: res.data.name,
            key: res.data.key,
            state: res.data.state,
            stateStr: res.data.stateStr,
            version: res.data.version,
            crtTime: res.data.crtTime
          }
          this.$refs.refAddForm.form.setFieldsValue(formData)
        }
      )
    },
    /**
     * @description: 详情窗口
     * @param
     * @return:
     */
    detailWindow (record) {
      this.popupWindow.visible = true
      this.popupWindow.readonly = true
      this.popupWindow.title = '查看'
      this.popupWindow.recordId = record.id
      this.popupWindow.showIndex = 2
      this.queryRecordById(record.id)
    },
    /**
     * 重置窗口表单
     */
    clearWindowForm () {
      this.popupWindow.title = '新增'
      this.popupWindow.recordId = ''
      this.popupWindow.showIndex = 0
      this.$nextTick(() => {
        this.$refs.refAddForm.form.resetFields()
      })
    },
    /**
     * @description: 关闭弹窗
     * @param {type}
     * @return:
     */
    closeWindow () {
      this.popupWindow.visible = false
      this.clearWindowForm()
    },
    /**
     * @description: 点击取消
     * @param {type}
     * @return:
     */
    cancelWindow () {
      this.closeWindow()
    }
  }
}
</script>
<style lang="less" scoped></style>
