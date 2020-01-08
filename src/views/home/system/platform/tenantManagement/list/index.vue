<template>
  <div>
    <div class="mbx-wrap">
      <breadcrumb/>
    </div>
    <!-- 搜索 -->
     <search-form :formOptions="searchFormItem" @onSearch="handleSubmit" @onReset="handleReset"/>
    <div class="content-bottom-section">
      <div class="control-bar">
        <add-user @updateList="queryAllUser" />
        <permission code="system_platform_tenant_updpwd">
          <a-button
            type="primary"
            @click="showUpdPwdModal"
            style="margin-left: 10px;"
          >
            修改密码
          </a-button>
          <a-modal
            title="修改密码"
            v-model="updatePasswordVisible"
            @ok="handleUpdatePassword"
          >
            <a-form style="height: 100%;" :form="updPwdform">
              <div class="content-section mb16">
                <a-form-item
                  label="新密码"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="display: inline-block; width: 80%;"
                >
                  <a-input
                    v-decorator="[
                      'password',
                      { rules: [{ required: true, message: '必填项' }] }
                    ]"
                    type="password"
                    placeholder="请输入新密码"
                  />
                </a-form-item>
                <a-form-item
                  label="确认新密码"
                  :label-col="{ span: 8 }"
                  :wrapper-col="{ span: 16 }"
                  style="display: inline-block; width: 80%;"
                >
                  <a-input
                    v-decorator="[
                      'confirmPW',
                      {
                        rules: [
                          { required: true, message: '必填项' },
                          { validator: compareToFirstPassword }
                        ]
                      }
                    ]"
                    type="password"
                    placeholder="请确认新密码"
                  />
                </a-form-item>
              </div>
            </a-form>
          </a-modal>
        </permission>
      </div>
      <a-divider style="margin: 16px 0;" />
      <a-spin class="reset-ant-tag" :spinning="false" style="text-align: center;width: 100%;">
        <a-table
          :columns="columns"
          :dataSource="data"
          :pagination="pagination"
          :rowSelection="rowSelection"
          @change="handleTableChange"
          :rowKey="item => item.id"
        >
          <span slot="tenantName" slot-scope="text, record">{{
            record.tenantName
          }}</span>
          <template slot="isProhibit" slot-scope="text, record">
            <a-tag color="red" v-if="record.isProhibit"><span>禁用</span></a-tag>
            <a-tag color="green" v-if="!record.isProhibit"><span>启用</span></a-tag>
          </template>
          <template slot="createTime" slot-scope="text, record">
            <span>
              {{ record.createTime | datefilter }}
            </span>
          </template>
          <template slot="action" slot-scope="text, record">
            <permission code="system_platform_tenant_edit">
              <a @click="edit(record, 'edit')" href="javascript:;">编辑</a>
              <a-divider type="vertical" />
            </permission>
            <permission code="system_platform_tenant_scan">
              <a href="javascript:;" @click="edit(record, 'detail')">查看</a>
              <a-divider type="vertical" />
            </permission>
            <permission code="system_platform_tenant_disabled">
              <a-popconfirm
                title="确定禁用吗？"
                okText="确定"
                cancelText="取消"
                :hidden="record.isProhibit"
                @confirm="stopTenant(record)"
              >
                <a href="javascript:;">{{!record.isProhibit ? '禁用' : '启用'}}</a>
              </a-popconfirm>
            </permission>
            <permission code="system_platform_tenant_enabled">
              <a-popconfirm
                title="确定启用吗？"
                okText="确定"
                cancelText="取消"
                :hidden="!record.isProhibit"
                @confirm="startTenant(record)"
              >
                <a href="javascript:;">{{ !record.isProhibit ? '禁用' : '启用' }}</a>
              </a-popconfirm>
            </permission>
          </template>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import Permission from '@/components/business/permission'
