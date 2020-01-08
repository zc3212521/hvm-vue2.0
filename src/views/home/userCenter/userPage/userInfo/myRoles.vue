<template>
  <div class="content-section">
    <p class="section-title">我的角色</p>
    <a-table :columns="columns"
             :dataSource="dataSource"
             @change="handleTableChange"
             rowKey="id"
             :pagination="pagination">
    </a-table>
  </div>
</template>

<script>
import { getUserRolePage } from '@/http/system'

export default {
  name: 'myRoles',
  props: {
    userId: {
      type: String
    }
  },
  data () {
    return {
      dataSource: [],
      columns: [
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '角色描述', dataIndex: 'description', key: 'description' }
      ],
      loading: true,
      size: 10,
      pages: 1,
      total: 0
    }
  },
  computed: {
    pagination () {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${this.total} 条记录`,
        pageSize: this.size,
        current: this.pages,
        total: Number(this.total),
        searchParams: {}
      }
    }
  },
  watch: {
    userId: function (newValue) {
      this.getUserRole(newValue)
    }
  },
  created () {
    if (this.userId) {
      this.getUserRole(this.userId)
    }
  },
  mounted () {
    this.getUserRole(this.userId)
  },
  methods: {
    getUserRole (userId) {
      const pageParams = {
        pageSize: this.size,
        currentPage: this.pages
      }
      const params = Object.assign(pageParams)
      const urlParams = { userId: userId }
      getUserRolePage(params, urlParams).then(res => {
        const { records, totalCount } = res.data
        this.dataSource = records
        this.total = totalCount
        this.loading = false
      })
    },
    handleTableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.size = pageSize
      this.pages = current
      this.getUserRole(this.userId)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
