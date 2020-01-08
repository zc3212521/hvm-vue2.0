<template>
  <div class="content-section">
    <div class="mbx-wrap" style="margin-bottom:20px;">
      <breadcrumb  />
      <span class="add-bread">/&nbsp;&nbsp;{{positionName}}</span>
    </div>
    <a-row>
      <a-col :span="6" style="width:268px;">
        <div class="left-wrap">
          <!-- 职位面板 -->
          <position-panel
            ref="positionPanel"
            @update-position="updatePosition"
            @updatePositionName="updatePositionName"
          />
        </div>
      </a-col>
      <!-- 职位下的角色 -->
      <a-col :span="18" style="width: calc(100% - 268px);">
        <div class="right-wrap">
          <h-top-bar
            @handleSearch="handleSubmit"
            @handleReset="handleReset"
            @toggleFlod="toggleFlod"
            :canFlod="false"
            :disabled="hasPositionName"
          >
            <a-form :form="form">
              <a-row :gutter="24">
                <a-col
                  :span="24"
                  v-for="item in searchFormItem"
                  :key="item.label"
                >
                  <custom-form-item
                    :item="item"
                    :formInlineItemLayout="{
                      labelCol: { span: 7 },
                      wrapperCol: { span: 17 }
                    }"
                  >
                  </custom-form-item>
                </a-col>
              </a-row>
            </a-form>
          </h-top-bar>
          <div style="margin: 16px 0;">
            <p class="right-title" style="margin-right: 20px;">
              {{ positionName || '请选择职位' }}
            </p>
          </div>
          <div style="margin-bottom: 16px;">
            <permission code="system_auth_staff_delStaff">
              <a-button
                style="margin-right:20px;"
                :disabled="this.positionIds.length > 0?false:true"
                type="primary"
                icon="delete"
                @click="deletePositionUsers"
              >
                批量删除
              </a-button>
            </permission>
            <permission code="system_auth_staff_addStaff">
              <a-button
                type="primary"
                @click="displayModel"
                :disabled="hasPositionName"
              >
                <a-icon type="plus" />
                <span>添加人员</span>
              </a-button>
            </permission>
          </div>
          <div v-if="positionName">
            <a-spin :spinning="false" style="text-align: center;width: 100%;">
              <a-table
                :columns="columns"
                :dataSource="data"
                :pagination="pagination"
                :rowKey="item => item.id"
                :rowSelection="rowSelection"
                @change="handleTableChange"
              >
                <template slot="department" slot-scope="text, record">
                  <span
                    style="padding-right:10px;"
                    v-for="(item, index) in record.sysOrganizations"
                    :key="index"
                    >{{ item.orgName }}</span
                  >
                </template>
                <template slot="position" slot-scope="text, record">
                  <span
                    style="padding-right:10px;"
                    v-for="(item, index) in record.sysOrganizationManages"
                    :key="index"
                    >{{ item.orgName }}</span
                  >
                  <permission code="system_auth_staff_config">
                    <a href="javascript:;" @click="editPostionRange(record)"
                      >设置</a
                    >
                  </permission>
                </template>
                <template slot="action" slot-scope="text, record">
                  <permission code="system_auth_staff_delStaff">
                    <a-popconfirm
                      title="确定删除吗？"
                      okText="确定"
                      cancelText="取消"
                      @confirm="confirmDel(record)">
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
    <!-- 添加人员组件 -->
    <SelectUserModal ref="selectuser" @onSelectedUsers="selectedUser" />
    <!-- 设置管理权限弹层 -->
    <a-modal
      title="设置管理范围"
      :visible="positionVisible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="setHandleCancel"
    >
      <a-form :form="baseDataForm" @submit="setPositionhandleSubmit">
        <a-form-item
          label="部门"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          style="display: inline-block; width: 50%;"
        >
          <SelectOrgTreeSelect
            ref="selectOrg"
            :treeCheckStrictly="false"
            :checkable="true"
            v-decorator="['orgIdLabels', { initialValue: orgIds }]"
            @change="selectTreeChange"
          ></SelectOrgTreeSelect>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import SelectUserModal from '@/components/business/SelectUserModal.vue'
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import SelectOrgTreeSelect from '@/components/business/SelectOrgTreeSelect'
import Permission from '@/components/business/permission'
import HTopBar from '@com/business/HTopBar.vue'
import PositionPanel from './positionPanel'
import CustomFormItem from '@com/business/CustomFormItem'
import { deleteEmpty } from '@/utils'
import { messagePrompt } from '@/utils/config'
import {
  getPostionList,
  savePostion,
  deletePositionUser,
  setManager
} from '@/http/system'