import moment from 'moment'
import SearchForm from '@/components/business/SearchForm'
import AddUser from './addUser'
import {
  batchOperationUser,
  deleteUser,
  getTenantPage,
  updateTenantPwd,
  stopTenant,
  startTenant
} from '@/http/system'
import { encryptionPW } from '@/utils/auth'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'tenantManagementList',
  data () {
    return {
      flod: true,
      data: [],
      columns: [
        {
          title: '租户名称',
          dataIndex: 'tenantName',
          key: 'tenantName',
          scopedSlots: { customRender: 'tenantName' }
        },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '联系号码', dataIndex: 'mobile', key: 'mobile' },
        {
          title: '状态',
          dataIndex: 'isProhibit',
          key: 'isProhibit',
          scopedSlots: { customRender: 'isProhibit' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: 160
        }
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
        }
      },
      searchFormItem: [
        { itemType: 'input', label: '租户名称', decorator: ['tenantName'] },
        { itemType: 'input', label: '邮箱', decorator: ['email'] },
        { itemType: 'input', label: '联系号码', decorator: ['mobile'] },
        { itemType: 'select', label: '租户状态', decorator: ['isProhibit'], selectOptions: [ { label: '启用', value: false }, { label: '禁用', value: true } ] }
      ],
      form: null,
      updPwdform: this.$form.createForm(this, {}),
      pagination: {},
      selectedRowKeys: [],
      updatePasswordVisible: false,
      dropdownOption: [
        {
          label: '批量锁定',
          value: '1'
        }
      ],
      startTime: '',
      endTime: ''
    }
  },
  components: {
    SearchForm,
    AddUser,
    Breadcrumb,
    Permission
  },
  created () {
    this.queryAllUser()
  },
  filters: {
    datefilter: value => moment(value).format('YYYY-MM-DD')
  },
  methods: {
    /**
     * 禁用租户
    */
    stopTenant (record) {
      const { tenantId } = record
      const urlParams = {
        tenantId: tenantId
      }
      stopTenant(urlParams, urlParams).then(res => {
        this.$message.success('禁用成功')
        this.queryAllUser()
      })
    },
    /**
     * 启用租户
    */
    startTenant (record) {
      const { tenantId } = record
      const urlParams = {
        tenantId: tenantId
      }
      startTenant(urlParams, urlParams).then(res => {
        this.$message.success('启用成功')
        this.queryAllUser()
      })
    },
    /**
     * @description: 批量操作
     * @param {type}
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
     * @description: 过滤用户类型
     * @param {type}
     * @return:
     */
    getUserType (val) {
      const item = this.userTypeOption.find(item => item.value === val)
      return item ? item.label : val
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
      const { id, isProhibit } = record
      this.disableUser(id, isProhibit)
    },

    /**
     * @description: 跳转详情页或编辑页
     * @param {Number} id    选中的id
     * @param {String} pageType  页面类型
     * @return:
     */
    edit (record, pageType) {
      let isDetailPage = pageType === 'detail'
      let routerName = pageType === 'detail' ? 'system_platform_tenant_scan' : 'system_platform_tenant_edit'
      this.$router.push({
        name: routerName,
        query: {
          isDetailPage: isDetailPage ? '1' : '0',
          name: record.tenantName,
          id: record.id
        }
      })
    },

    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.queryAllUser()
    },
    /**
     * @description: 展开筛选项
     * @param {Boolean} flod
     * @return:
     */
    toggleFlod (flod) {
      this.flod = flod
    },

    /**
     * @description: 筛选
     * @param {type}
     * @return:
     */
    handleSubmit (values) {
      this.form = values
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.pageQuery()
    },

    /**
     * @description:重置筛选
     * @param {type}
     * @return:
     */
    handleReset () {
      this.handleSubmit(null)
    },

    pageQuery () {
      this.searchParams = this.form
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
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
     * @description: 禁用用户
     * @param {Number} id
     * @param {Boolean} isProhibit
     * @return:
     */
    disableUser (id, isProhibit) {
      const batchOperationEnum = isProhibit ? '4' : '5'
      const userIdList = [id]
      const params = {
        userIdList,
        batchOperationEnum
      }
      this.batchOperationUser(params)
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
     * @param {type}
     * @return:
     */
    queryAllUser () {
      const pagination = this.pagination
      const params = this.searchParams
      getTenantPage(params, pagination).then(res => {
        this.data = res.data.records
        this.pagination = res.pagination
      })
    },
    onChange (date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
    },
    showUpdPwdModal () {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择租户')
      } else {
        this.updatePasswordVisible = true
      }
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.updPwdform
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入密码不一致！') // eslint-disable-line
      } else {
        callback()
      }
    },
    handleUpdatePassword (e) {
      this.updPwdform.validateFields((err, values) => {
        if (!err) {
          let password = values.password
          values.password = encryptionPW(password)
          const params = {
            password: values.password,
            tenantIds: this.selectedRowKeys
          }
          updateTenantPwd(params).then(res => {
            window.vm.$message.success(messagePrompt.modifySuccess)
            this.updatePasswordVisible = false
            this.updPwdform.resetFields()
          })
        }
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
