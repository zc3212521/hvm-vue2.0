<!-- organizationPanel -->
<template>
  <div>
    <common-tree
      :init-tree-data="treeData"
      childrenProps="children"
      keyProps="id"
      titleProps="orgName"
      :selected-keys="selectedKeys"
      @selectTree='getSelectTree'></common-tree>
  </div>
</template>

<script>
import CommonTree from '@/components/base/CommonTree.vue'
import { getOrganizationTree } from '@/http/system'

const treeData = []
export default {
  name: 'organizationPanel',

  mixins: [],
  props: ['refreshFlag'],
  components: {
    CommonTree
  },

  data () {
    return {
      treeData,
      selectedKeys: []
    }
  },
  computed: {},

  watch: {
    refreshFlag: function () {
      this.getOrgData()
    }
  },

  created () {
  },

  mounted () {
    this.getOrgData()
  },

  destroyed () {
  },

  methods: {
    getOrgData () {
      getOrganizationTree(null).then(res => {
        this.treeData = res.data
        this.selectedKeys = []
      })
    },
    getSelectTree (data) {
      this.selectedKeys = data.keys
      this.$emit('selectedOrg', data)
    }
  }
}

</script>
<style lang='less' scoped>

</style>
