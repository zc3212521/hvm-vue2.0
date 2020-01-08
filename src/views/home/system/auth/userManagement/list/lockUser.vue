<template>
  <span>
    <permission code="system_auth_user_lockUser">
      <a-button type="primary"
                @click="showLockUserModal"
                style="margin-left: 10px;">
        锁定用户
      </a-button>
    </permission>
    <permission code="system_auth_user_unlockUser">
      <a-button type="primary"
                @click="unlockUser"
                style="margin-left: 10px;">
        解锁用户
      </a-button>
    </permission>
    <a-modal title="锁定用户" v-model="lockUserVisible" @ok="handleLockUserOk">
      <a-form style="height: 100%;"
              :form="lockForm">
        <div class="content-section mb16">
          <a-form-item label="锁定时间"
                       :label-col="{ span: 5}"
                       :wrapper-col="{ span: 16 }">
            <a-range-picker @change="lockOnchange"
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            v-decorator="['range-picker', rangeConfig]"/>
          </a-form-item>
          <a-form-item label="锁定原因"
                       :label-col="{ span: 5 }"
                       :wrapper-col="{ span: 12 }">
            <a-input v-decorator="[
                  'lockRemark', { rules: [{ required: true, message: '必填项' },{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}]"
                     type="text"
                     placeholder="请输入锁定原因"/>
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </span>
</template>

<script>
import Permission from '@/components/business/permission'
import { batchOperationUser, batchUnlockUser } from '@/http/system'
import { localDate2utc } from '@/utils/index'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'lockUser',
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
      lockForm: this.$form.createForm(this),
      rangeConfig: {
        rules: [{ type: 'array', required: true, message: '请选择开始和结束日期!' }]
      },
      lockBeginTime: '',
      lockEndTime: '',
      lockUserVisible: false
    }
  },
  methods: {
    showLockUserModal () {
      if (this.userIds.length <= 0) {
        this.$message.warning('请选择用户')
      } else {
        this.lockUserVisible = true
      }
    },
    lockOnchange (date, dateString) {
      this.lockBeginTime = dateString[0]
      this.lockEndTime = dateString[1]
    },
    unlockUser () {
      if (this.userIds.length <= 0) {
        this.$message.warning('请选择用户')
      } else {
        const params = {
          userIds: this.userIds
        }
        batchUnlockUser(params).then(res => {
          this.$message.success(messagePrompt.unlockSuccess)
          this.$emit('updateList')
        })
      }
    },
    handleLockUserOk (e) {
      this.lockForm.validateFields((err, values) => {
        if (!err) {
          const params = {
            userIds: this.userIds,
            lockBeginTime: localDate2utc(this.lockBeginTime),
            lockEndTime: localDate2utc(this.lockEndTime),
            remark: values.lockRemark
          }
          batchOperationUser(params).then(res => {
            this.$message.success(messagePrompt.lockSuccess)
            this.lockUserVisible = false
            this.lockForm.resetFields()
            this.$emit('updateList')
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
