<template>
  <div class="add-user-wrap">
    <permission code="system_auth_role_add">
      <a-button type="primary"
                @click="addRoleFn">
        <a-icon type="plus" />新增
      </a-button>
    </permission>

    <!-- 抽屉组件 -->
    <pop-toggle
      title="新增角色"
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
            <role-detail @nextStep="handleSubmit" :loading="loading"
                        @closeDrawer="onClose"
                        ref="loginInfoForm"/>
          </template>
          <template v-else>
            <auth-config @confirm="associatedPermissions"
                         @closeDrawer="onClose" />
          </template>
        </div>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
import PopToggle from '@/components/business/PopToggle'
import RoleDetail from './roleDetail'
import AuthConfig from './authConfig'
import Permission from '@/components/business/permission'
import { addRole, updateRoleAuth, queryCurrentAuth } from '@/http/system'
import { messagePrompt } from '@/utils/config'

import {
  translateTree,
  addLeafInTree,
  changeTreeAllAuth
} from '@/utils/auth'

import { deepClone } from '@/utils'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 12 }
}

export default {
  name: 'addUser',
  components: {
    Permission,
    PopToggle,
    RoleDetail,
    AuthConfig
  },
  data () {
    return {
      visible: false,
      current: 0,
      steps: ['角色信息', '权限配置'],
      formItemLayout,
      form: this.$form.createForm(this),
      loading: false,
      associatedLoading: false,
      userAuth: [],
      authArr: [],
      initUserAuth: [],
      roleId: ''
    }
  },

  computed: {},

  watch: {},

  created () {
    this.queryUserAllAuth()
  },

  mounted () {

  },

  destroyed () { },

  methods: {
    addRoleFn () {
      this.visible = true
      this.current = 0
    },
    /**
     * @description: 获取所有权限树
     * @param {type}  null
     * @return:null
     */
    queryUserAllAuth () {
      queryCurrentAuth({}).then(res => {
        this.initUserAuth = res.data
      })
    },
    /**
     * @description: 重新赋值新数据
     * @param {type}
     * @return:
     */
    initUserAuthData () {
      let data = deepClone(this.initUserAuth)
      translateTree(data)
      addLeafInTree(data)
      changeTreeAllAuth(data, false)
      this.userAuth = data
    },
    /**
     * @description: 实时更新选中的权限
     * @param {Array}  authArr 选中的数组
     * @return: null
     */
    reciveAuth (authArr) {
      this.authArr = authArr
    },

    /**
     * @description: 添加角色
     * @param {type}
     * @return:
     */
    handleSubmit () {
      this.$refs.loginInfoForm.form.validateFields(
        (err, values) => {
          if (!err) {
            this.loading = true
            addRole(values).then((res) => {
              this.loading = false
              this.roleId = res.data.roleId
              this.next()
              this.initUserAuthData()
              this.$emit('get-data')
            }).catch((err) => {
              console.log(err)
              this.loading = false
            })
          }
        }
      )
    },
    /**
     * @description: 角色关联权限
     * @param {type}
     * @return:
     */
    associatedPermissions (authArr) {
      this.authArr = authArr
      this.associatedLoading = true

      if (this.authArr.length === 0) {
        this.associatedLoading = false
        this.$message.warning('请选择权限')
        return
      }

      const urlParams = {
        roleId: this.roleId
      }
      const params = {
        ...urlParams,
        authIds: this.authArr
      }

      return updateRoleAuth(params, urlParams).then((res) => {
        this.$message.success(messagePrompt.addSuccess)
        this.associatedLoading = false
        this.cancel()
      }).catch(() => {
        this.associatedLoading = false
      })
    },
    /**
     * @description: 关闭弹窗重置数据
     * @param {type}
     * @return:
     */
    clear () {
      // this.form = this.$form.createForm(this)
      this.$nextTick(() => {
        this.$refs.loginInfoForm.form.resetFields()
      })
      this.current = 0
    },
    /**
     * @description: 关闭弹窗
     * @param {type}
     * @return:
     */
    onClose () {
      this.visible = false
      this.clear()
    },
    /**
     * @description: 点击取消
     * @param {type}
     * @return:
     */
    cancel () {
      this.onClose()
    },

    /**
     * @description: 上一步
     * @param {type}
     * @return:
     */
    prev () {
      this.current--
    },
    /**
     * @description: 下一步
     * @param {type}
     * @return:
     */
    next () {
      this.current++
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
  min-height: 240px;
}

.steps-action {
  margin-top: 24px;
  text-align: center;
}

.step__wrapper {
  min-height: 100%;
  padding: 24px;
  padding-bottom: 73px;
}
</style>
