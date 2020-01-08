<template>
  <div class="content-section">
    <div style="margin-bottom: 16px;">
      <a-button type="primary" style="margin-right: 20px;">批量操作</a-button>
      <a-button type="primary" icon="plus">
        授予
      </a-button>
    </div>
    <div>
      <a-table
        :columns="columns"
        :dataSource="data"
        :rowSelection="rowSelection"
        :pagination="pagination"
        rowKey="userId"
      >

      </a-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'authDistributeUser',
  data () {
    return {
      data: [],
      columns: [
        { title: '用户名称', dataIndex: 'userName', key: 'userName' },
        { title: '用户类型', dataIndex: 'userType', key: 'userType', scopedSlots: { customRender: 'userType' } },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile' },
        { title: '状态', dataIndex: 'isLock', key: 'isLock', scopedSlots: { customRender: 'status' } },
        { title: '部门', dataIndex: 'department', key: 'department' },
        { title: '职位', dataIndex: 'position', key: 'position' },
        { title: '操作', dataIndex: 'action', key: 'action', scopedSlots: { customRender: 'action' } }
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        onSelect: (record, selected, selectedRows) => {
          // console.log(record, selected, selectedRows)
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
          // console.log(selected, selectedRows, changeRows)
        }
      },
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: (current, size) => {
          // console.log('chagnePage', current, size)
        }
      },
      loading: false
    }
  }
}
</script>

<style lang="less" scoped>
</style>
