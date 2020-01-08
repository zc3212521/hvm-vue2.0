<template>
  <div class="user-edit">
    <div class="content-section"
         style="margin-bottom: 16px;padding-bottom: 0;">
      <breadcrumb  />
      <span class="add-bread">/&nbsp;&nbsp;{{this.roleName}}</span>
      <!--<div class="top-section">
        <p class="title">角色名称：{{roleName}}</p>
        <div class="right">
          &lt;!&ndash; <a-button>锁定</a-button>
          <a-button style="background-color: red;color: #fff;">禁用</a-button> &ndash;&gt;
        </div>
      </div>-->
      <a-tabs class="user-detail"
              defaultActiveKey="1"
              @change="callback">
        <a-tab-pane tab="角色详情"
                    key="1"></a-tab-pane>
        <a-tab-pane tab="授权用户"
                    key="2"></a-tab-pane>
        <a-tab-pane tab="关联权限"
                    key="3"></a-tab-pane>
      </a-tabs>
    </div>

    <div class="tab-pane-content">
      <template v-if="tabKey === '1'">
        <role-detail @update-userInfo="updateUserInfo" />
      </template>
      <template v-else-if="tabKey === '2'">
        <authorize-user />
      </template>
      <template v-else>
        <relate-auth />
      </template>
    </div>

  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import RoleDetail from './roleDetail'
import AuthorizeUser from './authorizeUser'
import RelateAuth from './relateAuth'
export default {
  name: 'editUser',
  components: {
    Breadcrumb,
    RoleDetail,
    AuthorizeUser,
    RelateAuth
  },
  data () {
    return {
      roleName: '',
      tabKey: '1'
    }
  },
  created () {

  },
  methods: {
    /**
     * @description: 切换tab
     * @param {String} key
     * @return:
     */
    callback (key) {
      this.tabKey = key
    },
    /**
     * @description: 接收用户基本信息
     * @param {Object}  form  {roleName:""}
     * @return:
     */
    updateUserInfo (form) {
      this.roleName = form.roleName
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
