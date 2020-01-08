<template>
  <div class="user-edit">
    <div class="content-section" style="margin-bottom: 16px;padding-bottom: 0;">
      <breadcrumb  />
      <span class="add-bread">/&nbsp;&nbsp;{{this.$route.query.name}}</span>
      <!--<div class="top-section">
        <p class="title">用户名称： {{ userInfo.userName }}</p>
      </div>-->
      <a-tabs class="user-detail" defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="用户详情" key="1">
        </a-tab-pane>
        <a-tab-pane tab="授权角色" key="2">
        </a-tab-pane>
        <a-tab-pane tab="关联权限" key="3">
        </a-tab-pane>
        <a-tab-pane tab="用户日志" key="4">
        </a-tab-pane>
      </a-tabs>
    </div>
    <template v-if="tabKey === '1'">
      <user-detail @get-user-info="getUserInfo" />
    </template>
    <template v-else-if="tabKey === '2'">
      <role-management />
    </template>
    <template v-else-if="tabKey === '3'">
      <relate-auth />
    </template>
    <template v-else>
      <user-log />
    </template>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import UserDetail from './userDetail'
import RoleManagement from './roleManagament'
import RelateAuth from './relateAuth'
import UserLog from './userLog'

export default {
  name: 'editUser',
  components: {
    Breadcrumb,
    UserDetail,
    RoleManagement,
    RelateAuth,
    UserLog
  },
  data () {
    return {
      tabKey: '1',
      userInfo: {
        userName: this.$route.query.name,
        isLock: false,
        isProhibit: false
      }
    }
  },
  created () {
  },
  methods: {
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
