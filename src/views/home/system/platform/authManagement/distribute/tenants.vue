<template>
  <div class="content-section">
    <div style="margin-bottom: 16px;">
      <permission code="system_platform_authManagement_delGrant">
        <a-button style="margin-right:20px;" :disabled="this.selectedRowKeys.length>0?false:true" type="primary" icon="delete" @click="handleMenuClick">批量删除</a-button>
      </permission>
      <permission code="system_platform_authManagement_grant">
        <a-button type="primary" icon="plus"  @click="showModal">授予租户</a-button>
      </permission>
    </div>
    <div>
      <a-table :columns="columns"
               :dataSource="data"
               :rowSelection="{ onChange: onSelectionChange, selectedRowKeys}"
               :pagination="pagination"
               @change="tableChange"
               :rowKey="item => item.id">
        <span slot="tenantName" slot-scope="text, record">{{record.tenantName}}({{record.tenantId}})</span>
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
          <permission code="system_platform_authManagement_delGrant">
            <a-popconfirm title="确定删除吗？" okText="确定" cancelText="取消" @confirm="confirmDel(record)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </permission>
        </template>
      </a-table>
    </div>
    <!-- 弹层 -->
    <a-modal title="授予租户" :visible="visible" @ok="handleOk" :loading="loading2" :confirmLoading="confirmLoading" @cancel="handleCancel" width = "1000px">
      <a-table :columns="columns2"
               :dataSource="data2"
               :pagination = "pagination2"
               @change="tableChangeModal"
               :rowSelection="{selectedRowKeys: selectedRowKeys2, onChange: onSelectChange}"
               :rowKey="item => item.id">
        <template slot="tenantName" slot-scope="text, record">
          <Overflow-Tool-Tip :text="record.tenantName+'【'+record.tenantId+'】'" />
        </template>
        <template slot="isProhibit" slot-scope="text, record">
          <a-tag color="red" v-if="record.isProhibit"><span>禁用</span></a-tag>
          <a-tag color="green" v-if="!record.isProhibit"><span>启用</span></a-tag>
        </template>
        <template slot="createTime" slot-scope="text, record">
          <span>
            {{ record.createTime | datefilter }}
          </span>
        </template>
      </a-table>
    </a-modal>
  </div>
</template>

