<template>
  <span>
    <permission code="system_auth_user_updatePassword">
      <a-button type="primary"
                @click="showModal"
                style="margin-left: 10px;">
        修改密码
      </a-button>
    </permission>
    <a-modal title="修改密码" v-model="updatePasswordVisible" @ok="handleOk">
        <a-form style="height: 100%;"
                :form="form">
          <div class="content-section mb16">
            <a-form-item label="新密码"
                         :label-col="{ span: 8 }"
                         :wrapper-col="{ span: 16 }"
                         style="display: inline-block; width: 80%;">
              <a-input v-decorator="[ 'password', { rules: [{ required: true, message: '必填项' }]}]"
                       type="password"
                       placeholder="请输入新密码" />
            </a-form-item>
            <a-form-item label="确认新密码"
                         :label-col="{ span: 8 }"
                         :wrapper-col="{ span: 16 }"
                         style="display: inline-block; width: 80%;">
              <a-input v-decorator="[
                  'confirmPW',
                  { rules: [{ required: true, message: '必填项' }, { validator: compareToFirstPassword }]}
                ]"
                       type="password"
                       placeholder="请确认新密码" />
            </a-form-item>
          </div>
        </a-form>
      </a-modal>
  </span>
</template>

<script>
import Permission from '@/components/business/permission'
import { updateBatchPwByAdmin } from '@/http/system'
import { encryptionPW } from '@/utils/auth'
import { messagePrompt } from '@/utils/config'
export default {
  name: 'changePassword',
  components: {
    Permission
  },
  props: {
    userIds: {
      type: Array
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      updatePasswordVisible: false
    }
  },
  methods: {
    showModal () {
      console.log(666, this.userIds)
      if (this.userIds.length <= 0) {
        this.$message.warning('请选择用户')
      } else {
        this.updatePasswordVisible = true
      }
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入密码不一致！')  // eslint-disable-line
      } else {
        callback()
      }
    },
    handleOk (e) {
      this.visible = false
      this.form.validateFields((err, values) => {
        if (!err) {
          let password = values.password
          values.password = encryptionPW(password)
          const params = {
            password: values.password,
            userIds: this.userIds
          }
          updateBatchPwByAdmin(params).then(res => {
            this.$message.success(messagePrompt.modifySuccess)
            this.updatePasswordVisible = false
            this.form.resetFields()
          }).catch(res => {
            this.$message.error(res.data.detail)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
