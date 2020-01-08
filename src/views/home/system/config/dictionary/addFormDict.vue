<template>
  <div>
    <a-form :form="addForm" :class="{'form-readonly':readonly}">
      <custom-form-item v-for="item in editFormItem" :key="item.label" :item="item"></custom-form-item>
    </a-form>
    <div v-if="!readonly" :style="{ position: 'absolute', left: 0, bottom: 0, width: '100%', borderTop: '1px solid #e9e9e9', padding: '10px 16px', background: '#fff',textAlign: 'center'}">
      <a-button :style="{marginRight: '8px'}" @click="close">取消</a-button>
      <a-button @click="submit" type="primary">确定</a-button>
    </div>
  </div>
</template>
<script>
import CustomFormItem from '@com/business/CustomFormItem'
export default {
  name: 'addFormDict',
  components: { CustomFormItem },
  data () {
    return {
      editFormItem: [
        { label: '字典项名称', decorator: [ 'itemName', { rules: [{ required: true, message: '必填项' }, { min: 1, max: 32, message: '字典项名称长度必须在1~32之间' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] } ] },
        { label: '字典项值', decorator: [ 'itemValue', { rules: [{ required: true, message: '必填项' }, { min: 1, max: 32, message: '字典项值长度必须在1~32之间' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] } ] },
        { label: '子分组编码', decorator: [ 'dictSubGroupId' ] },
        { label: '排序', decorator: [ 'itemSort', { initialValue: 1, rules: [{ type: 'number', required: true, message: '必填项，且只能输入数字', transform: value => value === '' ? '' : value * 1 }] } ] },
        { label: '字典项描述', decorator: [ 'itemDesc' ], styleType: 'block', itemType: 'textarea' }
      ],
      addForm: this.$form.createForm(this, {})
    }
  },
  props: {
    showIndex: Number,
    activeTab: Number,
    readonly: Boolean,
    recordId: String
  },
  methods: {
    close () {
      this.$emit('close')
    },
    submit () {
      this.$emit('ok')
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
</style>
