<template>
  <div class="content-section">
    <div style="margin-bottom: 16px;">
      <permission code="system_auth_auth_delRole">
        <a-button style="margin-right:20px;" :disabled="this.selectedRowKeys.length>0?false:true" type="primary" icon="delete" @click="onBatchDeleteClick">
          批量删除
        </a-button>
      </permission>
      <permission code="system_auth_auth_addRole">
        <a-button type="primary" icon="plus" @click="openSelectRole">
          授予角色
        </a-button>
      </permission>
    </div>
    <div>
      <a-table
        :columns="columns"
        :dataSource="data"
        :rowSelection="{ onChange: onSelectionChange, selectedRowKeys}"
        :pagination="pagination"
        @change="tableChange"
        rowKey="id"
      >
        <template slot="action" slot-scope="text, record">
          <permission code="system_auth_auth_delRole">
            <a-popconfirm title="确定删除吗？" okText="确定" cancelText="取消" @confirm="confirmDel(record)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </permission>
        </template>
      </a-table>
    </div>
    <SelectRoleModal ref="authSelectRole" @onSelectedRoles="selectedRoles"></SelectRoleModal>
  </div>

</template>

<script>
import Permission from '@/components/business/permission'
import { getAllAuthRoles, grantAuthToRoles, revokeAuthToRoles } from '@/http/system'
import SelectRoleModal from '@/components/business/SelectRoleModal'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'authDistributeUser',
  props: ['authId'],
  components: {
    SelectRoleModal,
    Permission
  },
  data () {
    return {
      data: [],
      pageSize: 10,
      currentPage: 1,
      selectedRowKeys: [],
      columns: [
        { title: '角色名称', dataIndex: 'roleName' },
        { title: '描述', dataIndex: 'description' },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `共 ${total} 条记录`
      },
      loading: false
    }
  },
  mounted () {
    this.getAuthRoles()
  },
  methods: {
    onSelectionChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = []
      selectedRows.forEach(item => {
        this.selectedRowKeys.push(item.roleId)
      })
    },
    // 分页切换触发
    tableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.pageSize = pageSize
      this.currentPage = current
      this.getAuthRoles()
    },
    getAuthRoles () {
      const urlParams = {
        authId: this.authId
      }
      const params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.loading = true
      getAllAuthRoles(params, urlParams).then(res => {
        this.data = res.data.records
        const newPagination = {
          ...this.pagination,
          current: Number(res.data.currentPage),
          pageSize: this.pageSize,
          total: Number(res.data.totalCount)
        }
        this.pagination = newPagination

        this.loading = false
      })
    },
    openSelectRole () {
      this.$refs.authSelectRole.openSelect()
    },
    selectedRoles (selectRoleIds, selectRoles) {
      const params = {
        roleIds: selectRoleIds
      }
      const urlParams = {
        authId: this.authId
      }
      grantAuthToRoles(params, urlParams).then(res => {
        this.$message.success(messagePrompt.grantSuccess)
        this.getAuthRoles()
        this.$refs.authSelectRole.close()
      })
    },
    onBatchDeleteClick () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择角色')
        return
      }
      const params = {
        roleIds: this.selectedRowKeys
      }

      this.$confirm({
        title: '删除',
        content: '确定删除授权角色吗？',
        onOk: () => {
          this.deleteAuthToRoles(params)
          this.selectedRowKeys = []
        }
      })
    },

    /**
     * 确认删除
     */
    confirmDel (record) {
      const params = {
        roleIds: [record.id]
      }
      this.deleteAuthToRoles(params)
    },

    // 删除授权
    deleteAuthToRoles (params) {
      const urlParams = {
        authId: this.authId
      }
      revokeAuthToRoles(params, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.currentPage = 1
        this.getAuthRoles()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