const searchFormItem = [
  {
    label: '用户名',
    placeholder: '请输入用户名称',
    decorator: ['userName']
  }
]

const columns = [
  { title: '用户名', dataIndex: 'userName', key: 'userName', width: '20%' },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    width: '40%',
    scopedSlots: { customRender: 'department' }
  },
  {
    title: '管理范围',
    dataIndex: 'position',
    key: 'position',
    scopedSlots: { customRender: 'position' }
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const modelColumns = [
  { title: '用户名称', dataIndex: 'userName', key: 'userName' },
  {
    title: '用户类型',
    dataIndex: 'userType',
    key: 'userType',
    scopedSlots: { customRender: 'userType' }
  },
  { title: '邮箱', dataIndex: 'email', key: 'email' },
  { title: '手机号', dataIndex: 'mobile', key: 'mobile' },
  { title: '部门', dataIndex: 'department', key: 'department' },
  { title: '职位', dataIndex: 'position', key: 'position' }
]

const dropdownOption = [
  {
    label: '批量删除',
    value: '1'
  }
]
export default {
  name: 'positionManagement',
  components: {
    HTopBar,
    PositionPanel,
    CustomFormItem,
    Breadcrumb,
    SelectUserModal,
    SelectOrgTreeSelect,
    Permission
  },
  data () {
    return {
      orgIds: [],
      selectData: [],
      selectPositionId: '',
      selectUserId: '',
      selectOrgId: [],
      positionVisible: false,
      confirmLoading: false,
      baseDataForm: this.$form.createForm(this, {}),
      flod: true,
      data: [],
      columns,
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
          this.positionIds = []
          selectedRows.forEach(item => {
            this.positionIds.push({
              positionId: item.positionId,
              userId: item.userId,
              positionUserId: item.positionUserId
            })
          })
        }
      },
      modelRowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.modelSelectedRowKeys = selectedRowKeys
        }
      },
      searchFormItem,
      size: 10,
      pages: 1,
      total: 100,
      editId: '',
      positionIds: [],
      searchParams: {},
      form: this.$form.createForm(this, {}),
      addForm: this.$form.createForm(this, {}),
      selectedRowKeys: [],
      loading: false,
      visible: false,
      title: '新增',
      readonly: false, // 查看状态标识
      modelColumns,
      modelData: [],
      modelLoading: false,
      modelSelectedRowKeys: [],
      modelPages: 1,
      modelSize: 10,
      modelTotal: 0,
      modelSearchKey: '',
      dropdownOption, // 批量操作
      searchUserName: '',
      positionName: '', // 点击左侧树传递来的名字
      positionId: null, // 点击左侧树传递来的id
      positionGroupId: null// 点击左侧树传递来的职位组id
    }
  },
  computed: {
    /**
     * 设置按钮是否可点击
     */
    hasPositionName () {
      return this.positionName === ''
    },
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
    },
    /**
     * @description: 实时更新弹窗页码相关信息
     * @param {type}
     * @return:
     */
    modelPagination () {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条记录`,
        pageSize: this.modelSize,
        current: this.modelPages,
        total: this.modelTotal
      }
    }
  },
  methods: {
    /**
     * 树点击后
     */
    selectTreeChange (value, label, extra) {
      this.selectOrgId = value
    },
    /**
     * 点击设置
     */
    editPostionRange (value) {
      this.orgIds = []
      value.sysOrganizationManages.forEach(item => {
        this.orgIds.push(item.orgId)
        this.selectOrgId.push(item.orgId)
      })
      this.selectUserId = ''
      this.selectPositionId = ''
      this.positionVisible = true
      // 获取positionid 和 userid
      this.selectPositionId = value.positionId
      this.selectUserId = value.userId
    },
    /**
     * 设置管理范围
     * */
    setPositionhandleSubmit (e) {
      e.preventDefault()
      this.baseDataForm.validateFields((err, values) => {
        if (!err) {
        }
      })
    },
    /**
     * 设置职位管理方法
     */
    setManagerFn (params) {
      const setparams = {
        sysUserOrganizationManagers: params
      }
      setManager(setparams).then(res => {
        this.confirmLoading = false
        this.positionVisible = false
        this.getData()
      })
    },
    /**
     * 设置管理职位
     */
    showModal () {
      this.positionVisible = true
    },
    handleOk (e) {
      this.confirmLoading = true
      const params = []
      if (this.selectOrgId.length > 0) {
        this.selectOrgId.forEach(item => {
          params.push({
            positionId: this.selectPositionId,
            userId: this.selectUserId,
            orgId: item
          })
        })
      } else {
        params.push({
          positionId: this.selectPositionId,
          userId: this.selectUserId,
          orgId: undefined
        })
      }
      this.orgIds.length = 0
      this.selectOrgId.length = 0
      this.baseDataForm.resetFields()
      this.setManagerFn(params)
    },
    setHandleCancel () {
      this.positionVisible = false
      this.orgIds.length = 0
      this.selectOrgId.length = 0
      this.baseDataForm.resetFields()
    },
    /**
     * 点击批量删除时
     */
    deletePositionUsers () {
      if (this.positionIds.length > 0) {
        const params = {
          sysPositionUserJoins: this.positionIds
        }

        this.$confirm({
          title: '删除',
          content: '确定批量删除用户职位关系？',
          onOk: () => {
            this.delPositionUser(params)
            this.positionIds = []
          },
          onCancel () {}
        })
      } else {
        this.$message.warning('请选择用户')
      }
    },
    confirmDel (record) {
      const params = {
        sysPositionUserJoins: [{
          positionId: record.positionId,
          userId: record.userId,
          positionUserId: record.positionUserId
        }]
      }
      this.delPositionUser(params)
    },
    /**
     * 删除用户职位关系
     */
    delPositionUser (params) {
      deletePositionUser(params).then(res => {
        this.$message.success(messagePrompt.del + '人员' + messagePrompt.success)
        this.pages = 1
        this.getData()
      })
    },
    /**
     * 子组件传递来的选中人员的列表
     */
    selectedUser (selectedUserIds) {
      const paramsArr = []
      if (selectedUserIds && selectedUserIds.length > 0) {
        selectedUserIds.forEach(item => {
          paramsArr.push({ positionId: this.positionId, userId: item })
        })
        const params = {
          sysPositionUserJoins: paramsArr
        }
        savePostion(params).then(res => {
          this.$message.success(messagePrompt.append + '人员' + messagePrompt.success)
          this.getData()
        })
      } else {
        this.$message.warning('请选择要' + messagePrompt.append + '的人员')
      }
      this.$refs.selectuser.close()
    },
    /**
     * 更新已选择的职位名称
     */
    updatePositionName (obj) {
      this.positionName = obj.positionName
    },
    /**
     * @description: 编辑职位
     * @return:
     */
    editPosition () {
      const item = {
        positionName: this.positionName,
        id: this.positionId,
        positionGroupId: this.positionGroupId
      }
      this.$refs.positionPanel.editPosition(item)
    },
    /**
     * @description:
     * @param {Number} id 职位id
     * @param {String} positionName 职位名称
     * @return:
     */
    updatePosition ({ id, positionName, positionGroupId }) {
      this.positionIds = []
      this.positionName = positionName
      this.positionId = id
      this.positionGroupId = positionGroupId
      this.searchUserName = ''
      this.form.resetFields()
      this.getData()
    },
    /**
     * @description:弹窗搜索
     * @param {String} value
     * @return:
     */
    onModelSearch (value) {
      this.modelPages = 1
      this.getModelTableData()
    },
    /**
     * @description: 关闭弹窗重置
     * @param {type}
     * @return:
     */
    clearModel () {
      this.modelSearchKey = ''
      this.modelSelectedRowKeys = []
    },
    /**
     * @description: 显示弹窗获取数据
     * @param {type}
     * @return:
     */
    displayModel () {
      this.visible = true
      this.$refs.selectuser.openSelect()
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
          this.searchUserName = deleteEmpty(values)
          this.pages = 1
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
      this.handleSubmit()
    },
    /**
     * @description: 获取所有用户
     * @param {type}
     * @return:
     */
    getData () {
      const pageParams = {
        positionId: this.positionId,
        pageSize: this.size,
        currentPage: this.pages
      }
      const searchParams = this.searchUserName
      const params = Object.assign(pageParams, searchParams)
      this.loading = true
      getPostionList(params).then(res => {
        const { records, totalCount } = res.data
        this.data = records
        this.total = totalCount
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.content-section {
  padding-left: 0;
}
.left-wrap {
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
    padding-bottom: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
