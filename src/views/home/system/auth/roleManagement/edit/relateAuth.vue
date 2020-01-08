<!-- relateAuth -->
<template>
  <div>
    <div class="content-section mb16">
      <p class="section-title">
        权限信息
        <a-alert style="display: inline-block;margin: 0 20px;font-weight: bold;"
                 message="蓝色标签表示拥有此权限，白色表示无此权限，点击标签可修改权限，请谨慎操作！"
                 banner />
      </p>
      <div style="text-align: center;"
           :class="{ 'form-readonly':isDetailPage}">
        <a-spin :spinning="false">
          <AssignAuthTreeTable @checkedAuthIdsChange="receiveAuth"
                       ref="roleAssignAuth"
                       :treeData="userAuth" />
        </a-spin>
      </div>

      <a-form-item :wrapper-col="{ span: 16, offset: 2}"
                   v-if="!isDetailPage">
        <a-button type="primary"
                  style="margin-right:20px;"
                  :loading="associatedLoading"
                  @click="submit">确定</a-button>
        <!--<a-button>取消</a-button>-->
      </a-form-item>
    </div>
  </div>
</template>

<script>
import { updateRoleAuth, getRolesAuth } from '@/http/system'
// import { messagePrompt } from '@/utils/config'
import AssignAuthTreeTable from '@/components/business/AssignAuthTreeTable'
import {
  translateTree,
  addLeafInTree,
  updataTreeAuth
} from '@/utils/auth'

export default {
  name: 'relateAuth',

  mixins: [],

  components: { AssignAuthTreeTable },

  props: {},

  data () {
    return {
      userAuth: [],
      authArr: [],
      loading: false,
      roleId: this.$route.query.id,
      associatedLoading: false
    }
  },
  computed: {
    /**
    * @description: 判读是详情页还是编辑页
    * @param {type}
    * @return:
    */
    isDetailPage () {
      return this.$route.query.isDetailPage === '1'
    }
  },

  watch: {},

  created () {
    this.getRolesAuth()
  },

  mounted () { },

  destroyed () { },

  methods: {
    getRolesAuth () {
      const params = {
        roleId: this.roleId
      }
      const urlParams = {
        roleId: this.roleId
      }
      getRolesAuth(params, urlParams).then(res => {
        let authTree = res.data
        addLeafInTree(authTree)
        translateTree(authTree)
        updataTreeAuth(authTree)
        this.userAuth = authTree
        this.loading = false
      })
    },

    /**
     * @description: 实时更新选中的权限
     * @param {Array}  authArr 选中的数组
     * @return: null
     */
    receiveAuth (authArr) {
      this.authArr = authArr
    },

    /**
     * @description: 角色关联权限
     * @param {type}
     * @return:
     */
    associatedPermissions () {
      this.associatedLoading = true

      let urlParams = {
        roleId: this.roleId
      }
      const params = {
        ...urlParams,
        authIds: this.authArr
      }

      updateRoleAuth(params, urlParams).then((res) => {
        this.$message.success('修改成功')
        this.associatedLoading = false
        this.onClose()
      }).catch(() => {
        this.associatedLoading = false
      })
    },
    /**
     * @description: 确定
     * @param {type}
     * @return:
     */
    submit () {
      this.associatedPermissions()
    }
  }
}

</script>
<style lang='less' scoped>
</style>
