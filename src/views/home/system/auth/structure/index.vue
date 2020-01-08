<template>
  <div class="content-section">
    <div class="mbx-wrap" style="margin-bottom:20px;">
      <breadcrumb  />
      <span class="add-bread">/&nbsp;&nbsp;{{this.selectedOrg.title}}</span>
    </div>
    <a-row>
      <a-col :span="6" style="width:268px;">
        <div class="left-wrap">
          <!-- 职位面板 -->
          <permission code="system_auth_structure_add">
            <div class="add_org">
              <a-button block @click="openAddOrg" type="primary"><a-icon type="plus" />新增部门</a-button>
            </div>
          </permission>
          <organization-panel
            @selectedOrg="onSelectedOrg"
            :refresh-flag="refreshTreeFlag"
          ></organization-panel>
        </div>
      </a-col>
      <!-- 职位下的角色 -->
      <a-col :span="18" style="width: calc(100% - 268px);">
        <!--        <div class="right-wrap" v-show="!(selectedOrg && selectedOrg.title)">-->
        <!--          <a-empty :description="'请先选择部门'" />-->
        <!--        </div>-->
        <div class="right-wrap">
          <h-top-bar
            @handleSearch="handleSubmit"
            @handleReset="handleReset"
            @toggleFlod="toggleFlod"
            :disabled="!isOrgSelected()"
            :canFlod="false"
          >
            <a-form :form="form">
              <a-row :gutter="24">
                <a-col
                  :span="flod ? '11' : '8'"
                  v-for="item in searchFormItem"
                  :key="item.label"
                >
                  <custom-form-item
                    :item="item"
                    :formInlineItemLayout="{
                      labelCol: { span: 7 },
                      wrapperCol: { span: 17 }
                    }"
                    inline-style=""
                  >
                  </custom-form-item>
                </a-col>
              </a-row>
            </a-form>
          </h-top-bar>
          <div style="margin: 16px 0;">
            <p class="right-title" style="margin-right: 20px;">
              {{ this.selectedOrg.title ? this.selectedOrg.title + '[' + this.selectedOrg.data.orgCode + ']': '未选择部门' }}
            </p>
            <permission code="system_auth_structure_edit">
              <a-button
                size="small"
                type="primary"
                @click="openEditOrg"
                :disabled="!isOrgSelected()"
                >编辑</a-button
              >
            </permission>
            <permission code="system_auth_structure_del">
              <a-button
                size="small"
                type="danger"
                ghost
                @click="deleteOrg(selectedOrg.data)"
                style="margin-left: 4px"
                :disabled="!isOrgSelected()"
                >删除</a-button
              >
            </permission>
          </div>
          <div style="margin-bottom: 16px;">
            <permission code="system_auth_structure_delStaff">
              <a-button
                style="margin-right:20px;"
                :disabled="this.selectedRowKeys.length>0?false:true"
                type="primary"
                icon="delete"
                @click="onBatchDeleteClick"
              >
                批量删除
              </a-button>
            </permission>
            <permission code="system_auth_structure_addStaff">
              <a-button
                type="primary"
                @click="openSelectUser"
                :disabled="!isOrgSelected()"
              >
                <a-icon type="plus" />
                <span>添加人员</span>
              </a-button>
            </permission>
          </div>
          <div class="reset-ant-tag">
            <a-spin :spinning="false" style="text-align: center;width: 100%;">
              <a-table
                :columns="columns"
                :dataSource="data"
                :pagination="pagination"
                rowKey="id"
                :rowSelection="rowSelection"
                @change="handleTableChange"
              >
                <template slot="roleName" slot-scope="text, record">
                  <a-tag
                    style="margin-bottom: 5px;"
                    v-for="(item, index) in record.roles"
                    :key="index"
                  >{{ item.roleName }}</a-tag>
                </template>
                <template slot="positionName" slot-scope="text, record">
                  <span
                    style="padding-right:10px;"
                    v-for="(item, index) in record.sysPositions"
                    :key="index"
                  >{{ item.positionName }}</span>
                </template>
                <template slot="action" slot-scope="text, record">
                  <permission code="system_auth_structure_delStaff">
                    <a-popconfirm
                      title="确定删除吗？"
                      okText="确定"
                      cancelText="取消"
                      @confirm="confirmDel(record)"
                    >
                      <a href="javascript:;">删除</a>
                    </a-popconfirm>
                  </permission>
                </template>
              </a-table>
            </a-spin>
          </div>
        </div>
      </a-col>
    </a-row>
    <SelectUserModal ref="orgSelectUser" @onSelectedUsers="selectedUsers" />
    <!-- 抽屉组件-->
    <pop-toggle
      :title="showTitles[showIndex] + '部门'"
      width="720"
      @close="onClose"
      @ok='onOrgSubmit'
      :visible="visibleOrg"
    >
      <template #content>
        <addForm ref="addForm" :showIndex="showIndex" :editOrg="editOrg"></addForm>
      </template>
    </pop-toggle>

  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import PopToggle from '@/components/business/PopToggle'
