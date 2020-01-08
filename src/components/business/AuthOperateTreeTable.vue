<!--
 * AuthOperateTreeTable 显示权限树表格的组件；用于 平台管理/基础权限管理、 系统权限/权限管理
 * 目的：权限数据的分配、编辑、删除
 * 入参：
 *   authData：权限树的数据；
 *   distributeOnly：是否只能分配权限；true：只显示 分配 按钮
 *   loading：是否显示loading
 * 事件：
 *   editAuth：编辑 按钮 触发事件
 *   distributeAuth：分配 按钮 触发事件
 *   deleteAuth：删除 按钮 触发事件
 -->
<template>
  <div class="reset-ant-tag">
    <a-spin :spinning="false" style="text-align: center;width: 100%;">
      <a-table
        v-if="data.length"
        rowKey="id"
        :dataSource="data"
        :defaultExpandAllRows="true"
        :pagination="false"
      >
        <a-table-column
          dataIndex="authName"
          key="authName"
          title="权限名称"
        >
          <template slot-scope="text, record">
            <span v-if="record.authType === 1">
              {{ text }}
            </span>
            <b v-else>
              {{ text }}
            </b>
          </template>
        </a-table-column>
        <a-table-column
          dataIndex="authType"
          title="权限类型">
          <template slot-scope="text">
            <a-tag v-if="text === 1" color="green">菜单</a-tag>
            <a-tag v-else color="blue">权限</a-tag>
          </template>
        </a-table-column>
        <a-table-column
          dataIndex="authCode"
          title="权限编码"
        >
        </a-table-column>
        <a-table-column
          dataIndex="authId"
          title="URI"
        >
          <template slot-scope="text, record">
            <Overflow-Tool-Tip :text="record.authType === 1 ? record.url : record.authUrl"></Overflow-Tool-Tip>
          </template>
        </a-table-column>
        <a-table-column
          dataIndex="authSort"
          title="排序"
        >
        </a-table-column>
        <a-table-column
          title="操作"
        >
          <template slot-scope="text, record">
            <span>
              <template v-if="!distributeOnly">
                <permission code="system_platform_authManagement_edit">
                  <a @click="editAuth(record.authId, record.authType)" href="javascript:;">编辑</a>
                  <a-divider type="vertical" />
                </permission>
              </template>
              <template v-if="record.authType === 2">
                <!-- 分别控制‘权限管理’和‘基础权限管理’中的‘分配’按钮 -->
                <!-- ‘权限管理’中的‘分配’按钮 -->
                <permission code="system_auth_auth_distribute">
                  <a @click="distribute(record)" v-if="distributeOnly" href="javascript:;">分配</a>
                </permission>
                <!-- ‘基础权限管理’中的‘分配’按钮 -->
                <permission code="system_platform_authManagement_distribute">
                  <a @click="distribute(record)" v-if="!distributeOnly" href="javascript:;">分配</a>
                  <a-divider type="vertical" v-if="!distributeOnly"/>
                </permission>
              </template>
              <template v-if="(!record.children || !record.children.length) && !distributeOnly">
                <permission code="system_platform_authManagement_del">
                  <a-popconfirm
                    title="确定删除吗？"
                    @confirm="deleteAuth(record.authId)"
                    okText="确定"
                    cancelText="取消"
                  >
                    <a href="javascript:;">删除</a>
                  </a-popconfirm>
                </permission>
              </template>
            </span>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import Permission from '@/components/business/permission'
import OverflowToolTip from '@/components/business/OverflowToolTip'
export default {
  name: 'AuthOperateTreeTable',
  // 调用者传参过来的值；authData：权限树的数据；distributeOnly：是否只能分配权限；loading：是否显示loading
  components: {
    OverflowToolTip,
    Permission
  },
  props: {
    authData: {
      type: Array,
      required: true
    },
    distributeOnly: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      data: [],
      myLoading: false
    }
  },
  watch: {
    authData: function (newValue) {
      this.data = newValue
    },
    loading: function (newValue) {
      this.myLoading = newValue
    }
  },
  methods: {
    editAuth (id, authType) {
      this.$emit('editAuth', {
        id,
        authType
      })
    },
    distribute (record) {
      this.$emit('distributeAuth', record)
    },
    deleteAuth (id) {
      this.$emit('deleteAuth', id)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
