<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap">
      <breadcrumb/>
    </div>
    <search-form :formOptions="searchFormItem" @onSearch="submitSearchForm" @onReset="resetSearchForm"/>
    <div class="content-bottom-section">
      <permission code="system_globalInst_add">
        <div class="control-bar">
          <a-button type="primary" @click="addWindow">
            <a-icon type="plus"/>
            <span>新增</span>
          </a-button>
        </div>
      </permission>
      <a-divider style="margin: 16px 0;"/>
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="id"
        :pagination="pagination"
        @change="handleTableChange"
      >

        <template slot="codeNameContent" slot-scope="text">
          <overflow-tool-tip :text="text"/>
        </template>
        <template slot="action" slot-scope="text, record">
          <permission code="system_globalInst_edit">
            <a @click="editWindow(record)" href="javascript:;">编辑</a>
            <a-divider type="vertical"/>
          </permission>
          <permission code="system_globalInst_scan">
            <a href="javascript:;" @click="detailWindow(record)">查看</a>
          </permission>
          <a-divider type="vertical"/>
          <permission code="system_globalInst_del">
            <a-popconfirm
              title="确定删除吗？"
              @confirm="deleteAction(record)"
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
            <a-divider type="vertical"/>
          </permission>
          <permission code="system_globalInst_monitor">
            <a href="javascript:;" @click="monitorWindow(record)">监控</a>
          </permission>
        </template>
      </a-table>
    </div>

    <!-- 弹窗抽屉组件 -->
    <pop-toggle
      :title="popupWindow.title + '实例'"
      @close="closeWindow"
      @ok="saveAction"
      :visible="popupWindow.visible"
      :custom-footer="false"
      :show-footer="popupWindow.showIndex !== 2"
    >
      <template #content>
        <add-form
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
import Permission from '@/components/business/permission'
import OverflowToolTip from '@/components/business/OverflowToolTip'
import {
  addSysGlobalInstance,
  deleteSysGlobalInstance,
  getSysGlobalInstanceById,
  queryAllSysGlobalInstance,
  updateSysGlobalInstance
} from '@/http/system'
import { messagePrompt } from '@/utils/config'
import { deleteEmpty } from '@/utils'
import AddForm from './addForm'

export default {
  name: 'userManagement',
  components: {
    SearchForm,
    AddForm,
    PopToggle,
    Breadcrumb,
    OverflowToolTip,
    Permission
  },
  data () {
    return {
      flod: true,
      data: [],
      columns: [
        { title: '实例IP', dataIndex: 'instIp', key: 'instIp' },
        { title: '端口', dataIndex: 'instPort', key: 'instPort' },
        { title: '上下文', dataIndex: 'instCtx', key: 'instCtx' },
        { title: '服务器名称', dataIndex: 'instServerName', key: 'instServerName', scopedSlots: { customRender: 'codeNameContent' } },
        { title: '服务器编码', dataIndex: 'instServerCode', key: 'instServerCode', scopedSlots: { customRender: 'codeNameContent' } },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {},
      searchForm: this.$form.createForm(this, {}),
      searchFormItem: [
        { itemType: 'input', label: '实例IP', decorator: ['instIp'] },
        { itemType: 'input', label: '端口', decorator: ['instPort'] },
        { itemType: 'input', label: '上下文', decorator: ['instCtx'] }
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
      queryAllSysGlobalInstance(searchParams, this.pagination).then(res => {
        this.pagination = res.pagination
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
     * @description: 删除操作
     * @param
     * @return:
     */
    deleteAction (record) {
      const id = record.id
      const urlParams = { id }
      deleteSysGlobalInstance(urlParams, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.pagination.current = 1
        this.listData()
      })
    },
    /**
     * @description: 查询某条数据
     * @return:
     */
    queryRecordById (id) {
      let urlParams = {
        id: id
      }
      getSysGlobalInstanceById(null, urlParams).then(
        res => {
          // let formData = res.data
          let formData = {
            instServerName: res.data.instServerName,
            instServerCode: res.data.instServerCode,
            instIp: res.data.instIp,
            instPort: res.data.instPort,
            instCtx: res.data.instCtx,
            instDesc: res.data.instDesc
          }
          this.$refs.refAddForm.form.setFieldsValue(formData)
        }
      )
    },
    /**
     * @description: 添加窗口
     * @return:
     */
    addWindow () {
      this.popupWindow.showIndex = 0
      this.popupWindow.visible = true
      this.popupWindow.readonly = false
      this.clearWindowForm()
    },
    /**
     * @description: 修改窗口
     * @param
     * @return:
     */
    editWindow (record) {
      this.popupWindow.visible = true
      this.popupWindow.readonly = false
      this.popupWindow.title = '编辑'
      this.popupWindow.recordId = record.id
      this.popupWindow.showIndex = 1
      this.queryRecordById(record.id)
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
     * @description: 监控窗口
     * @param
     * @return:
     */
    monitorWindow (record) {
      this.$router.push({
        path: '/system/globalInst/monitor',
        query: { ip: record.instIp, port: record.instPort, ctx: record.instCtx }
      })
    },
    /**
     * 重置窗口表单
     */
    clearWindowForm () {
      this.popupWindow.title = '新增'
      this.popupWindow.recordId = ''
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
    },
    /**
     * 保存操作
     */
    saveAction () {
      this.$refs.refAddForm.form.validateFields((err, values) => {
        if (!err) {
          if (this.popupWindow.recordId) {
            this.updateAction(values)
          } else {
            this.addAction(values)
          }
        }
      })
    },
    /**
     * @description: 添加操作
     * @param {Object}  values
     * @return:
     */
    addAction (values) {
      addSysGlobalInstance(values).then((res) => {
        this.$message.success(messagePrompt.addSuccess)
        this.pagination.current = 1
        this.listData()
        this.closeWindow()
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * @description: 修改操作
     * @param {Object}  values
     * @return:
     */
    updateAction (values) {
      const urlParams = {
        id: this.popupWindow.recordId
      }
      const params = {
        ...urlParams,
        ...values
      }
      updateSysGlobalInstance(params, urlParams).then(
        res => {
          this.$message.success(messagePrompt.modifySuccess)
          this.listData()
          this.closeWindow()
        }
      )
    }
  }
}
</script>
<style lang="less" scoped></style>
