<template>
  <div>
    <a-form :form="form">
      <div style="padding-bottom: 80px;zoom: 1;min-height: 100%;">
        <a-form-item label="实例IP"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-decorator="[ 'instIp', {rules: [{ required: true ,message:'请输入实例IP'},{ validator: this.checkIp }]} ]"
                   :read-only="readonly"
                   placeholder="请输入实例IP"/>
        </a-form-item>
        <a-form-item label="实例端口"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-decorator="[ 'instPort', {rules: [{ required: true ,message:'请输入实例端口'},{ validator: this.checkPort }]} ]"
                   :read-only="readonly"
                   placeholder="请输入实例端口"/>
        </a-form-item>
        <a-form-item label="实例上下文"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-decorator="[ 'instCtx', {rules: [{ required: true,message:'请输入实例上下文' }, { min: 1,max: 32, message: '实例上下文长度必须在1~32之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}]} ]"
                   :read-only="readonly"
                   placeholder="请输入实例上下文，不需要输入'/'"/>
        </a-form-item>
        <a-form-item label="服务器名称"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-decorator="[ 'instServerName', {rules: [{ required: false }]} ]"
                   :read-only="readonly"
                   placeholder="请输入服务器名称"/>
        </a-form-item>
        <a-form-item label="服务器编码"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-decorator="[ 'instServerCode', {rules: [{ required: false }]} ]"
                   :read-only="readonly"
                   placeholder="请输入服务器编码"/>
        </a-form-item>
        <a-form-item label="实例描述"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-decorator="[ 'instDesc', {rules: [{ required: false }]} ]"
                   :read-only="readonly"
                   placeholder="请输入实例描述"/>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
const regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
const portRegexp = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]{1}|6553[0-5])$/
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
}

export default {
  name: 'addForm',
  props: {
    showIndex: Number,
    readonly: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    checkIp (rule, value, callback) {
      if (regexp.test(value)) {
        callback()
      } else {
        callback('请输入正确ip') // eslint-disable-line
      }
    },
    checkPort (rule, value, callback) {
      if (portRegexp.test(value)) {
        callback()
      } else {
        callback('请输入正确端口号') // eslint-disable-line
      }
    },
    clear () {
      this.form.resetFields()
    }
  }
}
</script>
