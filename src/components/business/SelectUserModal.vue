<!-- 选择用户通用组件，用户列表范围是：当前租户下所有用户
 * 事件：
 *   onSelectedUsers：当选中时 触发事件
-->
<template>
    <div class="select-user__wrapper">
        <a-modal title="选择用户"
                 v-model="modalVisible"
                 :confirm-loading="confirmLoading"
                 @ok="selectedUsersWrapper"
                 @cancel="close"
                 :width="1000"
                 class="model__wrapper">
            <div class="control-bar">
                <div class="right">
                    <a-input-search placeholder="请输入用户名称"
                                    style="width: 200px"
                                    v-model="searchUserName"
                                    @search="searchSubmit"/>
                </div>
            </div>

            <a-table :dataSource="data"
                     :rowSelection="{selectedRowKeys: selectedUserIds, onChange: onUserSelectChange}"
                     :pagination="pagination"
                     @change="tableChange"
                     :columns="columns"
                     rowKey="id">
                <!-- <a-table-column title="用户名称" dataIndex="userName"/>
                <a-table-column title="账号" dataIndex="account"/>
                <a-table-column title="邮箱" dataIndex="email"/>
                <a-table-column title="手机号" dataIndex="mobile"/> -->
                <template slot="userName" slot-scope="text">
                  <Overflow-Tool-Tip :text="text"></Overflow-Tool-Tip>
                </template>
                <template slot="account" slot-scope="text">
                  <Overflow-Tool-Tip :text="text"></Overflow-Tool-Tip>
                </template>
                <template slot="email" slot-scope="text">
                  <Overflow-Tool-Tip :text="text"></Overflow-Tool-Tip>
                </template>
                <template slot="mobile" slot-scope="text">
                  <Overflow-Tool-Tip :text="text"></Overflow-Tool-Tip>
                </template>
            </a-table>

        </a-modal>
    </div>
</template>

<script>

import { getUserPage } from '@/http/system'
import OverflowToolTip from '@/components/business/OverflowToolTip'

export default {
  name: 'SelectUserModal',

  components: { OverflowToolTip },

  props: [],

  data () {
    return {
      data: [],
      modalVisible: false,
      pagination: {},
      loading: false,
      searchUserName: null,
      selectedUserIds: [],
      selectedUsers: [],
      confirmLoading: false,
      columns: [
        { title: '用户名称', dataIndex: 'userName', key: 'userName', scopedSlots: { customRender: 'userName' } },
        { title: '账号', dataIndex: 'account', key: 'account', scopedSlots: { customRender: 'account' } },
        { title: '邮箱', dataIndex: 'email', key: 'email', scopedSlots: { customRender: 'email' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile', scopedSlots: { customRender: 'mobile' } }
      ]
    }
  },

  methods: {
    // 打开选择框
    openSelect () {
      this.modalVisible = true
      // 已选中的userId的数组
      this.selectedUserIds = []
      // 已选中的user的数组
      this.selectedUsers = []
      this.searchUserName = null
      this.getData()
    },
    // 点击确定后的方法
    selectedUsersWrapper () {
      if (this.selectedUserIds.length > 0) {
        this.confirmLoading = true
        // 执行selectedUsers事件方法
        this.$emit('onSelectedUsers', this.selectedUserIds, this.selectedUsers)
      } else {
        this.$message.warning('请选择用户')
      }
    },
    searchSubmit () {
      this.pagination.current = 1
      this.getData()
    },
    /**
    * @description: 获取页面表格数据
    * @return:
    */
    getData () {
      this.loading = true
      const params = {
        userName: this.searchUserName === '' ? null : this.searchUserName
      }
      getUserPage(params, this.pagination).then(res => {
        this.data = res.data.records
        this.pagination = res.pagination
        this.loading = false
      })
    },
    onUserSelectChange (selectedRowKeys, selectedRows) {
      this.selectedUserIds = selectedRowKeys
      this.selectedUsers = selectedRows
    },
    /**
     * @description: 表格筛选、排序、分页变化
     * @param {Object}  pagination
     * @return:
     */
    tableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getData()
    },
    close () {
      this.modalVisible = false
      this.confirmLoading = false
      this.pagination = {}
      this.searchUserName = null
    }
  }
}

</script>
<style lang='less' scoped>
    .model__wrapper {
        .control-bar {
            padding-bottom: 20px;
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
