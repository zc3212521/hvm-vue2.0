<template>
  <div class="user-edit">
    <div class="content-section"
         style="margin-bottom: 16px;padding-bottom: 0;">
      <breadcrumb  />
      <span class="add-bread">/&nbsp;&nbsp;{{this.userInfo.tenantName}}</span>
      <a-tabs class="user-detail"
              defaultActiveKey="1"
              @change="callback">
        <a-tab-pane tab="租户详情"
                    key="1">
        </a-tab-pane>
        <a-tab-pane tab="关联权限"
                    key="2">
        </a-tab-pane>
      </a-tabs>
    </div>
    <template v-if="tabKey === '1'">
      <user-detail @get-user-info="getUserInfo" ref="userDetail" />
    </template>
    <template v-else>
      <relate-auth />
    </template>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import UserDetail from './userDetail'
import RelateAuth from './relateAuth'
import { startTenant, stopTenant, queryTenantInfoById } from '@/http/system'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'editUser',
  components: {
    Breadcrumb,
    UserDetail,
    RelateAuth
  },
  props: {
    tenantInfo: {
    }
  },
  data () {
    return {
      tabKey: '1',
      userInfo: {
        tenantName: null,
        isProhibit: null
      }
    }
  },
  created () {
    let id = this.$route.query.id
    this.queryUserInfo(id)
    if (this.$route.query.isDetailPage) {
      this.$route.meta.title = '租户查看'
    } else {
      this.$route.meta.title = '租户编辑'
    }
  },
  computed: {
    isDetailPage () {
      return this.$route.query.isDetailPage === '1'
    }
  },
  methods: {
    /**
     * 查询当前租户信息
    */
    queryUserInfo (id) {
      queryTenantInfoById(id).then(res => {
        let data = res.data
        this.userInfo.isProhibit = data.isProhibit
        this.userInfo.tenantName = data.tenantName
      })
    },
    /**
     * 启用禁用
    */
    startTenant () {
      // 当前为启用 要改为禁用
      if (this.userInfo.isProhibit) {
        let urlParams = {
          tenantId: this.$route.query.id
        }
        startTenant(null, urlParams).then(res => {
          this.$message.success(messagePrompt.validSuccess)
        })
      } else {
        let urlParams = {
          tenantId: this.$route.query.id
        }
        stopTenant(null, urlParams).then(res => {
          this.$message.success(messagePrompt.invalidSuccess)
        })
      }
      this.userInfo.isProhibit = !this.userInfo.isProhibit
    },
    callback (key) {
      this.tabKey = key
    },
    /**
     * @description: 获取用户信息
     * @param {Object} params
     * @return:
     */
    getUserInfo (params) {
      this.userInfo = params
    }

  }
}
</script>

<style lang="less" scoped>
.top-section {
  &:after {
    content: "";
    display: block;
    clear: both;
    margin-bottom: 20px;
  }
  .right {
    float: right;

    button {
      margin-right: 20px;
    }
  }
}
.title {
  height: 28px;
  line-height: 28px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
  display: inline-block;
  width: 50%;
  margin-bottom: 0;
}
.user-detail /deep/ .ant-tabs-bar {
  margin: 0;
}
.user-edit /deep/ .section-title {
  height: 24px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
