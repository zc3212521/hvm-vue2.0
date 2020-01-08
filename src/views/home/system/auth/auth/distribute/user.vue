<template>
  <div class="content-section">
    <div style="margin-bottom: 16px;">
      <permission code="system_auth_auth_delUser">
        <a-button style="margin-right:20px;" :disabled="this.selectedRowKeys.length>0?false:true" type="primary" icon="delete" @click="onBatchDeleteClick">
          批量删除
        </a-button>
      </permission>
      <permission code="system_auth_auth_addUser">
        <a-button type="primary" icon="plus" @click="openSelectUser">
          授予用户
        </a-button>
      </permission>
    </div>
    <div class="reset-ant-tag">
      <a-table
        :columns="columns"
        :dataSource="data"
        :rowSelection="{ onChange: onSelectionChange, selectedRowKeys}"
        :pagination="pagination"
        @change="tableChange"
        rowKey="userId"
      >
        <template
          slot="status"
          slot-scope="text, record"
        >
          <a-tag color="red" v-if="record.isProhibit"><span>禁用</span></a-tag>
          <a-tag color="green" v-if="!record.isProhibit"><span>启用</span></a-tag>
        </template>
        <template
          slot="organizationListToString"
          slot-scope="text, record"
        >
          <Overflow-Tool-Tip :text="record.organizationsName"></Overflow-Tool-Tip>
        </template>
        <template slot="action" slot-scope="text, record">
          <permission code="system_auth_auth_delUser">
            <a-popconfirm title="确定删除此授权？" okText="确定" cancelText="取消" @confirm="confirmDel(record)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </permission>
        </template>
      </a-table>
    </div>

    <SelectUserModal
      ref="authSelectUser"
      @onSelectedUsers="authSelectedUsers">
    </SelectUserModal>
  </div>
</template>

<script>
import SelectUserModal from '@/components/business/SelectUserModal'
import Permission from '@/components/business/permission'
import { getAllAuthUsers, grantAuthToUsers, revokeAuthToUsers } from '@/http/system'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'authDistributeUser',
  components: {
    SelectUserModal,
    Permission
  },
  props: ['authId'],
  data () {
    return {
      data: [],
      pageSize: 10,
      currentPage: 1,
      selectedRowKeys: [],
      columns: [
        { title: '用户名称', dataIndex: 'userName', key: 'userName' },
        { title: '用户类型', dataIndex: 'userTypeTransName', key: 'userTypeTransName' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile' },
        { title: '状态', dataIndex: 'isLock', key: 'isLock', scopedSlots: { customRender: 'status' } },
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
    this.getAuthUsers()
  },
  methods: {
    onSelectionChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = []
      selectedRows.forEach(item => {
        this.selectedRowKeys.push(item.userId)
      })
    },
    getAuthUsers () {
      const urlParams = {
        authId: this.authId
      }
      const params = {
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }
      this.loading = true
      getAllAuthUsers(params, urlParams).then(res => {
        this.data = res.data.records
        const newPagination = {
          ...this.pagination,
          current: Number(res.data.currentPage),
          pageSize: this.pageSize,
          total: Number(res.data.totalCount)
        }
        this.pagination = newPagination
      })
    },
    authSelectedUsers (selectedUserIds, selectedUsers) {
      const params = {
        userIds: selectedUserIds
      }
      const urlParams = {
        authId: this.authId
      }
      grantAuthToUsers(params, urlParams).then(res => {
        this.$message.success(messagePrompt.grantSuccess)
        this.getAuthUsers()
        this.$refs.authSelectUser.close()
      })
    },
    openSelectUser () {
      this.$refs.authSelectUser.openSelect()
    },
    tableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.pageSize = pageSize
      this.currentPage = current
      this.getAuthUsers()
    },
    onBatchDeleteClick () {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择用户')
        return
      }
      const params = {
        userIds: this.selectedRowKeys
      }

      this.$confirm({
        title: '删除',
        content: '确定删除授权用户吗？',
        onOk: () => {
          this.deleteAuthToUsers(params)
          this.selectedRowKeys = []
        }
      })
    },
    confirmDel (record) {
      const params = {
        userIds: [record.userId]
      }
      this.deleteAuthToUsers(params)
    },
    deleteAuthToUsers (params) {
      const urlParams = {
        authId: this.authId
      }
      revokeAuthToUsers(params, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.currentPage = 1
        this.getAuthUsers()
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>
