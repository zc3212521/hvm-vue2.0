<template>
  <div class="user-edit">
    <div class="content-section"
         style="margin-bottom: 16px;padding-bottom: 0;">
      <breadcrumb  />
      <span class="add-bread">/&nbsp;&nbsp;{{this.userSimpleInfo.userName}}</span>
      <!--
      <div class="top-section">
        <p class="title">用户名称： {{ userSimpleInfo.userName }}</p>
        <div class="right" v-if="this.tabKey !== '1'">
          <a-button>
            {{ userSimpleInfo.isLock ? '已锁定' : '未锁定'}}
          </a-button>
          <a-button>
            {{ userSimpleInfo.isProhibit ? '已禁用': '未禁用'}}
          </a-button>
        </div>
      </div>
      -->
      <a-tabs class="user-detail" defaultActiveKey="1" @change="tagChange">
        <a-tab-pane tab="用户详情" key="1">
        </a-tab-pane>
        <a-tab-pane tab="我的角色" key="2">
        </a-tab-pane>
        <a-tab-pane tab="我的权限" key="3">
        </a-tab-pane>
        <a-tab-pane tab="用户日志" key="4">
        </a-tab-pane>
      </a-tabs>
    </div>
    <template v-if="tabKey === '1'">
      <user-details @user-details="userDetails" :userId="userId" />
    </template>
    <template v-else-if="tabKey === '2'">
      <my-roles :userId="userId" />
    </template>
    <template v-else-if="tabKey === '3'">
      <my-auths :userId="userId" />
    </template>
    <template v-else>
      <user-logs :userId="userId" />
    </template>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import UserDetails from './userDetails'
import MyRoles from './myRoles'
import MyAuths from './myAuths'
import UserLogs from './userLogs'
import { getUserInfoAsync } from '@/utils/auth'

export default {
  name: 'user',
  components: { Breadcrumb, UserDetails, MyRoles, MyAuths, UserLogs },
  data () {
    return {
      tabKey: '1',
      userSimpleInfo: {},
      userId: null
    }
  },
  created () {
    getUserInfoAsync().then(res => {
      this.userSimpleInfo = res
      this.userId = res.userId
    })
  },
  methods: {
    tagChange (key) {
      this.tabKey = key
    },
    userDetails (params) {
      this.userSimpleInfo = params
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
