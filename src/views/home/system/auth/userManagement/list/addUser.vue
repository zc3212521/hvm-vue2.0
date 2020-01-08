<template>
  <div class="add-user-wrap">
    <permission code="system_auth_user_add">
      <a-button type="primary"
                @click="visible = !visible">
        <a-icon type="plus" />新增
      </a-button>
    </permission>

    <pop-toggle
      title="新增用户"
      @close="onClose"
      :visible="visible"
      :custom-footer="false"
      :show-footer="false"
    >
      <template #content>
        <a-steps :current="current">
          <a-step v-for="item in steps"
                  :key="item"
                  :title="item" />
        </a-steps>
        <div class="steps-content">
          <template v-if="current === 0">
            <login-info @nextStep="loginInfoConfirm"
                        @closeDrawer="onClose"
                        ref="loginInfoForm"
                        @addSuccess="updateList" />
          </template>
          <template v-else>
            <auth-config @confirm="confirm"
                         :userId="userId"
                         @closeDrawer="onClose" />
          </template>
        </div>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
import Permission from '@/components/business/permission'
import PopToggle from '@/components/business/PopToggle'
import LoginInfo from './loginInfo'
import AuthConfig from './authConfig'

export default {
  name: 'addUser',
  components: {
    LoginInfo,
    AuthConfig,
    Permission,
    PopToggle
  },
  data () {
    return {
      visible: false,
      current: 0,
      steps: ['登录信息', '权限配置'],
      loginInfoData: {},
      staffInfoData: null
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
      this.current = 0
      this.$refs.loginInfoForm && this.$refs.loginInfoForm.clear()
    },
    next () {
      this.current++
    },
    prev () {
      this.current--
    },
    loginInfoConfirm (value) {
      this.loginInfoData = value
      this.next()
    },
    confirm () {
      this.onClose()
    },
    updateList () {
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
  width: 95%;
}

.steps-action {
  margin-top: 24px;
  text-align: center;
}
</style>
