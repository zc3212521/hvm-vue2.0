<template>
  <a-form style="height: 100%;"
          :form="form"
          @submit="handleUpdatePasswordSubmit">
    <div class="content-section mb16">
      <a-form-item label="新密码"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 60%;">
        <a-input v-decorator="[ 'password',
          { rules: [{ required: true, message: '必填项' }]}
        ]"
                 type="password"
                 @blur="handleConfirmBlur"
                 placeholder="请输入新密码"/>
      </a-form-item>
      <a-form-item label="确认新密码"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 60%;">
        <a-input v-decorator="[
                'confirmPW',
                { rules: [{ required: true, message: '必填项' }, { validator: compareToFirstPassword }]}
              ]"
                 type="password"
                 @blur="handleConfirmBlur"
                 placeholder="请确认新密码"/>
      </a-form-item>
      <!--<a-form-item>
        <a-button type="primary"
                  html-type="submit">
          重置密码
        </a-button>
      </a-form-item>-->
    </div>
  </a-form>
</template>

<script>
import { updatePassWord } from '@/http/system'
import { messagePrompt } from '@/utils/config'
import {
  encryptionPW
} from '@/utils/auth'

export default {
  name: 'updateUserPassword',
  data () {
    return {
      form: this.$form.createForm(this),
      confirmDirty: false
    }
  },

  methods: {
    handleUpdatePasswordSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let password = values.password
          values.password = encryptionPW(password)
          const params = {
            password: values.password
          }
          updatePassWord(params).then(res => {
            this.$message.success(messagePrompt.modifySuccess)
            this.form.resetFields()
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
      if (value && value !== form.getFieldValue('password')) {
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
