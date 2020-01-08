<!-- authorizeUser -->
<template>
  <div class="authorize-user__wrapper">
    <div class="content-section mb16">
      <p class="section-title">授权用户</p>
      <div class="control-bar">
        <div class="left">

          <template v-if="!isDetailPage">
            <permission code="system_auth_role_delGrant">
              <a-button style="margin-right:20px;"
                type="primary" icon="delete" :disabled="this.selectedRows.length>0?false:true" @click="onBatchDeleteClick">
                批量删除
              </a-button>
            </permission>
            <permission code="system_auth_role_grantUser">
              <a-button type="primary" icon="plus" @click="openSelectUser">
                授予用户
              </a-button>
            </permission>
          </template>

        </div>

        <div class="right">
          <a-input-search placeholder="请输入"
                          v-model="searchKey"
                          style="width: 200px"
                          @search="onSearch" />
        </div>

      </div>
      <a-table :columns="columns"
               :dataSource="data"
               rowKey="id"
               :rowSelection="{ onChange: onSelectionChange, selectedRowKeys}"
               :pagination="pagination"
               @change="handleTableChange">
        <template slot="action"
                  slot-scope="text, record">
          <permission code="system_auth_role_delGrant">
            <a-popconfirm title="确定删除吗？"
                          @confirm="confirm(record)"
                          okText="确定"
                          cancelText="取消"
                          v-if="!isDetailPage">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </permission>
        </template>
      </a-table>
    </div>
    <SelectUserModal ref="roleSelectUser"
                    @onSelectedUsers="roleSelectedUsers">
    </SelectUserModal>
  </div>
</template>

<script>
import Permission from '@/components/business/permission'
import SelectUserModal from '@/components/business/SelectUserModal'
import { messagePrompt } from '@/utils/config'
import { addUsersInBatches, getAllRoleUser, deleteRoleUser, revokeRoleToUsers } from '@/http/system'
const columns = [
  { title: '用户名称', dataIndex: 'userName', key: 'userName' },
  { title: '用户类型', dataIndex: 'userTypeTransName', key: 'userTypeTransName' },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '手机号', dataIndex: 'mobile', key: 'mobile' }
]

columns.push(
  { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
)

export default {
  name: 'authorizeUser',
  mixins: [],
  components: {
    SelectUserModal,
    Permission
  },

  props: [],

  data () {
    return {
      columns,
      data: [],
      modelData: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
        showTotal: total => `共 ${total} 条记录`,
        showQuickJumper: true,
        showSizeChanger: true
      },
      loading: false,
      modelLoading: false,
      searchKey: '',
      modelSearchKey: '',
      selectedRowKeys: [],
      selectedRows: [],
      visible: false,
      roleId: this.$route.query.id
    }
  },
  computed: {
    /**
     * @description: 判读是详情页还是编辑页
     * @param {type}
     * @return:
     */
    isDetailPage () {
      return this.$route.query.isDetailPage === '1'
    }
  },

  watch: {},

  created () {
    this.getData()
  },

  mounted () { },

  destroyed () { },

  methods: {
    /**
     * @description: 表格选中回调
     * @return:
     */
    onSelectionChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      // 选中时使用selectedRows，因为selectedRowKeys会有问题
      this.selectedRows = selectedRows
    },
    /**
     * @description: 显示弹窗获取数据
     * @param {type}
     * @return:
     */
    displayModel () {
      this.visible = true
      this.getModelTableData()
    },
    /**
     * @description: 更改页码
     * @param {Object}  pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.pagination = {
        ...pagination,
        pageSize,
        current
      }
      this.getData()
    },
    /**
     * @description: 删除确认框
     * @param {Object}  record {userRoleId:''...}
     * @return:
     */
    confirm (record) {
      const { userRoleId } = record
      this.deleteRoleUser(userRoleId)
    },
    /**
     * @description: 删除角色下用户
     * @param {userRoleId} urlParams {userRoleId:''...}
     * @return:
     */
    deleteRoleUser (userRoleId) {
      const urlParams = {
        userRoleId: userRoleId
      }

      const params = {
        userRoleId: userRoleId
      }

      deleteRoleUser(params, urlParams).then((res) => {
        this.$message.success(messagePrompt.delSuccess)
        this.selectedRowKeys = []
        this.selectedRows = []
        this.pagination.current = 1
        this.getData()
      })
    },
    /**
     * @description: 批量删除角色下用户
     */
    onBatchDeleteClick () {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择用户')
        return
      }
      const urlParams = {
        roleId: this.roleId
      }

      const userIds = []
      this.selectedRows.forEach(item => {
        userIds.push(item.userId)
      })
      const params = {
        ...urlParams,
        userIds: userIds
      }

      this.$confirm({
        title: '删除',
        content: '确定删除授权用户吗？',
        onOk: () => {
          revokeRoleToUsers(params, urlParams).then(res => {
            this.$message.success(messagePrompt.delSuccess)
            this.selectedRowKeys = []
            this.selectedRows = []
            this.pagination.current = 1
            this.getData()
          })
        }
      })
    },
    /**
     * @description: 搜索
     * @param {String} value
     * @return:
     */
    onSearch (value) {
      this.pagination = {
        ...this.pagination,
        current: 1
      }
      this.searchKey = value
      this.getData()
    },
    roleSelectedUsers (selectedUserIds, selectedUsers) {
      const urlParams = {
        roleId: this.roleId
      }

      const params = {
        ...urlParams,
        userIds: selectedUserIds
      }
      addUsersInBatches(params, urlParams).then(res => {
        this.$message.success(messagePrompt.grantSuccess)
        this.visible = false
        this.getData()
        this.$refs.roleSelectUser.close()
      })
    },
    openSelectUser () {
      this.$refs.roleSelectUser.openSelect()
    },
    /**
     * @description: 获取页面表格数据
     * @param {type}
     * @return:
     */
    getData () {
      this.loading = true

      const pageParams = {
        pageSize: this.pagination.pageSize,
        currentPage: this.pagination.current
      }

      const searchParams = {
        userName: this.searchKey,
        roleId: this.roleId
      }
      const params = Object.assign(pageParams, searchParams)

      getAllRoleUser(params).then(res => {
        const { records, totalCount } = res.data
        this.data = records
        this.total = Number(totalCount)
        this.pagination = {
          ...this.pagination,
          total: Number(totalCount)
        }
        this.loading = false
      })
    }
  }
}

</script>
<style lang='less' scoped>
.authorize-user__wrapper {
  .control-bar {
    padding: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      button + button {
        margin-left: 20px;
      }
    }
  }
}
.model__wrapper {
  .control-bar {
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
