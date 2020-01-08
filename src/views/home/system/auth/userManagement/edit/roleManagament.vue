<template>
  <div class="content-section" :class="{ 'form-readonly':isDetailPage}">
    <div class="control-bar" style="margin-bottom: 16px;">
      <div class="left">
        <template v-if="!isDetailPage">
          <permission code="system_auth_user_delRole">
            <a-button style="margin-right:20px;"
            :disabled="this.selectedRows.length>0?false:true"
                      type="primary" icon="delete" @click="onBatchDeleteClick">
              批量删除
            </a-button>
          </permission>
          <permission code="system_auth_user_addRole">
            <a-button type="primary" icon="plus" @click="showModal">
              授予角色
            </a-button>
          </permission>
        </template>
      </div>
    </div>
    <a-table :columns="columns" :dataSource="data" rowKey="id"
             :pagination="pagination"
             @change="handleTableChange"
             :rowSelection="{ onChange: onSelectChange, selectedRowKeys: selectedRowKeys }">
      <template slot="action" slot-scope="text, record">
        <permission code="system_auth_user_delRole">
          <a-popconfirm title="确定删除吗？" v-if="!isDetailPage" okText="确定" cancelText="取消" @confirm="confirmDel(record)">
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </permission>
      </template>
    </a-table>

    <!-- 弹层 -->
    <a-modal title="授予角色"
             :visible="visible"
             @ok="handleOk"
             :loading="loadingModal"
             :confirmLoading="confirmLoading"
             @cancel="handleCancel" width = "1000px">
      <a-table :columns="columnsModal"
               :dataSource="dataModal"
               :pagination = "paginationModal"
               @change="tableChangeModal"
               :rowSelection="{selectedRowKeys: selectedRowKeysModal, onChange: onSelectChangeModal}"
               :rowKey="item => item.id">
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import Permission from '@/components/business/permission'
import { getUserRolePage, getRolePage, addUserRole, deleteRolesByUserId } from '@/http/system'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'roleManagement',
  components: {
    Permission
  },
  data () {
    return {
      data: [],
      columns: [
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '角色描述', dataIndex: 'description', key: 'description' },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedRowKeys: [],
      selectedRows: [],
      size: 10,
      pages: 1,
      total: 0,
      // 弹出层相关---
      visible: false,
      columnsModal: [
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '角色描述', dataIndex: 'description', key: 'description' }
      ],
      loadingModal: false,
      confirmLoading: false,
      selectedRowKeysModal: [],
      sizeModal: 10,
      pagesModal: 1,
      totalModal: 0,
      dataModal: []
    }
  },
  computed: {
    userId () {
      return this.$route.query.id
    },
    isDetailPage () {
      return this.$route.query.isDetailPage === '1'
    },

    pagination () {
      return {
        showSizeChanger: true,
        userIdkey: 'key',
        showQuickJumper: true,
        showTotal: total => `共 ${this.total} 条记录`,
        pageSize: this.size,
        current: this.pages,
        total: Number(this.total),
        searchParams: {}
      }
    },

    paginationModal () {
      return {
        showSizeChanger: true,
        userIdkey: 'key',
        showQuickJumper: true,
        showTotal: total => `共 ${this.totalModal} 条记录`,
        pageSize: this.sizeModal,
        current: this.pagesModal,
        total: Number(this.totalModal),
        searchParams: {}
      }
    }
  },
  created () {
    this.getUserRole()
  },
  methods: {
    /**
     * 分页
     */
    handleTableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.size = pageSize
      this.pages = current
      this.getUserRole()
    },
    getUserRole () {
      const pageParams = {
        pageSize: this.size,
        currentPage: this.pages
      }
      const params = Object.assign(pageParams)
      const urlParams = { userId: this.userId }
      getUserRolePage(params, urlParams).then(res => {
        const { records, totalCount } = res.data
        this.data = records
        this.total = totalCount
        // this.rowSelection = this.getRowSelection(ids)
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    confirmDel (record) {
      this.deleteRolesByUserId([record.roleId])
    },
    // 删除用户下角色
    deleteRolesByUserId (roleIds) {
      const params = { roleIds: roleIds }
      const urlParams = { userId: this.userId }
      deleteRolesByUserId(params, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.pages = 1
        this.getUserRole()
      })
    },
    onBatchDeleteClick () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择角色！')
        return
      }
      this.$confirm({
        title: '删除',
        content: '确定删除授权角色吗？',
        onOk: () => {
          const rowIds = []
          this.selectedRows.forEach(item => {
            rowIds.push(item.roleId)
          })
          this.selectedRows = []
          this.selectedRowKeys = []
          this.deleteRolesByUserId(rowIds)
        }
      })
    },
    // 弹出层相关------
    showModal () {
      this.visible = true
      this.selectedRowKeysModal = []
      this.pagesModal = 1
      this.getRolesPage()
    },
    handleOk () {
      if (this.selectedRowKeysModal.length === 0) {
        this.$message.error('请选择角色!')
      } else {
        this.confirmLoading = true
        const params = { roleIds: this.selectedRowKeysModal }
        const urlParams = { userId: this.userId }
        addUserRole(params, urlParams).then(res => {
          this.$message.success(messagePrompt.grantSuccess)
          this.confirmLoading = false
          this.getUserRole()
          this.visible = false
        })
      }
    },
    handleCancel () {
      this.visible = false
    },
    getRolesPage () {
      this.dataModal = []
      let params = {
        pageSize: this.sizeModal,
        current: this.pagesModal
      }
      this.loadingModal = true
      getRolePage(null, params).then(res => {
        const { records, totalCount } = res.data
        this.dataModal = records
        this.totalModal = totalCount
        this.loadingModal = false
      }).catch(() => {
        this.loadingModal = false
      })
    },
    onSelectChangeModal (selectedRowKeys) {
      this.selectedRowKeysModal = selectedRowKeys
    },
    // 分页切换触发
    tableChangeModal (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.sizeModal = pageSize
      this.pagesModal = current
      this.getRolesPage()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
