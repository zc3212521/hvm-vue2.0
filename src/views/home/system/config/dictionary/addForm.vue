<template>
  <div>
    <a-tabs :activeKey="activeTab" @change="handleTabChange" v-if="recordId">
      <a-tab-pane tab="字典组信息" :key="1"/>
      <a-tab-pane tab="字典项信息" :key="2"/>
    </a-tabs>
    <!-- 字典组 -->
    <template v-if="activeTab === 1">
      <a-form :form="addForm" :class="{'form-readonly':readonly}">
        <custom-form-item v-for="item in editFormItem" :key="item.label" :item="item"/>
      </a-form>
    </template>
    <!-- 字典项 -->
    <template v-if="activeTab === 2">
      <dict-item-table :groupId="recordId" :parentReadonly="readonly"/>
    </template>
    <div v-if="activeTab === 1 && !readonly" :style="{ position: 'absolute', left: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9',padding: '10px 16px', background: '#fff',textAlign: 'center' }">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="submit" type="primary">确定</a-button>
    </div>
  </div>
</template>
<script>
import CustomFormItem from '@com/business/CustomFormItem'
import DictItemTable from './dictItemTable'
export default {
  name: 'addForm',
  components: {
    CustomFormItem,
    DictItemTable
  },
  props: {
    showIndex: Number,
    activeTab: Number,
    readonly: Boolean,
    recordId: String
  },
  data () {
    return {
      addForm: this.$form.createForm(this, {}),
      columns: [
        { title: '字典组编码', dataIndex: 'dictGroupCode', key: 'dictGroupCode' },
        { title: '字典组名称', dataIndex: 'groupName', key: 'groupName' },
        { title: '字典组类型', dataIndex: 'groupType', key: 'groupType' },
        { title: '字典组描述', dataIndex: 'groupDesc', key: 'groupDesc' },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ],
      editFormItem: [
        { label: '字典组编码', decorator: ['dictGroupCode', { rules: [{ required: true, message: '必填项' }, { min: 2, max: 32, message: '字典组编码长度必须在2~32之间' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }] },
        { label: '字典组名称', decorator: ['groupName', { rules: [{ required: true, message: '必填项' }, { min: 2, max: 64, message: '字典组名称长度必须在2~64之间' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }] },
        { label: '字典组类型', decorator: ['groupType', { rules: [{ required: true, message: '必填项' }, { min: 2, max: 16, message: '字典组类型长度必须在2~16之间' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }], styleType: 'inline-block' },
        { label: '字典组描述', decorator: ['groupDesc'], styleType: 'block', itemType: 'textarea' }
      ],
      searchFormItem: [
        { itemType: 'input', label: '字典组编码', decorator: ['dictGroupCode'] },
        { itemType: 'input', label: '字典组名称', decorator: ['groupName'] }
      ]
    }
  },
  methods: {
    /**
     * 关闭新增或编辑界面
     */
    close () {
      this.$emit('close')
    },
    submit () {
      this.$emit('ok')
    },
    /**
     * 切换
     */
    handleTabChange (key) {
      this.$emit('handleTabChange', key)
      // this.activeTab = key
      // if (key === 1) {
      //   this.$nextTick(() => {
      //     this.addForm.setFieldsValue(this.selectedRecord)
      //   })
      // }
    }
  },
  watch: {
    showIndex: function (val) {
      if (val === 0) {
        this.addForm.resetFields()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.ant-form{
  padding-bottom: 50px !important;
}
.custom-modal .ant-modal-body{
  padding-bottom: 40px !important;
}
</style>
