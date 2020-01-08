<template>
  <div>
    <div class="mbx-wrap"><breadcrumb  /></div>
    <div class="mb16">
      <search-form :formOptions="searchFormItem" @onSearch="search" @onReset="reset"/>
    </div>
    <div class="content-section">
      <AuthOperateTreeTable
        :authData="authData"
        @distributeAuth="distribute"
        distributeOnly
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import SearchForm from '@/components/business/SearchForm'
import AuthOperateTreeTable from '@/components/business/AuthOperateTreeTable'
import { queryCurrentAuth } from '@/http/system'
import { addLeafInTree } from '@/utils/auth'
// import { deleteEmpty } from '@/utils'
export default {
  name: 'authManagement',
  components: {
    SearchForm,
    AuthOperateTreeTable,
    Breadcrumb
  },
  data () {
    return {
      form: this.$form.createForm(this, {}),
      authData: [],
      searchFormItem: [
        { itemType: 'input', label: '名称', decorator: ['authName'] },
        { itemType: 'input', label: '编码', decorator: ['authCode'] }
      ],
      searchParams: null
    }
  },
  mounted () {
    this.getTenantsAuth()
  },
  methods: {
    getTenantsAuth () {
      this.authData = []
      queryCurrentAuth(this.searchParams).then(res => {
        addLeafInTree(res.data)
        this.authData = res.data
      })
    },
    /**
    * @description: 查询
    */
    search (values) {
      this.searchParams = values
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.getTenantsAuth()
    },
    /**
     * @description: 重置
     */
    reset () {
      this.searchParams = ''
      this.getTenantsAuth()
    },
    edit (id) {
      this.$refs.addAuth.authId = id
      this.$refs.addAuth.type = 'edit'
      this.$refs.addAuth.visible = true
    },
    distribute (record) {
      this.$router.push({
        name: 'system_auth_auth_distribute',
        query: {
          name: record.authName,
          id: record.authId
        }
      })
    },
    deleteAuth (id) {},
    updateAuth () {
      this.$refs.authTree.getAllAuth()
    }
  }
}
</script>

<style lang="less" scoped></style>
