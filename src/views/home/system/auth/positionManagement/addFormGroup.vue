<template>
  <div>
    <p class="draw-content-title">职位组信息</p>
      <a-form :form="addPositionGroupForm">
        <a-form-item
          label="职位组名称"
          required
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            placeholder="请输入"
            v-decorator="['groupName',{ rules: [{ required: true, message: '请输入职位组名称' }, { min: 2,max: 64, message: '职位组名称长度必须在2~64之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}]"
          />
        </a-form-item>
        <a-form-item
          label="职位组描述"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-textarea
            v-decorator="['groupDesc']"
            placeholder="请输入职位组描述"
            :autosize="{ minRows: 2, maxRows: 6 }"
          />
        </a-form-item>
      </a-form>
  </div>
</template>
<script>
export default {
  name: 'addFormGroup',
  data () {
    return {
      addPositionGroupForm: this.$form.createForm(this, {})
    }
  },
  props: {
    showIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    showIndex: function (val) {
      if (val === 0) {
        this.addPositionGroupForm.resetFields()
      }
    }
  }

}
</script>
<style lang="less" scoped>

</style>
