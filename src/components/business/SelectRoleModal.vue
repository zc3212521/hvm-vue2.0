<!-- 选择角色通用组件，模式对话框，角色列表范围是：当前租户下所有角色
 * 事件：
 *   onSelectedRoles：当选中时 触发事件
-->
<template>
  <div class="select-org">
    <a-modal title="选择角色"
             v-model="modalVisible"
             :confirm-loading="confirmLoading"
             @ok="selectedRolesWrapper"
             @cancel="close"
             :width="800"
             class="model__wrapper">
      <a-table :columns="columns"
               :dataSource="data"
               rowKey="id"
               @change="tableChange"
               :rowSelection="{selectedRowKeys: selectedRoleIds, onChange: onSelectChange}"
               :pagination="pagination">
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import { getRolePage } from '@/http/system'
//
export default {
  name: 'SelectRoleModal',
  data () {
    return {
      data: [],
      columns: [
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '角色描述', dataIndex: 'description', key: 'description' }
      ],
      modalVisible: false,
      pagination: {},
      loading: false,
      selectedRoleIds: [],
      selectedRoles: [],
      confirmLoading: false
    }
  },
  computed: {
  },
  created () {
  },
  watch: {
  },
  methods: {
    openSelect () {
      this.modalVisible = true
      this.selectedRoleIds = []
      this.selectedRoles = []
      this.getRolePage()
    },
    getRolePage () {
      this.loading = true

      getRolePage({}, this.pagination).then(res => {
        this.data = res.data.records
        this.pagination = res.pagination
        this.loading = false
      })
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRoleIds = selectedRowKeys
      this.selectedRoles = selectedRows
    },
    selectedRolesWrapper () {
      if (this.selectedRoleIds.length > 0) {
        this.confirmLoading = true
        this.$emit('onSelectedRoles', this.selectedRoleIds, this.selectedRoles)
      } else {
        this.$message.warning('请选择角色')
      }
    },
    tableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getRolePage()
    },
    close () {
      this.modalVisible = false
      this.confirmLoading = false
      this.pagination = {}
    }
  }
}
</script>
