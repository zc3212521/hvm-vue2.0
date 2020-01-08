<template>
  <div>
    <div class="content-section">
      <p class="section-title">
        权限信息
        <a-alert style="display: inline-block;margin: 0 20px;font-weight: bold;"
                 message="蓝色标签表示拥有此权限，白色表示无此权限，点击标签可修改权限，请谨慎操作！"
                 banner />
      </p>
      <div style="text-align: center;"
           :class="{ 'form-readonly':isDetailPage}">
        <a-spin :spinning="false">
          <AssignAuthTreeTable @checkedAuthIdsChange="reciveAuth"
                       ref="tenantAssignAuth"
                       :treeData="userAuth" />
        </a-spin>
      </div>

      <div v-if="!isDetailPage" style="width: 10%; margin: 10px auto 0;">
        <a-button type="primary"
                  @click="updateAuth"
                  style="margin-right:20px;">确定</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import AssignAuthTreeTable from '@/components/business/AssignAuthTreeTable'
import {
  translateTree,
  addLeafInTree,
  updataTreeAuth
} from '@/utils/auth'
import { getTenantAllAuth, updateTenantsAuth } from '@/http/system'
import { messagePrompt } from '@/utils/config'
export default {
  name: 'relateAuth',
  components: {
    AssignAuthTreeTable
  },
  data () {
    return {
      authArr: [],
      userAuth: [],
      loading: false
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
  created () {
    this.queryUserAllAuth()
  },
  methods: {
    queryUserAllAuth () {
      this.loading = true
      let urlParams = {
        tenantId: this.$route.query.id
      }
      getTenantAllAuth(null, urlParams).then(res => {
        let authTree = res.data
        addLeafInTree(authTree)
        translateTree(authTree)
        updataTreeAuth(authTree)
        this.userAuth = authTree
        this.loading = false
      })
    },
    reciveAuth (authArr) {
      this.authArr = authArr
    },
    updateAuth () {
      let urlParams = {
        tenantId: this.$route.query.id
      }
      let params = {
        ...urlParams,
        authIdList: this.authArr
      }
      updateTenantsAuth(params, urlParams).then(res => {
        this.queryUserAllAuth()
        this.$message.success(messagePrompt.modifySuccess)
      }).catch(err => {
        if (err) {
          this.$message.error(messagePrompt.modifyFail)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
