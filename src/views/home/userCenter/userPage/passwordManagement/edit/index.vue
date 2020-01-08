<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb /></div>
    <a-form style="height: 100%;"
            :form="form"
            @submit="handleSubmit">
      <div class="content-section mb16" style="padding-bottom: 260px;zoom: 1;min-height: 100%;">
        <a-form-item label="旧密码"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 60%;">
          <a-input v-decorator="[
            'oldPassword',
            { rules: [{ required: true, message: '请输入密码' }]}
          ]"
                   type="password"
                   placeholder="请输入旧密码" />
        </a-form-item>
        <a-form-item label="新密码"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 60%;">
          <a-input v-decorator="[
            'newPassword',
            { rules: [{ required: true, message: '必填项' }]}
          ]"
                   type="password"
                   @blur="handleConfirmBlur"
                   placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="确认新密码"
                           :label-col="{ span: 8 }"
                           :wrapper-col="{ span: 16 }"
                           style="display: inline-block; width: 60%;">
                <a-input v-decorator="[
                  'confirmNewPW',
                  { rules: [{ required: true, message: '必填项' }, { validator: compareToFirstPassword }]}
                ]"
                         type="password"
                         @blur="handleConfirmBlur"
                         placeholder="请确认新密码" />
        </a-form-item>
        <a-form-item style="text-align: center;padding: 10px;width: 60%;">
          <a-button type="primary"
                    html-type="submit">
            重置密码
          </a-button>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import { updatePassWord } from '@/http/system'
import { messagePrompt } from '@/utils/config'
import {
  encryptionPW
} from '@/utils/auth'
export default {
  name: 'editUserPassword',
  components: {
    Breadcrumb
  },
  data () {
    return {
      form: this.$form.createForm(this),
      confirmDirty: false
    }
  },

  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let oldPassword = values.oldPassword
          let newPassword = values.newPassword
          values.oldPassword = encryptionPW(oldPassword)
          values.newPassword = encryptionPW(newPassword)
          const params = {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword
          }
          updatePassWord(params).then(res => {
            window.vm.$message.success(messagePrompt.modifySuccess)
            this.form.resetFields()
          }).catch(res => {
            window.vm.$message.error(res.data.detail)
          })
        }
      })
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('newPassword')) {
        callback('两次输入密码不一致！')  // eslint-disable-line
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
