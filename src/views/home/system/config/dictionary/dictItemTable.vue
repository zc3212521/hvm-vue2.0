<template>
  <div>
    <div>
      <div class="control-bar">
        <permission code="system_config_dictionary_addItem">
          <a-button type="primary" @click="showAddDrawer" v-if="!parentReadonly"><a-icon type="plus"/><span>新增</span></a-button>
        </permission>
        <div class="bar-right">
          <a-input-search placeholder="字典项名称" style="width: 200px" @search="search" v-model="searchValue" enterButton />
        </div>
      </div>
      <a-divider style="margin: 16px 0;" />
      <a-spin :spinning="false" style="text-align: center;width: 100%;">
        <a-table :columns="columns" :dataSource="data" :pagination="pagination" rowKey="id" @change="handleTableChange">
          <template slot="desc" slot-scope="text">
            <over-tip :text="text" />
          </template>
          <template slot="action" slot-scope="text, record">
            <permission code="system_config_dictionary_editItem">
              <a @click="edit(record)" href="javascript:;" v-if="!parentReadonly">编辑</a>
              <a-divider type="vertical" v-if="!parentReadonly"/>
            </permission>
            <permission code="system_config_dictionary_scanItem">
              <a href="javascript:;" @click="info(record)">查看</a>
              <a-divider type="vertical" v-if="!parentReadonly"/>
            </permission>
            <permission code="system_config_dictionary_delItem">
              <a-popconfirm placement="topRight" title="确定删除吗？" okText="确定" cancelText="取消" @confirm="confirmDel(record)" v-if="!parentReadonly">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </permission>
          </template>
        </a-table>
      </a-spin>
    </div>

    <!-- 职位组抽屉组件-->
    <pop-toggle
      :title="showTitles[showIndex] + '字典项'"
      width="720"
      @close="close"
      @ok="submit"
      :visible="visible"
      :showFooter=false
    >
      <template #content>
        <add-form-dict @close="close" @ok="submit" ref="addFormDict" :showIndex="showIndex" :recordId="recordId" :readonly="readonly"/>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
import Permission from '@/components/business/permission'
import PopToggle from '@/components/business/PopToggle'
import AddFormDict from './addFormDict'
import OverTip from '@/components/business/OverflowToolTip'
import { queryAllDictItem, deleteDictItem, updateDictItem, addDictItem } from '@/http/system'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'dictItemTable',
  components: { Permission, PopToggle, AddFormDict, OverTip },
  props: {
    groupId: {
      type: [String, Number],
      required: true
    },
    parentReadonly: {
      type: [Boolean],
      required: true
    }
  },
  data () {
    return {
      columns: [
        { title: '字典项名称', dataIndex: 'itemName', key: 'itemName' },
        { title: '字典项值', dataIndex: 'itemValue', key: 'itemValue' },
        { title: '子分组编码', dataIndex: 'dictSubGroupId', key: 'dictSubGroupId' },
        { title: '排序', dataIndex: 'itemSort', key: 'itemSort' },
        { title: '描述', dataIndex: 'itemDesc', key: 'itemDesc', scopedSlots: { customRender: 'desc' } },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ],
      editFormItem: [
        { label: '字典项名称', decorator: [ 'itemName', { rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] } ] },
        { label: '字典项值', decorator: [ 'itemValue', { rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] } ] },
        { label: '子分组编码', decorator: [ 'dictSubGroupId' ] },
        { label: '排序', decorator: [ 'itemSort', { initialValue: 1, rules: [{ type: 'number', required: true, message: '必填项，且只能输入数字', transform: value => value === '' ? '' : value * 1 }] } ] },
        { label: '字典项描述', decorator: [ 'itemDesc' ], styleType: 'block', itemType: 'textarea' }
      ],
      loading: true,
      addForm: this.$form.createForm(this, {}),
      pagination: {}, // 分页对象
      data: [],
      visible: false,
      title: '新增',
      searchValue: '',
      recordId: '', // 记录Id
      readonly: true, // 是否表单为只读状态，默认为 true = '只读'
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
      this.loading = true
      const params = { itemName: this.searchValue, dictGroupId: this.groupId }
      queryAllDictItem(params, this.pagination).then(res => {
        this.pagination = res.pagination
        this.data = res.data.records
        this.loading = false
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
        this.loading = false
      })
    },
    /**
     * 分页
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getData()
    },
    /**
     * 重置表单
     */
    clearDrawerFrom () {
      this.title = '新增'
      this.recordId = ''
      this.showIndex = 0
      this.$nextTick(() => {
        this.$refs.addFormDict.addForm.resetFields()
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
     * 表单数据
     */
    recordData (record) {
      const { itemName, itemValue, dictSubGroupId, itemSort, itemDesc } = record
      return { itemName, itemValue, dictSubGroupId, itemSort, itemDesc }
    },
    /**
     * 确认删除
     */
    confirmDel (record) {
      this.delete(record.id)
    },
    /**
     * 查看界面
     */
    info (record) {
      this.visible = true
      this.readonly = true
      this.title = '查看'
      this.showIndex = 2
      this.recordId = record.id
      this.selectedRecord = this.recordData(record)
      this.$nextTick(() => {
        this.$refs.addFormDict.addForm.setFieldsValue(this.selectedRecord)
      })
    },
    /**
     * 编辑界面
     */
    edit (record) {
      this.visible = true
      this.readonly = false
      this.title = '编辑'
      this.showIndex = 1
      this.recordId = record.id
      this.selectedRecord = this.recordData(record)
      this.$nextTick(() => {
        this.$refs.addFormDict.addForm.setFieldsValue(this.selectedRecord)
      })
    },
    /**
     * 查询
     */
    search () {
      this.pagination.current = 1
      this.getData()
    },
    /**
     * 重置
     */
    reset () {
      this.pagination.current = 1
      this.searchValue = ''
      this.getData()
    },
    /**
     * 删除
     */
    delete (id) {
      const urlParams = { dictItemId: id }
      deleteDictItem(null, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.pagination.current = 1
        this.searchValue = ''
        this.getData()
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
      })
    },
    /**
     * 保存
     */
    submit () {
      this.$refs.addFormDict.addForm.validateFields((err, values) => {
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
      params = { ...params, dictGroupId: this.groupId }
      addDictItem(params).then(res => {
        window.vm.$message.success(messagePrompt.addSuccess)
        this.pagination.current = 1
        this.searchValue = ''
        this.close()
        this.getData()
      }).catch(res => {
        window.vm.$message.error(res.data.detail)
      })
    },
    /**
     * 更新
     */
    update (params) {
      const urlParams = { dictItemId: this.recordId }
      params = {
        ...params,
        dictItemId: this.recordId
      }
      updateDictItem(params, urlParams).then(res => {
        window.vm.$message.success(messagePrompt.modifySuccess)
        this.pagination.current = 1
        this.searchValue = ''
        this.close()
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
</style>
