<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap">
      <breadcrumb />
    </div>
    <search-form :formOptions="searchFormItem" @onSearch="search" @onReset="reset"/>
    <div class="content-bottom-section reset-ant-tag">
      <div class="control-bar">
        <add-user @updateList="queryAllUser"/>
        <change-password :userIds="selectedRowKeys"/>
        <lock-user @updateList="queryAllUser" :userIds="selectedRowKeys"/>
        <import-user @updateList="queryAllUser"/>
      </div>
      <a-divider style="margin: 16px 0;"/>
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="pagination"
        :rowSelection="{
          selectedRowKeys,
          onChange: onRowSelection
        }"
        @change="handleTableChange"
        rowKey="userId"
        :scroll="{ x: 1500}"
      >
        <template slot="account" slot-scope="text, record">
          <overflow-tool-tip :text="record.account" />
        </template>

        <template slot="userTypeTransName" slot-scope="text, record">
          <overflow-tool-tip :text="record.userTypeTransName"/>
        </template>

        <template slot="userName" slot-scope="text, record">
          <overflow-tool-tip :text="record.userName"/>
        </template>

        <template slot="email" slot-scope="text, record">
          <overflow-tool-tip :text="record.email"/>
        </template>

        <template slot="isLock" slot-scope="text, record">
          <a-tag color="red" v-if="record.isLock"><span>是</span></a-tag>
          <a-tag color="green" v-if="!record.isLock"><span>否</span></a-tag>
        </template>

        <template slot="isProhibit" slot-scope="text, record">
          <a-tag color="red" v-if="record.isProhibit"><span>禁用</span></a-tag>
          <a-tag color="green" v-if="!record.isProhibit"><span>启用</span></a-tag>
        </template>

        <template slot="organizationListToString" slot-scope="text, record">
          <overflow-tool-tip :text="record.organizationsName"/>
        </template>
        <template slot="action" slot-scope="text, record">
          <permission code="system_auth_user_edit">
            <a
              v-if="record.userType == 2"
              @click="edit(record, 'edit')"
              href="javascript:;"
            >编辑</a>
            <a-divider type="vertical" v-if="record.userType == 2"/>
          </permission>
          <permission code="system_auth_user_scan">
            <a href="javascript:;" @click="edit(record, 'detail')">查看</a>
            <a-divider type="vertical" v-if="record.userType == 2"/>
          </permission>
          <permission code="system_auth_user_del">
            <a-popconfirm
              v-if="record.userType == 2"
              title="确定删除吗？"
              okText="确定"
              cancelText="取消"
              @confirm="confirmDel(record)"
            >
              <a href="javascript:;">删除</a>
            </a-popconfirm>
            <a-divider type="vertical" v-if="record.userType == 2"/>
          </permission>
          <permission code="system_auth_user_disabled">
            <a-popconfirm
              v-if="record.isProhibit == false && record.userType == 2"
              title="确定禁用吗？"
              okText="确定"
              cancelText="取消"
              @confirm="confirmDisable(record)"
            >
              <a href="javascript:;">{{ !record.isProhibit ? '禁用' : '启用' }}</a>
            </a-popconfirm>
          </permission>
          <permission code="system_auth_user_enabled">
            <a-popconfirm
              v-if="record.isProhibit == true && record.userType == 2"
              title="确定启用吗？"
              okText="确定"
              cancelText="取消"
              @confirm="confirmEnabled(record)"
            >
              <a href="javascript:;">{{ !record.isProhibit ? '禁用' : '启用' }}</a>
            </a-popconfirm>
          </permission>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import SearchForm from '@/components/business/SearchForm'
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import AddUser from './addUser'
import ChangePassword from './changePassword'
import LockUser from './lockUser'
import ImportUser from './importUser'
import Permission from '@/components/business/permission'
import {
  getUserPage,
  batchOperationUser,
  deleteUser,
  disableUser,
  enabledUser
} from '@/http/system'
import { formatFormSelectDictItem } from '@/utils'
import OverflowToolTip from '@/components/business/OverflowToolTip'
import { messagePrompt } from '@/utils/config'
export default {
  name: 'userManagementList',
  components: {
    AddUser,
    ChangePassword,
    LockUser,
    ImportUser,
    Breadcrumb,
    Permission,
    OverflowToolTip,
    SearchForm
  },
  data () {
    return {
      flod: true,
      data: [],
      columns: [
        { title: '账号', dataIndex: 'account', key: 'account', scopedSlots: { customRender: 'account' } },
        { title: '用户名称', dataIndex: 'userName', key: 'userName', scopedSlots: { customRender: 'userName' } },
        {
          title: '用户类型',
          dataIndex: 'userTypeTransName',
          key: 'userTypeTransName',
          scopedSlots: { customRender: 'userTypeTransName' }
        },
        { title: '邮箱', dataIndex: 'email', key: 'email', scopedSlots: { customRender: 'email' } },
        { title: '手机号', dataIndex: 'mobile', key: 'mobile' },
        {
          title: '锁定',
          dataIndex: 'isLock',
          key: 'isLock',
          scopedSlots: { customRender: 'isLock' }
        },
        {
          title: '状态',
          dataIndex: 'isProhibit',
          key: 'isProhibit',
          scopedSlots: { customRender: 'isProhibit' }
        },
        {
          title: '部门',
          dataIndex: 'organizationList',
          key: 'organizationList',
          scopedSlots: { customRender: 'organizationListToString' }
        },
        // { title: '职位', dataIndex: 'positionList', key: 'positionList', scopedSlots: { customRender: 'positionListToString' } },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: 200,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      form: this.$form.createForm(this, {}),
      pagination: {},
      selectedRowKeys: [],
      dropdownOption: [
        {
          label: '批量锁定',
          value: '1'
        }
      ],
      searchFormItem: [
        { itemType: 'input', label: '账号', decorator: ['account'] },
        { itemType: 'input', label: '用户名称', decorator: ['userName'] },
        { itemType: 'select', label: '用户类型', decorator: ['userType'], selectOptions: [] },
        { itemType: 'input', label: '手机号', decorator: ['mobile'] }
      ],
      searchParams: null
    }
  },
  mounted () {
    this.searchFormItem = formatFormSelectDictItem(
      this.searchFormItem,
      'userType'
    )
    this.queryAllUser()
  },

  methods: {
    /**
     * @description: 查询
     */
    search (values) {
      this.searchParams = values
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.queryAllUser()
    },
    /**
     * @description: 重置
     */
    reset () {
      this.search(null)
    },
    onRowSelection (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    /**
     * @description: 批量操作
     * @param e
     * @return:
     */
    handleMenuClick (e) {
      const length = this.selectedRowKeys.length
      if (length) {
        const params = {
          userIds: this.selectedRowKeys
        }
        this.batchOperationUser(params)
      } else {
        this.$message.warning('请选择用户')
      }
    },

    /**
     * @description: 确认删除
     * @param {Object} record
     * @return:
     */
    confirmDel (record) {
      const { id } = record
      this.delUser(id)
    },

    /**
     * @description:  确认禁用
     * @param {Object} record
     * @return:
     */
    confirmDisable (record) {
      const { id } = record
      this.disableUser(id)
    },
    /**
     * @description:  确认启用
     * @param {Object} record
     * @return:
     */
    confirmEnabled (record) {
      const { id } = record
      this.enabledUser(id)
    },
    /**
     * @description: 跳转详情页或编辑页
     * @param {Number} record    选中的记录
     * @param {String} pageType  页面类型
     * @return:
     */
    edit (record, pageType) {
      const isDetailPage = pageType === 'detail'
      let routerName = pageType === 'detail' ? 'system_auth_user_scan' : 'system_auth_user_edit'
      this.$router.push({
        name: routerName,
        query: {
          name: record.userName,
          id: record.id,
          isDetailPage: isDetailPage ? '1' : '0'
        }
      })
    },
    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination) {
      this.pagination = pagination
      this.queryAllUser()
    },
    /**
     * @description: 删除用户
     * @param {Number} id
     * @return:
     */
    delUser (id) {
      const urlParams = {
        userId: id
      }
      deleteUser(urlParams, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.queryAllUser()
      })
    },
    /**
     * @description: 启用用户
     * @param {Number} id
     * @return:
     */
    enabledUser (id) {
      const userId = id
      const urlParams = {
        userId
      }
      enabledUser(userId, urlParams).then(res => {
        this.queryAllUser()
        this.$message.success(messagePrompt.validSuccess)
      })
    },
    /**
     * @description: 禁用用户
     * @param {Number} id
     * @return:
     */
    disableUser (id) {
      const userId = id
      const urlParams = {
        userId
      }
      disableUser(userId, urlParams).then(res => {
        this.queryAllUser()
        this.$message.success(messagePrompt.invalidSuccess)
      })
    },
    /**
     * @description: 批量操作用户
     * @param {Object} params   {userIdList:[],batchOperationEnum:"1"}
     * batchOperationEnum :1,"批量删除"2,"批量锁定"3,"批量解锁"4,"批量禁用"5,"批量 * 启用"
     * @return:
     */
    batchOperationUser (params) {
      batchOperationUser(params).then(res => {
        this.queryAllUser()
        this.$message.success(messagePrompt.operateSuccess)
      })
    },

    /**
     * @description: 获取所有用户
     * @return:
     */
    queryAllUser () {
      const pagination = this.pagination
      const params = this.searchParams
      getUserPage(params, pagination).then(res => {
        this.data = res.data.records
        this.pagination = res.pagination
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .control-bar {
    &:after {
      content: '';
      display: block;
      clear: both;
    }

    .bar-right {
      float: right;

      button {
        margin-right: 20px;
      }
    }
  }
</style>