import AddForm from './addForm'
import HTopBar from '@com/business/HTopBar.vue'
import Permission from '@/components/business/permission'
import OrganizationPanel from './organizationPanel'
import CustomFormItem from '@com/business/CustomFormItem'
import { deleteEmpty } from '@/utils'
import SelectUserModal from '@/components/business/SelectUserModal'
import { messagePrompt } from '@/utils/config'
import {
  deleteOrganizationUserByBatches,
  getUserList,
  getOrganList,
  addOrganization,
  updateOrganization,
  saveOrganUserRelative,
  deleteOrganization
} from '@/http/system'

const searchFormItem = [
  {
    label: '用户名',
    placeholder: '请输入用户名称',
    decorator: ['userName']
  }
]

const columns = [
  { title: '用户名称', dataIndex: 'userName', key: 'userName' },
  { title: '角色',
    dataIndex: 'roles',
    key: 'roles',
    scopedSlots: { customRender: 'roleName' }
  },
  { title: '职位',
    dataIndex: 'sysPositions',
    key: 'sysPositions',
    scopedSlots: { customRender: 'positionName' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  name: 'orgManagement',
  components: {
    HTopBar,
    OrganizationPanel,
    CustomFormItem,
    SelectUserModal,
    Breadcrumb,
    PopToggle,
    AddForm,
    Permission
  },
  data () {
    return {
      orgKey: 1,
      flod: true,
      data: [],
      columns,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = []
          selectedRows.forEach(item => {
            this.selectedRowKeys.push(item.orgUserId)
          })
        }
      },
      searchFormItem,
      size: 10,
      pages: 1,
      total: 0,
      selectId: '',
      editId: null,
      searchParams: {},
      form: this.$form.createForm(this, {}),
      addForm: this.$form.createForm(this, {}),
      selectedRowKeys: [],
      loading: false,
      title: '新增',
      readonly: false, // 查看状态标识
      selectOrgId: null,
      visibleOrg: false,
      editOrgForm: this.$form.createForm(this, {}),
      orgHighData: [],
      editMode: null,
      editOrg: {},
      selectedOrg: {},
      refreshTreeFlag: null,
      showIndex: 0, // 0 新增，1 编辑，2 查看 默认为 '新增'
      showTitles: ['新增', '编辑', '查看'] // 0 新增，1 编辑，2 查看 默认为 '新增'
    }
  },
  computed: {
    /**
     * @description: 页码条数实时响应
     * @param {type}
     * @return:
     */
    pagination () {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`,
        pageSize: this.size,
        current: this.pages,
        total: Number(this.total)
      }
    }
  },
  mounted () {},
  methods: {
    refreshOrgTree () {
      this.editMode = null
      this.editOrg = {}
      this.selectedOrg = {}
      this.selectOrgId = null
      // 刷新组织树
      this.refreshTreeFlag = new Date()
    },
    /**
     * @description:
     * @return:
     */
    onSelectedOrg (data) {
      this.selectedRowKeys = []
      this.selectedOrg = data
      this.selectOrgId = data.keys.join(',')
      this.getData()
    },
    isOrgSelected () {
      return this.selectOrgId != null
    },
    /**
     * @description: 显示弹窗获取数据
     * @param {type}
     * @return:
     */
    openSelectUser () {
      this.$refs.orgSelectUser.openSelect()
    },

    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.size = pageSize
      this.pages = current
      this.getData()
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
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.searchParams = deleteEmpty(values)
          this.page = 1
          this.getData()
        }
      })
    },

    /**
     * @description:重置筛选
     * @param {type}
     * @return:
     */
    handleReset () {
      this.form.resetFields()
      this.searchParams = {}
      this.pages = 1
      this.getData()
    },
    deleteOrg (org) {
      this.$confirm({
        title: '删除',
        content: '确定删除部门？',
        onOk: () => {
          const urlParams = {
            orgId: org.orgId
          }
          deleteOrganization(null, urlParams)
            .then(res => {
              this.$message.success(messagePrompt.delSuccess)
              this.refreshOrgTree()
            })
            .catch(res => {
              window.vm.$message.error(res.data.detail)
            })
        },
        onCancel () {}
      })
    },
    /**
     * @description: 确认删除
     * @param {Object} record
     * @return:
     */
    confirmDel (record) {
      this.deleteOrganizationUsers([record.orgUserId])
    },

    /**
     * @description: 批量删除用户
     * @param {Object} orgUserIds
     * @return:
     */
    deleteOrganizationUsers (orgUserIds) {
      const deletes = []
      if (orgUserIds && orgUserIds.length > 0) {
        for (const orgUserId of orgUserIds) {
          const row = {
            orgUserId: orgUserId
          }
          deletes.push(row)
        }
      }
      deleteOrganizationUserByBatches({
        sysOrganizationUserJoins: deletes
      }).then(res => {
        this.$message.success(messagePrompt.del + '人员' + messagePrompt.success)
        this.getData()
      })
    },
    /**
     * @description: 批量删除点击按钮
     * @return:
     */
    onBatchDeleteClick () {
      const length = this.selectedRowKeys.length
      if (length) {
        this.$confirm({
          title: '删除',
          content: '确定批量删除用户部门关系？',
          onOk: () => {
            this.deleteOrganizationUsers(this.selectedRowKeys)
            this.selectedRowKeys = []
          },
          onCancel () {}
        })
      } else {
        this.$message.warning('请选择用户')
      }
    },
    /**
     * @description: 获取所有用户
     * @param {type}
     * @return:
     */
    getData () {
      this.loading = true
      getUserList({
        orgId: this.selectOrgId,
        userName: this.searchParams.userName || null
      }).then(res => {
        const { records, totalCount } = res.data
        records.forEach(ele => {
          ele.roleName = []
          if (ele.roles) {
            ele.roles.forEach(element => {
              ele.roleName.push(element.roleName)
            })
          }
          ele.positionName = []
          if (ele.sysPositions) {
            ele.sysPositions.forEach(element => {
              ele.positionName.push(element.positionName)
            })
          }
        })
        this.data = records
        this.total = totalCount
        this.loading = false
      })
    },
    // 获取上级组织
    traversingTree (tree) {
      tree.forEach(item => {
        const data = {
          orgName: item.orgName,
          orgId: item.orgId
        }
        this.orgHighData.push(data)
        if (item.children && item.children.length) {
          this.traversingTree(item.children)
        }
      })
    },
    openEditOrg () {
      // this.title = '编辑'
      this.showIndex = 1
      this.editMode = 'edit'
      this.editOrg = {
        id: this.selectedOrg.data.id,
        orgId: this.selectedOrg.data.orgId,
        orgName: this.selectedOrg.data.orgName,
        orgCode: this.selectedOrg.data.orgCode,
        parentId: this.selectedOrg.data.parentId,
        orgSort: this.selectedOrg.data.orgSort
      }
      this.visibleOrg = true
      if (this.$refs.addForm && this.$refs.addForm.$refs.selectParentOrg) {
        this.$refs.addForm.$refs.selectParentOrg.loadOrgData()
      }
    },
    openAddOrg () {
      // this.title = '新增'
      this.showIndex = 0
      this.editMode = 'add'
      this.editOrg = {
        parentId: null,
        orgSort: 1
      }
      this.visibleOrg = true
      if (this.$refs.addForm && this.$refs.addForm.$refs.selectParentOrg) {
        this.$refs.addForm.$refs.selectParentOrg.loadOrgData()
      }
    },
    onOrgSubmit () {
      this.$refs.addForm.editOrgForm.validateFields((err, values) => {
        if (!err) {
          const param = {
            ...values,
            orgFullName: ''
          }
          ++this.orgKey
          if (this.editMode === 'edit') {
            const urlParams = {
              orgId: param.orgId
            }
            updateOrganization(param, urlParams).then(res => {
              this.$message.success(messagePrompt.modifySuccess)
              this.refreshOrgTree()
              this.data = []
              this.onClose()
            })
          } else if (this.editMode === 'add') {
            addOrganization(param, { ignoreGlobalErrorHandler: false })
              .then(res => {
                this.$message.success(messagePrompt.addSuccess)
                this.refreshOrgTree()
                this.data = []
                this.onClose()
              })
          } else {
            console.error('未知bug')
          }
        }
      })
    },
    // close org
    onClose () {
      this.visibleOrg = false
      this.$refs.addForm.editOrgForm.resetFields()
      this.orgHighData = []
    },

    getOrganList () {
      getOrganList(null, { orgId: this.selectOrgId }).then(res => {})
    },
    /**
     * 选择用户之后
     * @param selectedUserIds
     * @param selectedUsers
     */
    selectedUsers (selectedUserIds, selectedUsers) {
      const joins = []
      for (const userId of selectedUserIds) {
        const userJoin = {
          userId: userId,
          orgId: this.selectOrgId
        }
        joins.push(userJoin)
      }
      const param = {
        sysOrganizationUserJoins: joins
      }
      saveOrganUserRelative(param).then(res => {
        this.getData()
        this.$refs.orgSelectUser.close()
        this.$message.success(messagePrompt.append + '人员' + messagePrompt.success)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-section {
  padding-left: 0;

  /deep/ .ant-table-tbody td {
    max-width: 400px;
  }
}
.left-wrap {
  .add_org {
    padding: 0 20px;
  }
  .top-bar {
    padding-left: 24px;
    margin-bottom: 34px;
  }
  /deep/ .ant-tabs-ink-bar {
    background-color: #fff;
  }
  /deep/ .ant-tabs-bar {
    width: 100%;
  }
  /deep/ .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
    text-align: left;
    padding-left: 50px;
  }
  /deep/ .ant-collapse-content-box {
    padding: 0;
  }
  /deep/ .ant-collapse {
    border: 0;
  }
  /deep/ .ant-tabs-nav .ant-tabs-tab-active {
    background-color: #e6f7ff;
  }
}
.inner-title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 14px;
}
.right-wrap {
  padding: 0 25px;
  border-left: 1px solid #ccc;
  .right-title {
    display: inline-block;
    height: 28px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
  }
}
.model__wrapper {
  .control-bar {
    .selectback {
      background: #ccc;
    }
  }
}
</style>
