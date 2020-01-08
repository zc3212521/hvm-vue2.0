<template>
  <div>
    <a-form :form="form">
      <a-form-item label="角色名称"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol">
        <a-input placeholder="请输入"
                  v-decorator="[
                'roleName',
                { rules: [{ required: true, message: '请输入角色名称' },{min: 2,max: 32, message: '角色名称长度必须在2~32之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}
                ]" />
      </a-form-item>
      <a-form-item v-bind="formItemLayout"
                    label="备注描述"
                    :label-col="formItemLayout.labelCol"
                    :wrapper-col="formItemLayout.wrapperCol">
        <a-textarea placeholder="请输入"
                    v-decorator="[
                  'description'
                  ]"
                    maxlength="200"
                    :rows="5" />
      </a-form-item>
    </a-form>
    <div class="steps-content-footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="confirm" :loading="loading">
        下一步
      </a-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'loginInfo',
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 12 }
      },
      form: this.$form.createForm(this, {})
    }
  },
  methods: {
    cancel () {
      this.$emit('closeDrawer')
    },
    confirm () {
      this.$emit('nextStep')
    }
  }
}
</script>
<style lang="less" scoped>
.steps-content-footer{
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 10px;
}
.steps-content-footer button{
  margin: 0 5px;
}
</style>
