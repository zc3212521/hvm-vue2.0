<template>
  <div class="last-step">
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="角色管理" key="1">
        <a-table :columns="columns" :dataSource="data" rowKey="id" :pagination="pagination" :rowSelection="rowSelection" @change="handleTableChange">
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="关联权限" key="2" forceRender>
        <a-alert style="display: inline-block;font-weight: bold;" message="蓝色标签表示拥有此权限，白色表示无此权限，点击标签可修改权限，请谨慎操作！" banner/>
        <div style="text-align: center;">
          <a-spin :spinning="false">
            <assign-auth-tree-table @checkedAuthIdsChange="receiveAuth" ref="userAssignAuth" :treeData="userAuth" />
          </a-spin>
        </div>
      </a-tab-pane>
    </a-tabs>
    <div class="footer">
      <a-button @click="cancel" style="margin-right: 20px;">跳过</a-button>
      <a-button @click="submit" type="primary" :loading="submitBtnLoading">确定</a-button>
    </div>
  </div>
</template>

<script>
import AssignAuthTreeTable from '@/components/business/AssignAuthTreeTable'
import { getRolePage, queryCurrentAuth, updateUserRole, updateUserAuth } from '@/http/system'
import { translateTree, addLeafInTree, changeTreeAllAuth } from '@/utils/auth'
import { deepClone } from '@/utils'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'authConfig',
  props: {
    userId: {
      require: true
    }
  },
  data () {
    return {
      data: [],
      columns: [
        { title: '角色名称', dataIndex: 'roleName', key: 'roleName' },
        { title: '角色描述', dataIndex: 'description', key: 'description' }
      ],
      rowSelection: {
        onChange: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys
        }
      },
      pagination: {},
      selectedRowKeys: [],
      userAuth: [],
      authArr: [],
      authLoading: false,
      submitBtnLoading: false
    }
  },
  components: {
    AssignAuthTreeTable
  },
  created () {
    this.getRoleData()
    this.queryUserAllAuth()
  },
  methods: {
    callback (key) {
      // console.log(key)
    },
    cancel () {
      this.$message.success(messagePrompt.addSuccess)
      this.$emit('closeDrawer')
    },
    submit () {
      if (this.authArr.length === 0 && this.selectedRowKeys.length === 0) {
        this.$message.error('请选择权限或角色')
      } else {
        if (this.authArr.length > 0 && this.selectedRowKeys.length > 0) {
          this.submitBtnLoading = true
          Promise.all([
            this.updateUserRole(this.selectedRowKeys),
            this.updateUserAuth(this.authArr)
          ]).then((res) => {
            this.submitBtnLoading = false
            if (res[0] && res[1]) {
              this.cancel()
            }
          })
        } else if (this.authArr.length > 0) {
          this.submitBtnLoading = true
          this.updateUserAuth(this.authArr).then(res => {
            this.submitBtnLoading = false
            this.cancel()
          })
        } else {
          this.submitBtnLoading = true
          this.updateUserRole(this.selectedRowKeys).then(res => {
            this.submitBtnLoading = false
            this.cancel()
          })
        }
      }
    },
    /**
     * @description: 更新用户权限
     * @param {type}
     * @return:
     */
    updateUserAuth (authIds) {
      const urlParams = {
        userId: this.userId
      }
      const params = {
        authIds
      }

      return updateUserAuth(params, urlParams).then(res => {
        return res
      })
    },
    /**
     * @description: 更新用户角色
     * @param {type}
     * @return:
     */
    updateUserRole (roleIdList) {
      const urlParams = {
        userId: this.userId
      }
      const params = {
        ...urlParams,
        roleIds: roleIdList
      }
      return updateUserRole(params, urlParams).then(res => {
        return res
      })
    },
    /**
     * @description: 获取所有权限树
     * @param {type}  null
     * @return:null
     */
    queryUserAllAuth () {
      queryCurrentAuth({}).then(res => {
        this.initUserAuth = res.data
        this.initUserAuthData()
      })
    },
    /**
     * @description: 重新赋值新数据
     * @param {type}
     * @return:
     */
    initUserAuthData () {
      let data = deepClone(this.initUserAuth)
      translateTree(data)
      addLeafInTree(data)
      changeTreeAllAuth(data, false)
      // updataTreeAuth(data)
      this.userAuth = data
    },
    /**
     * @description: 实时更新选中的权限
     * @param {Array}  authArr 选中的数组
     * @return: null
     */
    receiveAuth (authArr) {
      this.authArr = authArr
    },
    /**
     * 分页
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getRoleData()
    },
    /**
    * @description: 获取列表数据
    * @param {type}
    * @return:
    */
    getRoleData () {
      getRolePage(null, this.pagination).then(res => {
        this.pagination = res.pagination
        this.data = res.data.records
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .last-step {
    padding-bottom: 60px;
  }

  .footer {
    text-align: center;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 20px;
    background: #fff;
    border-top: 1px solid #eee;
  }
</style>
