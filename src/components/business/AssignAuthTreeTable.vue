<!--
 * AssignAuthTreeTable 分配权限的 权限树组件；用于 用户管理、角色管理、租户管理中的 权限分配
 * 目的：为 租户、用户、角色 分配权限
 * 入参：
 *   treeData：权限树的数据；
 * 事件：
 *   checkedAuthIdsChange：当选中的权限数据变化时触发
 -->
<template>
  <div>
    <a-spin :spinning="false">
      <a-table
        v-if="data.length"
        rowKey="id"
        :dataSource="data"
        :defaultExpandAllRows="true"
        :pagination="false"
      >
        <a-table-column
          dataIndex="authName"
          width="230px"
          key="authName"
        >
          <span slot="title">
            <a-checkbox
              :indeterminate="data.some(item => item.checkedStatus === '1') || (data.some(item => item.checkedStatus === '0') && data.some(item => item.checkedStatus === '2'))"
              :checked="data.every(item => item.checkedStatus === '0')"
              @change="onCheckAll">
              菜单权限
            </a-checkbox>
          </span>
          <template slot-scope="text, record">
            <span v-if="record.authType === 1">
              <a-checkbox :checked="record.checkedStatus === '0'"
                          :indeterminate="record.checkedStatus === '1'"
                          @change="onCheckMenu($event, text, record)">
                {{record.authName}}
              </a-checkbox>
            </span>
            <span v-else>
              <a-checkbox :checked="record.auth.filter(item => item.permission).length === record.auth.length"
                          :indeterminate="record.auth.filter(item => item.permission).length > 0 && record.auth.filter(item => item.permission).length < record.auth.length"
                          @change="onCheckMenu($event, text, record)">
                {{record.authName}}
              </a-checkbox>
            </span>
          </template>
        </a-table-column>
        <a-table-column dataIndex="auth"
                        title="操作权限(点击切换)">
          <template slot-scope="text, record">
            <span v-if="record.auth[0].authType === 1">
              <a-checkable-tag :checked="record.checkedStatus === '0' || record.checkedStatus === '1'"
                               style="margin-top: 2px;margin-bottom: 2px">
                {{text[0].authName}}
              </a-checkable-tag>
            </span>
            <span v-else>
              <a-checkable-tag v-for="item in text"
                               :key="item.authName"
                               v-model="item.permission"
                               @change="authChange($event, item, record)"
                               style="margin-top: 2px;margin-bottom: 2px">
                {{item.actionType === 1 ? '访问' : item.authName}}
              </a-checkable-tag>
            </span>
          </template>
        </a-table-column>
      </a-table>
    </a-spin>
  </div>
</template>

<script>
import { deepClone } from '@/utils/index'
import {
  changeTree,
  combineNode,
  updataTreeAuth,
  changeTreeAllAuth,
  getCheckedAuthIdList
} from '@/utils/auth'

export default {
  name: 'AssignAuthTreeTable',
  props: {
    treeData: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      allChecked: true,
      data: [],
      loading: true
    }
  },
  computed: {},
  watch: {
    treeData: {
      handler (val) {
        if (val.length) {
          this.data = val
        }
      },
      immediate: true
    },
    // 当data数据变化时，执行如下方法
    data (newTree) {
      let authIdList = []
      getCheckedAuthIdList(newTree, authIdList)
      this.$emit('checkedAuthIdsChange', authIdList)
    }
  },
  methods: {
    authChange (checked, item, record) {
      if (item.action === 'none') {
        this.$message.error('此页面未配置任何权限,请前往权限管理配置')
        return
      }
      const ALLCHECKED = '0' // 枚举当前节点属性 全选
      const INDETERMINATE = '1' // 部分选定
      const ALLUNCHECKED = '2' // 全不选
      if (record.auth.every(item => item.permission)) {
        record.checkedStatus = ALLCHECKED
      } else if (record.auth.every(item => !item.permission)) {
        record.checkedStatus = ALLUNCHECKED
      } else {
        record.checkedStatus = INDETERMINATE
      }
      let newTree = deepClone(this.data)
      updataTreeAuth(newTree)
      this.data = newTree
    },
    onCheckAll (e) {
      let checked = e.target.checked
      let newTree = deepClone(this.data)
      changeTreeAllAuth(newTree, checked)
      updataTreeAuth(newTree)
      this.data = newTree
    },
    onCheckMenu (e, text, record) {
      let checked = e.target.checked
      let currentData = deepClone(record)
      let treeData = deepClone(this.data)
      if (record.authType && record.authType === 1) { // 菜单权限
        changeTree(currentData, checked)
      }
      if (!record.authType || record.authType !== 2) { // 权限
        currentData.auth.forEach(item => {
          item.permission = checked
        })
      }
      let newTree = combineNode(treeData, currentData)
      updataTreeAuth(newTree)
      this.data = newTree
    }
  }
}
</script>

<style lang="less" scoped>
</style>
