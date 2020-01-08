<template>
  <div>
    <div class="mbx-wrap">
      <breadcrumb  />
    </div>
    <div class="mb16">
      <search-form :formOptions="searchFormItem" @onSearch="handleSearch" @onReset="handleReset"/>
    </div>
    <div class="content-section">
      <div style="margin: 16px 0;">
        <permission code="system_platform_authManagement_add">
          <a-button
            type="primary"
            @click="addAuthBtn"
          >
            <a-icon type="plus" />新增
          </a-button>
        </permission>
      </div>
      <pop-toggle
        :title="(type === 'add' ? '新增' : '编辑') + '基础权限'"
        width="720"
        @close="onClose"
        @ok="handleSubmit"
        :visible="visible"
      >
        <template #content>
          <add-auth ref="addAuth" :type="type" :authId="authId" :visible="visible" @updateAuth="updateAuth" />
        </template>
      </pop-toggle>
      <AuthOperateTreeTable :authData="authData"  @editAuth="edit" @distributeAuth="distribute" @deleteAuth="deleteAuth" />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import Permission from '@/components/business/permission'
import PopToggle from '@/components/business/PopToggle'
import SearchForm from '@/components/business/SearchForm'
import AuthOperateTreeTable from '@/components/business/AuthOperateTreeTable'
import AddAuth from './addAuth'
import { mapActions } from 'vuex'
import { getAllAuthTree, deleteAuth } from '@/http/system'
import { getCurrentUserMenuList, getCurrentUserAllAuthList } from '@/http/common'
import { formatAuth, getMenuWithoutRoot, addLeafInTree } from '@/utils/auth'
import { messagePrompt } from '@/utils/config'
export default {
  name: 'authManagementList',
  components: { SearchForm, AuthOperateTreeTable, AddAuth, Breadcrumb, Permission, PopToggle },
  data () {
    return {
      authId: '',
      authData: [],
      // form: this.$form.createForm(this, {}),
      type: 'add',
      preCode: null,
      preUrl: '',
      visible: false,
      searchFormItem: [
        { itemType: 'input', label: '权限名称', decorator: ['authName'] },
        { itemType: 'input', label: '编码', decorator: ['authCode'] }
      ],
      searchParams: null
    }
  },
  mounted () {
    this.getAllAuth()
  },
  methods: {
    addAuthBtn () {
      this.type = 'add'
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    handleSubmit () {
      this.$refs.addAuth.handleSubmit()
    },
    // 主页面 查询
    handleSearch (values) {
      if (values) {
        this.searchParams = values
      } else {
        this.searchParams = ''
      }
      this.getAllAuth()
    },
    // 重置
    handleReset () {
      this.handleSearch(null)
    },
    edit ({ id, authType }) {
      this.type = 'edit'
      this.authId = id
      this.visible = true
      this.$nextTick(function () {
        this.$refs.addAuth.authType = authType + ''
      })
    },
    distribute (record) {
      this.$router.push({
        name: 'system_platform_authManagement_distribute',
        query: { name: record.authName, id: record.authId }
      })
    },
    deleteAuth (id) {
      let urlParams = {
        authId: id
      }
      deleteAuth(null, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.updateAuth()
      })
    },
    updateAuth () {
      this.visible = false
      Promise.all([getCurrentUserMenuList(), getCurrentUserAllAuthList()]).then(
        res => {
          let menuRes = res[0]
          let authRes = res[1]
          let userMenu = []
          let userAuth = []
          formatAuth(menuRes.data, userMenu)
          formatAuth(authRes.data, userAuth)
          userMenu = getMenuWithoutRoot(userMenu)
          this.generateMenuAndAuth([userMenu, userAuth]).then(() => {
            this.getAllAuth()
          })
        }
      )
    },
    getAllAuth () {
      this.authData = []
      getAllAuthTree(this.searchParams).then(res => {
        addLeafInTree(res.data)
        this.authData = res.data
      })
    },
    ...mapActions(['generateMenuAndAuth'])
  }
}
</script>

<style lang="less" scoped></style>
