<!--头像与退出功能-->
<template>
  <a-popover
    overlayClassName="userCenter"
    placement="bottomRight"
  >
    <template slot="content">
      <!--<p class="hover-p">个人中心</p>-->
      <div class="user-wrap" style="">
        <p class="hover-p" @click="quictOut">
          <a-icon type="logout" />
          退出登录
        </p>
      </div>
    </template>
    <span class="h-avatar-wrap">
      <a-avatar size="small" icon="user" style="margin-right: 5px;"/>
      <span style="font-size: 14px;">
        {{ userName }}
      </span>
    </span>
  </a-popover>
</template>

<script>
import { loginOut, getUserInfoAsync } from '@/utils/auth'
import { logout } from '@/http/common'

export default {
  name: 'HAvatar',
  data () {
    return {
      userName: null
    }
  },
  created () {
    getUserInfoAsync().then(res => {
      this.userName = res.userName
    })
  },
  methods: {
    quictOut () {
      this.$message.info('退出登录')
      logout({}).then(() => {
        loginOut()
      }).catch(() => {
        loginOut()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .hover-p{
    cursor: pointer;
    padding:6px 10px;
  }
  .hover-p:hover {
    background: rgb(230, 247, 255);
  }
  .h-avatar-wrap {
    cursor: pointer;
    display: inline-block;
    height: 100%;
    overflow: hidden;
  }
</style>

<style>
  .userCenter .ant-popover-inner-content{
    padding: 0;
  }
  .user-wrap{
    width: 160px;
    padding: 5px 0;
    height: 43px;
  }
</style>
