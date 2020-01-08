<!--
 * 选择职位通用组件，下拉树的方式；
 * 当treeCheckStrictly为true时，返回结果格式为：{value: string, label: VNode, halfChecked(treeCheckStrictly 时有效): string[] }
 * 当treeCheckStrictly为false时，返回结果格式为：string[]
 * 入参：
 *   value：选中的值；
 *   disabled：是否禁用，默认false；
 *   checkable：是否复选，默认false；
 *   treeCheckStrictly：上下级是否关联选中，默认false，上下关联选中
 * 事件：
 *   change：当选中值变化时 触发事件
 -->
<template>
    <a-tree-select
            showSearch
            :treeData="treeData"
            :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
            placeholder="请选择职位"
            allowClear
            treeDefaultExpandAll
            :disabled="disabled"
            :treeCheckable="checkable"
            :treeCheckStrictly="treeCheckStrictly"
            treeNodeFilterProp="title"
            v-model="selectValue"
            @change="onChange"
    >
    </a-tree-select>
</template>

<script>
import { getPostioniTree } from '@/http/system'

const treeData = []
export default {
  name: 'SelectPositionTreeSelect',
  mixins: [],
  model: {
    prop: 'value',
    event: 'change'
  },
  components: {},

  // 调用者传参过来的值；value：选中的值；disabled：是否禁用，默认false；checkable：是否复选，默认false；treeCheckStrictly：上下级是否关联选中，默认false，上下关联选中
  props: ['value', 'disabled', 'checkable', 'treeCheckStrictly'],

  data () {
    return {
      treeData,
      selectValue: this.value === '0' ? undefined : this.value
    }
  },
  computed: {},

  watch: {
  },

  created () {
  },

  mounted () {
    this.loadOrgData()
  },

  updated () {
    this.selectValue = this.value === '0' ? undefined : this.value
  },

  destroyed () {
  },

  methods: {
    loadOrgData () {
      getPostioniTree(null).then(res => {
        const orgTree = res.data
        this.traversingTree(orgTree)
        this.treeData = orgTree
      })
    },

    // change事件方法
    onChange (value, label, extra) {
      this.$emit('change', value, label, extra)
    },

    // 生成tree需要的数据
    traversingTree (tree) {
      tree.forEach(item => {
        item.key = item.id
        item.value = item.id
        item.title = item.groupName
        item.disableCheckbox = true
        if (item.positionList && item.positionList.length) {
          item.positionList.forEach(position => {
            position.key = position.id
            position.value = position.id
            position.title = position.positionName
          })
          item.children = item.positionList
        }
      })
    },

    // 获取选中的组织Ids；
    getSelectPositionIds () {
      if (this.treeCheckStrictly) {
        let positionIds = []
        if (this.value) {
          this.value.forEach(item => {
            positionIds.push(item.value)
          })
        }
        return positionIds
      } else {
        return this.value
      }
    },

    // 生成treeCheckStrictly=true时选中的数据；通过id设置选中
    treeCheckStrictlySelectedNodes (selectOrgIds) {
      if (this.treeCheckStrictly && selectOrgIds) {
        let selectNodes = []
        selectOrgIds.forEach(item => {
          selectNodes.push({
            value: item
          })
        })
        this.selectValue = selectNodes
      }
    }
  }
}
</script>
