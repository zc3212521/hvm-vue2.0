<!-- commonTree 用于基本树组件的封装 -->
<template>
  <div class="tree__wrapper">

    <a-tree :treeData="treeData"
            showLine
            :selectedKeys="selectedKey"
            @select="onSelect">
    </a-tree>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
const treeData = []

export default {
  name: 'commonTree',

  mixins: [],

  components: {},

  props: {
    initTreeData: {
      default: () => treeData
    },
    childrenProps: {
      default: 'children'
    },
    keyProps: {
      default: 'key'
    },
    titleProps: {
      default: 'title'
    },
    selectedKeys: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectedKey: []
    }
  },
  watch: {
    selectedKeys (val) {
      this.selectedKey = val
    }
  },
  computed: {
    treeData () {
      const newTree = deepClone(this.initTreeData)
      this.traversingTree(newTree)
      return newTree
    }
  },

  created () { },

  mounted () { },

  destroyed () { },

  methods: {
    traversingTree (tree) {
      tree.forEach(item => {
        item.children = item[this.childrenProps]
        item.key = item[this.keyProps]
        item.title = item[this.titleProps]
        if (item.children && item.children.length) {
          this.traversingTree(item.children)
        }
      })
    },
    onSelect (selectedKeys, e) {
      if (e.selected) {
        let data = {
          keys: selectedKeys,
          title: e.node.title,
          node: e.node,
          data: e.selectedNodes[0].componentOptions.propsData.dataRef
        }
        this.$emit('selectTree', data)
      }
    }
  }
}

</script>
<style lang='less' scoped>
  .tree__wrapper {
    padding: 10px;
    /deep/ .ant-tree.ant-tree-show-line li:not(:last-child):before {
      content: none;
    }
    /deep/ .ant-tree-switcher-noop {
      display: none;
    }
  }

</style>