<script>
import Permission from '@/components/business/permission'
import OverflowToolTip from '@/components/business/OverflowToolTip'
import moment from 'moment'
import { messagePrompt } from '@/utils/config'
import { queryTenantPowerList, deleteTenantPower, addTenantPower, queryAllTenants } from '@/http/system'
export default {
  name: 'authDistributeUser',
  components: {
    Permission, OverflowToolTip
  },
  data () {
    return {
      data: [],
      data2: [],
      size1: 10,
      pages1: 1,
      total1: 0,
      size2: 10,
      pages2: 1,
      total2: 0,
      columns: [
        { title: '租户名称(ID)', dataIndex: 'tenantName', key: 'tenantName', scopedSlots: { customRender: 'tenantName' } },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '联系号码', dataIndex: 'mobile', key: 'mobile' },
        { title: '租户状态', dataIndex: 'isProhibit', key: 'isProhibit', scopedSlots: { customRender: 'isProhibit' } },
        { title: '创建时间', dataIndex: 'createTime', key: 'createTime', scopedSlots: { customRender: 'createTime' } },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      columns2: [
        { title: '租户名称(ID)', dataIndex: 'tenantName', key: 'tenantName', scopedSlots: { customRender: 'tenantName' } },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '联系号码', dataIndex: 'mobile', key: 'mobile' },
        { title: '租户状态', dataIndex: 'isProhibit', key: 'isProhibit', scopedSlots: { customRender: 'isProhibit' } }
        // { title: '创建时间', dataIndex: 'createTime', key: 'createTime', scopedSlots: { customRender: 'createTime' } }
      ],
      loading: false,
      loading2: false,
      visible: false,
      confirmLoading: false,
      selectedRowKeys: [],
      selectedRowKeys2: []
    }
  },
  filters: {
    datefilter: value => moment(value).format('YYYY-MM-DD')
  },
  mounted () {
    this.queryTenantPowerList()
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
        userIdkey: 'key',
        showQuickJumper: true,
        showTotal: total => `共 ${this.total1} 条记录`,
        pageSize: this.size1,
        current: this.pages1,
        total: Number(this.total1),
        searchParams: {}
      }
    },
    pagination2 () {
      return {
        showSizeChanger: true,
        userIdkey: 'key',
        showQuickJumper: true,
        showTotal: total => `共 ${this.total2} 条记录`,
        pageSize: this.size2,
        current: this.pages2,
        total: Number(this.total2),
        searchParams: {}
      }
    }
  },
  methods: {
    onSelectionChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = []
      selectedRows.forEach(item => {
        this.selectedRowKeys.push(item.tenantId)
      })
    },
    handleMenuClick (e) {
      // if (e.key === '1') {
      if (this.selectedRowKeys.length === 0) {
        this.$message.warning('请选择租户！')
        return
      }
      this.$confirm({
        title: '删除',
        content: '确定删除授权租户吗？',
        onOk: () => {
          this.deleteTenantPowerfn(this.selectedRowKeys)
          this.selectedRowKeys = []
        }
      })
      // }
    },
    showModal () {
      this.visible = true
      this.selectedRowKeys2 = []
      this.pages2 = 1
      this.queryTenantPowerList2()
    },
    handleOk () {
      if (this.selectedRowKeys2.length > 0) {
        this.addTenantPowerFn(this.selectedRowKeys2)
      } else {
        this.$message.warning('请选择租户')
      }
    },
    handleCancel () {
      this.visible = false
    },
    /**
     * 新增权限
    */
    addTenantPowerFn (tenantId) {
      let params = {
        tenantIds: tenantId
      }
      let urlParams = {
        authId: this.$route.query.id
      }
      addTenantPower(params, urlParams).then(res => {
        this.$message.success(messagePrompt.grantSuccess)
        this.visible = false
        this.selectedRowKeys = []
        this.queryTenantPowerList()
      })
    },
    confirmDel (record) {
      const params = [record.tenantId]
      this.deleteTenantPowerfn(params)
    },
    /**
     * 删除权限
    */
    deleteTenantPowerfn (tenantId) {
      let params = {
        tenantIds: tenantId
      }
      let urlParams = {
        authId: this.$route.query.id
      }
      deleteTenantPower(params, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.selectedRowKeys = [] // 清空选中项
        this.pages1 = 1
        this.queryTenantPowerList()
      })
    },
    // 分页切换触发
    tableChange (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.size1 = pageSize
      this.pages1 = current
      this.queryTenantPowerList()
    },
    /**
     * 查询权限列表
    */
    queryTenantPowerList () {
      const pageParams = {
        pageSize: this.size1,
        currentPage: this.pages1,
        isHava: true // 有权限的
      }
      const urlParams = {
        authId: this.$route.query.id
      }
      const params = Object.assign(pageParams)
      this.loading = true
      queryTenantPowerList(params, urlParams).then(res => {
        const { records, totalCount } = res.data
        this.data = records
        this.total1 = totalCount
        this.loading = false
      })
    },
    // 分页切换触发
    tableChangeModal (pagination, filters, sorter) {
      const { pageSize, current } = pagination
      this.size2 = pageSize
      this.pages2 = current
      this.queryTenantPowerList2()
    },
    /**
     * 查询弹层权限列表
    */
    queryTenantPowerList2 () {
      this.data2 = []
      let params = {
        pageSize: this.size2,
        currentPage: this.pages2
      }
      this.loading2 = true
      queryAllTenants(params).then(res => {
        const { records, totalCount } = res.data
        this.data2 = records
        this.total2 = totalCount
        this.loading2 = false
      })
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys2 = selectedRowKeys
    }
  }
}
</script>

<style lang="less" scoped>
</style>
