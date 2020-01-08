<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb  /></div>
    <search-form :formOptions="searchFormItem" @onSearch="search" @onReset="reset"/>
    <div class="content-bottom-section">
      <div class="control-bar">
        <add-role @get-data="getData" />
      </div>
      <a-divider style="margin: 16px 0;" />
      <a-table
        :columns="columns"
        :dataSource="data"
        rowKey="id"
        :pagination="pagination"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text, record">
          <span v-if="record.status === '1'">启用</span>
          <span v-else>禁用</span>
        </template>
        <template slot="action" slot-scope="text, record">
          <permission code="system_auth_role_edit">
            <a @click="edit(record.id)" href="javascript:;">编辑</a>
            <a-divider type="vertical" />
          </permission>
          <permission code="system_auth_role_scan">
            <a href="javascript:;" @click="edit(record.id, 'detail')">查看</a>
            <a-divider type="vertical" />
          </permission>
          <permission code="system_auth_role_del">
            <a-popconfirm
              title="确定删除吗？"
              @confirm="confirm(record)"
              okText="确定"
              cancelText="取消"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </permission>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import SearchForm from '@/components/business/SearchForm'
import Permission from '@/components/business/permission'
import AddRole from './addRole'
import { getRolePage, deleteRole } from '@/http/system'
import { messagePrompt } from '@/utils/config'
export default {
  name: 'userManagement',
  components: {
    SearchForm,
    AddRole,
    Breadcrumb,
    Permission
  },
  data () {
    return {
      flod: true,
      data: [],
      columns: [
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '描述', dataIndex: 'description', key: 'description' },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: 150
        }
      ],
      searchFormItem: [
        { itemType: 'input', label: '角色名称', decorator: ['roleName'] }
      ],
      pagination: {},
      roleName: ''
    }
  },

  created () {
    this.getData()
  },
  methods: {
    /**
     * @description: 查询
     */
    search (values) {
      this.roleName = values
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.getData()
    },
    /**
     * @description: 重置
     */
    reset () {
      this.search(null)
    },
    /**
     * @description: 删除确认框
     * @param {Object}  record {roleId:''...}
     * @return:
     */
    confirm (record) {
      const { roleId } = record
      const urlParams = { roleId }
      this.deleteRole(urlParams)
    },
    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getData()
    },
    /**
     * @description: 跳转详情页或编辑页
     * @param {Number} id    选中的id
     * @param {String} pageType  页面类型
     * @return:
     */
    edit (id, pageType) {
      const isDetailPage = pageType === 'detail'
      let routerName = pageType === 'detail' ? 'system_auth_role_scan' : 'system_auth_role_edit'
      this.$router.push({
        name: routerName,
        query: {
          isDetailPage: isDetailPage ? '1' : '0',
          id
        }
      })
    },
    /**
     * @description: 删除
     * @param {Object} urlParams {roleId:''...}
     * @return:
     */
    deleteRole (urlParams) {
      deleteRole(urlParams, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.getData()
      })
    },
    /**
     * @description: 获取列表数据
     * @param {type}
     * @return:
     */
    getData () {
      const pagination = this.pagination
      const params = this.roleName || null
      getRolePage(params, pagination).then(res => {
        this.data = res.data.records
        this.pagination = res.pagination
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
