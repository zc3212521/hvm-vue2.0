<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap">
      <breadcrumb />
    </div>
    <search-form :formOptions="searchFormItem" @onSearch="search" @onReset="reset"/>
    <div class="content-bottom-section">
      <div class="control-bar">
        <permission code="system_config_setting_add">
          <a-button type="primary" @click="showAddDrawer">
            <a-icon type="plus"/>
            <span>新增</span>
          </a-button>
        </permission>
      </div>
      <a-divider style="margin: 16px 0;"/>
      <a-table :columns="columns" :dataSource="data" :pagination="pagination" rowKey="id"
               @change="handleTableChange">
        <!--<template slot="status" slot-scope="text"><span>{{ text ? '是' : '否' }}</span></template>-->
        <template slot="configDesc" slot-scope="text">
          <Overflow-Tool-Tip :text="text"/>
        </template>
        <template slot="action" slot-scope="text, record">
          <permission code="system_config_setting_edit">
            <a href="javascript:;" @click="edit(record)">编辑</a>
            <a-divider type="vertical"/>
          </permission>
          <permission code="system_config_setting_scan">
            <a href="javascript:;" @click="info(record)">查看</a>
            <a-divider type="vertical"/>
          </permission>
          <permission code="system_config_setting_del">
            <a-popconfirm title="确定删除吗？" okText="确定" cancelText="取消" @confirm="confirmDel(record)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </permission>
        </template>
      </a-table>
    </div>
    <!-- 抽屉组件-->
    <pop-toggle
      :title="showTitles[showIndex] + '系统配置'"
      width="720"
      @close="onClose"
      @ok="submit"
      :visible="visible"
      :show-footer="showIndex !== 2"
    >
      <template #content>
        <add-form ref="addForm" :showIndex="showIndex" :readonly="readonly"/>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
// import 引入顺序：npm依赖 》 组件 》 方法 》 图片等静态资源
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import SearchForm from '@/components/business/SearchForm'
import Permission from '@/components/business/permission'
import OverflowToolTip from '@/components/business/OverflowToolTip'
import PopToggle from '@/components/business/PopToggle'
import AddForm from './addForm'
import { queryAllConfig, deleteConfig, updateConfig, addConfig } from '@/http/system'
import { deleteEmpty } from '@/utils'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'SystemConfig',
  components: { Breadcrumb, SearchForm, OverflowToolTip, Permission, PopToggle, AddForm },
  data () {
    return {
      columns: [
        { title: '配置名称', dataIndex: 'configKey', key: 'configKey' },
        { title: '配置类型', dataIndex: 'configType', key: 'configType' },
        { title: '配置值', dataIndex: 'configValue', key: 'configValue' },
        { title: '排序号', dataIndex: 'configSort', key: 'configSort' },
        // { title: '不可修改', dataIndex: 'isFinal', key: 'isFinal', scopedSlots: { customRender: 'status' } },
        { title: '描述', dataIndex: 'configDesc', key: 'configDesc', scopedSlots: { customRender: 'configDesc' } },
        { title: '操作', dataIndex: 'action', key: 'action', width: 150, scopedSlots: { customRender: 'action' } }
      ], // 列表列配置
      data: [],
      searchFormItem: [
        { itemType: 'input', label: '配置名称', decorator: ['configKey'] }
        // { itemType: 'dateRange', label: '创建时间', decorator: [ 'dateRange' ], showTime: true }
      ],
      addForm: this.$form.createForm(this), // 动态创建表单
      pagination: {}, // 分页对象
      selectedRowKeys: [],
      visible: false, // drawer 是否显示，默认为 false = '不可见'
      showIndex: 2, // 0 新增，1 编辑，2 查看 默认为 '新增'
      showTitles: ['新增', '编辑', '查看'], // 0 新增，1 编辑，2 查看 默认为 '新增'
      recordId: '', // 记录Id
      readonly: true, // 是否表单为只读状态，默认为 true = '只读'
      searchParams: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    /**
     * 列表数据
     */
    getData () {
      queryAllConfig(deleteEmpty(this.searchParams), this.pagination).then(res => {
        // 请求200触发
        this.pagination = res.pagination
        this.data = res.data.records
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
      })
    },
    /**
     * 分页变化
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getData()
    },
    /**
     * 重置表单
     */
    clearDrawerFrom () {
      this.recordId = ''
      this.$refs.addForm.addForm.resetFields()
    },
    /**
     * 新增操作界面弹窗
     */
    showAddDrawer () {
      this.visible = true
      this.readonly = false
      this.showIndex = 0
      this.recordId = ''
    },
    /**
     * 关闭新增或编辑界面
     */
    onClose () {
      this.visible = false
      this.readonly = true
      this.clearDrawerFrom()
    },
    /**
     * 确认删除
     */
    confirmDel (record) {
      this.delete(record.id)
    },
    /**
     * 查询
     */
    search (values) {
      this.searchParams = values
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.getData()
    },
    /**
     * 重置
     */
    reset () {
      this.search(null)
    },
    /**
     * 删除操作
     */
    delete (id) {
      const urlParams = { configId: id }
      deleteConfig(null, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.searchParams = null
        this.getData()
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
      })
    },
    /**
     * 查看界面
     */
    info (record) {
      this.visible = true
      this.readonly = true
      this.showIndex = 2
      this.recordId = record.id
      this.$nextTick(() => {
        this.$refs.addForm.addForm.setFieldsValue({
          configDesc: record.configDesc,
          configKey: record.configKey,
          configSort: record.configSort,
          configType: record.configType,
          configValue: record.configValue
        })
      })
    },
    /**
     * 编辑界面
     */
    edit (record) {
      this.visible = true
      this.readonly = false
      this.showIndex = 1
      this.recordId = record.id
      this.$nextTick(() => {
        this.$refs.addForm.addForm.setFieldsValue({
          configDesc: record.configDesc,
          configKey: record.configKey,
          configSort: record.configSort,
          configType: record.configType,
          configValue: record.configValue
        })
      })
    },
    /**
     * 保存
     */
    submit () {
      this.$refs.addForm.addForm.validateFields((err, values) => {
        if (!err) {
          if (this.recordId) {
            this.update(values)
          } else {
            this.add(values)
          }
        }
      })
    },
    /**
     * 新增操作
     */
    add (params) {
      addConfig(params).then(res => {
        this.$message.success(messagePrompt.addSuccess)
        this.onClose()
        this.searchParams = null
        this.pagination = Object.assign({}, this.pagination, { current: 1 })
        this.getData()
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
      })
    },
    /**
     * 更新操作
     */
    update (params) {
      const urlParams = { configId: this.recordId }
      params = {
        ...params,
        ...urlParams
      }
      updateConfig(params, urlParams).then(res => {
        this.$message.success(messagePrompt.modifySuccess)
        this.onClose()
        this.searchParams = null
        this.pagination = Object.assign({}, this.pagination, { current: 1 })
        this.getData()
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
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
