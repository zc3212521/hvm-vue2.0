<template>
  <div class="add-user-wrap">
    <permission code="system_platform_tenant_add">
      <a-button type="primary"
              @click="visible = !visible">
        <a-icon type="plus" />新增
      </a-button>
    </permission>
    <!-- 抽屉组件-->
    <pop-toggle
      :title="'新增租户'"
      width="720"
      @close="onClose"
      :visible="visible"
      :show-footer="false"
    >
      <template #content>
        <login-info @nextStep="loginInfoConfirm"
                      @closeDrawer="onClose"
                      ref="loginInfoForm"
                      @addSuccess="updateList" />
      </template>
    </pop-toggle>

  </div>
</template>

<script>
import LoginInfo from './loginInfo'
import Permission from '@/components/business/permission'
import PopToggle from '@/components/business/PopToggle'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'addUser',
  components: {
    LoginInfo,
    Permission,
    PopToggle
  },
  data () {
    return {
      visible: false,
      loginInfoData: {},
      staffInfoData: null,
      authConfig: null,
      PopToggle
    }
  },
  computed: {
    userId () {
      return this.loginInfoData.id || ''
    }
  },
  methods: {
    onClose () {
      this.visible = false
      this.$refs.loginInfoForm && this.$refs.loginInfoForm.clear()
    },
    loginInfoConfirm (value) {
      this.loginInfoData = value
    },
    confirm () {
      this.onClose()
    },
    updateList () {
      this.$message.success(messagePrompt.addSuccess)
      this.$emit('updateList')
    }
  }
}
</script>

<style lang="less" scoped>
.add-user-wrap {
  display: inline-block;
}
.steps-content {
  margin-top: 16px;
  height: calc(100% - 30px);
}

.steps-action {
  margin-top: 24px;
  text-align: center;
}
</style>
