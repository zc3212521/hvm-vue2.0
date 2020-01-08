<template>
  <a-form :form="addForm" :class="{ 'form-readonly': readonly }">
    <custom-form-item
      v-for="item in editFormItem"
      :key="item.label"
      :item="item"
    />
  </a-form>
</template>

<script>
import CustomFormItem from '@com/business/CustomFormItem'
export default {
  name: 'addForm',
  components: {
    CustomFormItem
  },
  props: {
    readonly: {
      type: Boolean,
      required: true
    },
    showIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      addForm: this.$form.createForm(this),
      editFormItem: [
        { label: '配置名称', decorator: ['configKey', { rules: [{ required: true, message: '必填项' }, { min: 1, max: 32, message: '配置名称长度必须在1~32之间' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }], itemType: 'input' },
        { label: '配置类型', decorator: ['configType', { rules: [{ required: true, message: '必填项' }, { max: 64, message: '配置类型不能超过64' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }] },
        { label: '配置值', decorator: ['configValue', { rules: [{ required: true, message: '必填项' }, { min: 1, max: 64, message: '配置值长度必须在1~64之间' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }] },
        { label: '排序号',
          decorator: [
            'configSort',
            { initialValue: 1,
              rules: [
                { type: 'number', required: true, message: '必填项，且只能输入数字', transform: value => value === '' ? '' : value * 1 }
              ]
            }
          ]
        },
        { label: '备注描述', decorator: ['configDesc'], styleType: 'block', itemType: 'textarea' }
      ] // 添加编辑表单项配置
    }
  },
  watch: {
    showIndex: function (val) {
      if (val === 0) {
        this.addForm.resetFields()
      }
    }
  },
  methods: {
    reset () {
      this.addForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
