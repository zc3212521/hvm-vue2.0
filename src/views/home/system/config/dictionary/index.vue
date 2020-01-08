<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb /></div>
    <search-form :formOptions="searchFormItem" @onSearch="search" @onReset="reset"/>
    <div class="content-bottom-section">
      <div class="control-bar">
        <permission code="system_config_dictionary_addGroup">
          <a-button type="primary" @click="showAddDrawer"><a-icon type="plus"/><span>新增</span></a-button>
        </permission>
      </div>
      <a-divider style="margin: 16px 0;"/>
      <a-spin :spinning="false" style="text-align: center;width: 100%;">
        <!-- 列表 -->
        <a-table :columns="columns" :dataSource="data" :pagination="pagination" rowKey="id" @change="handleTableChange">
          <template slot="desc" slot-scope="text">
            <overflow-tool-tip :text="text" />
          </template>
          <template slot="action" slot-scope="text, record">
            <permission code="system_config_dictionary_editGroup">
              <a @click="edit(record)" href="javascript:;">编辑</a>
              <a-divider type="vertical"/>
            </permission>
            <permission code="system_config_dictionary_scanGroup">
              <a href="javascript:;" @click="info(record)">查看</a>
              <a-divider type="vertical"/>
            </permission>
            <permission code="system_config_dictionary_delGroup">
              <a-popconfirm title="确定删除吗？" okText="确定" cancelText="取消" @confirm="confirmDel(record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </permission>
          </template>
        </a-table>
      </a-spin>
    </div>

    <!-- 职位组抽屉组件-->
    <pop-toggle
      :title="showTitles[showIndex] + '字典组'"
      width="720"
      @close="close"
      @ok="submit"
      :visible="visible"
      :showFooter=false
    >
      <template #content>
        <add-form ref="addForm" @handleTabChange="handleTabChange" @close="close" @ok="submit" :showIndex="showIndex" :recordId="recordId" :activeTab="activeTab" :readonly="readonly"/>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import Permission from '@/components/business/permission'
import SearchForm from '@/components/business/SearchForm'
import PopToggle from '@/components/business/PopToggle'
import OverflowToolTip from '@/components/business/OverflowToolTip'
import AddForm from './addForm'
import { queryAllDictGroup, deleteDictGroup, updateDictGroup, addDictGroup } from '@/http/system'
import { deleteEmpty } from '@/utils'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'dictConfig',
  components: { SearchForm, Breadcrumb, Permission, PopToggle, AddForm, OverflowToolTip },
  data () {
    return {
      columns: [
        { title: '字典组编码', dataIndex: 'dictGroupCode', key: 'dictGroupCode' },
        { title: '字典组名称', dataIndex: 'groupName', key: 'groupName' },
        { title: '字典组类型', dataIndex: 'groupType', key: 'groupType' },
        { title: '字典组描述', dataIndex: 'groupDesc', key: 'groupDesc', scopedSlots: { customRender: 'desc' } },
        { title: '操作', dataIndex: 'action', key: 'action', width: 150, scopedSlots: { customRender: 'action' } }
      ],
      data: [],
      editFormItem: [
        { label: '字典组编码', decorator: ['dictGroupCode', { rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }] },
        { label: '字典组名称', decorator: ['groupName', { rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }] },
        { label: '字典组类型', decorator: ['groupType', { rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }], styleType: 'block' },
        { label: '字典组描述', decorator: ['groupDesc'], styleType: 'block', itemType: 'textarea' }
      ],
      searchFormItem: [
        { itemType: 'input', label: '字典组编码', decorator: ['dictGroupCode'] },
        { itemType: 'input', label: '字典组名称', decorator: ['groupName'] }
      ],
      addForm: this.$form.createForm(this, {}),
      pagination: {}, // 分页对象
      visible: false,
      title: '新增',
      recordId: '', // 记录Id
      readonly: true, // 是否表单为只读状态，默认为 true = '只读'
      activeTab: 1,
      searchParams: {},
      selectedRecord: {},
      showIndex: 0, // 0 新增，1 编辑，2 查看 默认为 '新增'
      showTitles: ['新增', '编辑', '查看'] // 0 新增，1 编辑，2 查看 默认为 '新增'
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
      queryAllDictGroup(deleteEmpty(this.searchParams), this.pagination).then(res => {
        this.pagination = res.pagination
        this.data = res.data.records
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
      })
    },
    /**
     * 分页
     */
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getData()
    },
    /**
     * 重置表单
     */
    clearDrawerFrom () {
      this.title = '新增'
      this.recordId = ''
      this.activeTab = 1
      this.showIndex = 0
      this.$nextTick(() => {
        this.$refs.addForm.addForm.resetFields()
      })
    },
    /**
     * 新增操作界面弹窗
     */
    showAddDrawer () {
      this.visible = true
      this.readonly = false
      this.clearDrawerFrom()
    },
    /**
     * 关闭新增或编辑界面
     */
    close () {
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
     * 表单数据
     */
    recordData (record) {
      const { dictGroupCode, groupName, groupType, groupDesc } = record
      return { dictGroupCode, groupName, groupType, groupDesc }
    },
    /**
     * 查看界面
     */
    info (record) {
      this.visible = true
      this.readonly = true
      this.title = '查看'
      this.recordId = record.id
      this.showIndex = 2
      this.selectedRecord = this.recordData(record)
      this.$nextTick(() => {
        this.$refs.addForm.addForm.setFieldsValue(this.selectedRecord)
      })
    },
    /**
     * 编辑界面
     */
    edit (record) {
      this.visible = true
      this.readonly = false
      this.title = '编辑'
      this.recordId = record.id
      this.showIndex = 1
      this.selectedRecord = this.recordData(record)
      this.$nextTick(() => {
        this.$refs.addForm.addForm.setFieldsValue(this.selectedRecord)
      })
    },
    /**
     * 切换
     */
    handleTabChange (key) {
      this.activeTab = key
      if (key === 1) {
        this.$nextTick(() => {
          this.$refs.addForm.addForm.setFieldsValue(this.selectedRecord)
        })
      }
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
     * 删除
     */
    delete (id) {
      const urlParams = { dictGroupId: id }
      deleteDictGroup(null, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.searchParams = null
        this.pagination = Object.assign({}, this.pagination, { current: 1 })
        this.getData()
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
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
     * 新增
     */
    add (params) {
      addDictGroup(params).then(res => {
        window.vm.$message.success(messagePrompt.addSuccess)
        this.searchParams = null
        this.pagination = Object.assign({}, this.pagination, { current: 1 })
        this.getData()
        this.close()
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
      })
    },
    /**
     * 更新
     */
    update (params) {
      const urlParams = { dictGroupId: this.recordId }
      params = {
        ...params,
        dictGroupId: this.recordId
      }
      updateDictGroup(params, urlParams).then(res => {
        window.vm.$message.success(messagePrompt.modifySuccess)
        this.searchParams = null
        this.pagination = Object.assign({}, this.pagination, { current: 1 })
        this.getData()
        this.close()
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
      content: "";
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
