<template>
  <a-form :form="addForm">
        <custom-form-item
          v-for="item in editFormItem"
          :key="item.label"
          :item="item"
        >
        </custom-form-item>
      </a-form>
</template>

<script>
import CustomFormItem from '@com/business/CustomFormItem'
export default {
  name: 'addForm',
  components: {
    CustomFormItem
  },
  data () {
    return {
      addForm: this.$form.createForm(this),
      editFormItem: [
        {
          label: '存储名称',
          disabled: 'disabled',
          decorator: [
            'fileName',
            {
              rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }]
            }
          ],
          styleType: 'block'
        },
        {
          label: '文件名称',
          decorator: ['realName', { rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }],
          styleType: 'block'
        }
      ]
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
