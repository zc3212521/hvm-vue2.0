<template>
  <div>
    <a-tabs class="user-detail" defaultActiveKey="1">
      <a-tab-pane tab="实例基本信息" key="1">
      </a-tab-pane>
      <a-tab-pane tab="流程图" key="2">
      </a-tab-pane>
      <a-tab-pane tab="实例审核历史" key="3">
      </a-tab-pane>
    </a-tabs>
    <a-form :form="form">
      <div style="padding-bottom: 80px;zoom: 1;min-height: 100%;">
        <a-form-item label="流程定义id"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[ 'procDefId', {rules: [{ required: false }]} ]"
                     :read-only="readonly"
                     placeholder="请输入流程定义id" />
        </a-form-item>
        <a-form-item label="流程定义名称"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[ 'procDefName', {rules: [{ required: false }]} ]"
                     :read-only="readonly"
                     placeholder="请输入流程定义名称" />
        </a-form-item>
        <a-form-item label="流程定义key"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[ 'procDefKey', {rules: [{ required: false }]} ]"
                     :read-only="readonly"
                     placeholder="请输入流程定义key" />
        </a-form-item>
        <a-form-item label="实例状态"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[ 'status', {rules: [{ required: false }]} ]"
                     :read-only="readonly"
                     placeholder="请输入实例状态" />
        </a-form-item>
        <a-form-item label="实例状态名称"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[ 'statusStr', {rules: [{ required: false }]} ]"
                     :read-only="readonly"
                     placeholder="请输入实例状态名称" />
        </a-form-item>
        <a-form-item label="流程版本"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[ 'version', {rules: [{ required: false }]} ]"
                     :read-only="readonly"
                     placeholder="请输入流程版本" />
        </a-form-item>
        <a-form-item label="创建时间"
                     :label-col="formItemLayout.labelCol"
                     :wrapper-col="formItemLayout.wrapperCol">
            <a-input v-decorator="[ 'crtTime', {rules: [{ required: false }]} ]"
                     :read-only="readonly"
                     placeholder="请输入创建时间" />
        </a-form-item>
      </div>
      <a-form-item style="text-align: center;padding: 10px; margin-top: -80px;">
        <a-button @click="cancel" style="margin-right: 20px;">
          取消
        </a-button>
        <a-button v-if="!readonly" @click="confirm" type="primary" >
          确定
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script>
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
    cancel () {
      this.$emit('formCancel')
    },
    confirm () {
      this.$emit('formSubmit')
    },
    clear () {
      this.form.resetFields()
    }
  }
}
</script>
