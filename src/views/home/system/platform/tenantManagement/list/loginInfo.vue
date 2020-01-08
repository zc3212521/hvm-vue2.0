<template>
  <a-form style="height: 100%;" :form="form" @submit="handleSubmit">
    <div style="padding-bottom: 80px;zoom: 1;min-height: 100%;">

      <a-form-item label="租户名称"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 16 }">
        <a-input v-decorator="[ 'tenantName', {rules: [{ required: true, message: '请输入租户名称' },{min: 1,max: 64, message: '租户名称长度必须在1~64之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}]"
        placeholder="请输入租户名称" />
      </a-form-item>

      <a-form-item label="账号"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 16 }">
        <a-input v-decorator="[ 'account', {rules: [{ required: true, message: '请输入账号' },{ pattern: /^[A-Za-z0-9_]{4,32}$/, message: '账号只能是4~32位英文字母、数字、下划线' }]}]"
        placeholder="请输入账号" />
      </a-form-item>

      <a-form-item label="密码"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 16 }">
        <a-input type="password" v-decorator="[ 'password', {rules: [{ required: true, message: '请输入密码' }]}
        ]"
        placeholder="请输入密码" />
      </a-form-item>

      <!-- <a-form-item label="租户状态"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 16 }">
        <a-radio-group v-decorator="[ 'status', {rules: [{ required: true, message: '请选择租户状态' }]}]">
          <a-radio :value="1" style="margin-right: 20px;"> 启用 </a-radio>
          <a-radio :value="0"> 禁用 </a-radio>
        </a-radio-group>
      </a-form-item> -->

      <a-form-item label="联系号码"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 16 }">
        <a-input v-decorator="[ 'mobile', {rules: [{ required: false }]} ]"
        placeholder="请输入联系号码" />
      </a-form-item>

      <a-form-item label="邮箱" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-input v-decorator="[ 'email', {rules: [{ required: false }]} ]"
        placeholder="请输入邮箱" />
      </a-form-item>

      <a-form-item label="备注描述" :label-col="{ span: 4 }" :wrapper-col="{ span: 16 }">
        <a-textarea v-decorator="[ 'description', {rules: [{ required: false }]} ]"
        placeholder="请输入备注描述" />
      </a-form-item>
    </div>

    <a-form-item style="text-align: center;padding: 10px; margin-top: -80px;">
      <a-button @click="cancel" style="margin-right: 20px;">
        取消
      </a-button>
      <a-button type="primary" html-type="submit">
        确定
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import { addTenants } from '@/http/system'
import { encryptionPW } from '@/utils/auth'
import { deleteEmpty } from '@/utils'
export default {
  name: 'loginInfo',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let result = deleteEmpty(values)
          let password = result.password
          result.password = encryptionPW(password)
          result.userType = 1
          result.status = 0
          addTenants(result).then(res => {
            this.$emit('addSuccess')
            this.cancel()
          })
        }
      })
    },
    cancel () {
      this.$emit('closeDrawer')
    },
    clear () {
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
