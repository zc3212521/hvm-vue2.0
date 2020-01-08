<template>
  <div>
    <div class="content-section">
      <p class="section-title">
        我的权限
        <a-alert style="display: inline-block;margin: 0 20px;font-weight: bold;" message="蓝色标签表示拥有此权限，白色表示无此权限！" banner />
      </p>
      <div style="text-align: center;" :class="{'form-readonly':true}">
        <a-spin :spinning="false">
          <AssignAuthTreeTable ref="userInfoAuth" :treeData="userAuth" />
        </a-spin>
      </div>
    </div>
  </div>
</template>

<script>
import AssignAuthTreeTable from '@/components/business/AssignAuthTreeTable'
import { translateTree, addLeafInTree, updataTreeAuth } from '@/utils/auth'
import { getCurrentUserAllAuthList } from '@/http/common'

export default {
  name: 'myAuths',
  components: {
    AssignAuthTreeTable
  },
  props: {
    userId: {
      type: String
    }
  },
  data () {
    return {
      authArr: [],
      userAuth: [],
      loading: false
    }
  },
  watch: {
    userId: function (newValue) {
      this.queryUserAllAuth(newValue)
    }
  },
  created () {
    if (this.userId) {
      this.queryUserAllAuth(this.userId)
    }
  },
  methods: {
    queryUserAllAuth (userId) {
      this.loading = true
      let urlParams = {
        userId: userId
      }
      getCurrentUserAllAuthList(null, urlParams).then(res => {
        let authTree = res.data
        translateTree(authTree)
        addLeafInTree(authTree)
        updataTreeAuth(authTree)
        this.userAuth = authTree
        this.loading = false
      })
    }
  }
}
</script>
