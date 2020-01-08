<template>
  <div>
    <a-alert style="display: inline-block;font-weight: bold;"
              message="蓝色标签表示拥有此权限，白色表示无此权限，点击标签可修改权限，请谨慎操作！"
              banner />
    <div style="text-align: center;">
      <a-spin :spinning="false">
        <AssignAuthTreeTable @checkedAuthIdsChange="reciveAuth"
                      ref="roleAssignAuth"
                      :treeData="userAuth" />
      </a-spin>
    </div>
    <div class="btns">
      <a-button @click="cancel">跳过</a-button>
      <a-button type="primary" @click="confirm">
        确定
      </a-button>
    </div>
  </div>
</template>
<script>
import AssignAuthTreeTable from '@/components/business/AssignAuthTreeTable'
import { queryCurrentAuth } from '@/http/system'
import { messagePrompt } from '@/utils/config'

import {
  translateTree,
  addLeafInTree,
  changeTreeAllAuth
} from '@/utils/auth'

import { deepClone } from '@/utils'
export default {
  name: 'authConfig',
  components: {
    AssignAuthTreeTable
  },
  data () {
    return {
      authArr: [],
      userAuth: [],
      initUserAuth: [],
      loading: false
    }
  },
  created () {
    this.queryUserAllAuth()
  },
  methods: {
    cancel () {
      this.$message.success(messagePrompt.addSuccess)
      this.$emit('closeDrawer')
    },
    confirm () {
      this.$message.success(messagePrompt.addSuccess)
      this.$emit('confirm', this.authArr)
    },
    /**
     * @description: 获取所有权限树
     * @param {type}  null
     * @return:null
     */
    queryUserAllAuth () {
      queryCurrentAuth({}).then(res => {
        this.initUserAuth = res.data
        this.initUserAuthData()
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
    }
  }
}
</script>
<style lang="less" scoped>
.btns{
  text-align: center;
  padding: 10px;
}
.btns button{margin: 0 5px;}
</style>
