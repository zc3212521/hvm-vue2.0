<!--基本权限项组件-->
<template>
  <div>
    <div v-for="item in info" :key="item.key">
      <a-collapse accordion v-model="item.activeLeaf">
        <a-collapse-panel :key="item.leaf">
          <template slot="header">
            {{ item.title }}
            <a-button v-if="item.children[0].name === 'display'" size="small" style="margin-left: 10px;" @click.stop="checkAll(item)">全选</a-button>
            <a-button  v-if="item.children[0].name === 'display'" size="small" style="margin-left: 10px;" @click.stop="checkInvert(item)">反选</a-button>
          </template>
          <div v-if="item.children[0].children">
            <permission-item :info="item.children" />
          </div>
          <div v-else>
            <a-checkbox
              v-for="item1 in item.children"
              @change="onChange($event, item1)"
              :disabled="item1.name !== 'display' && item.children[0].hasPermisson !== 1"
              :checked="item1.hasPermisson === 1"
              :key="item1.key"
            >
              {{ item1.title }}
            </a-checkbox>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script>
// import { deepClone } from '@/utils'

export default {
  name: 'permissionItem',
  props: {
    info: {
      type: Array,
      required: true
    }
  },
  methods: {
    onChange (e, item) {
      // console.log('change', e, item)
      item.hasPermisson = e.target.checked ? '1' : '0'
    },
    checkAll (item) {
      this.changeAllPermission(item)
      // console.log('check all', item)
    },
    checkInvert (item) {
    },
    changeAllPermission (obj) {
      obj.children.forEach((item, index) => {
        if (typeof item.hasPermisson === 'undefined') {
          this.changeAllPermission(item)
        } else {
          item.hasPermisson = 1
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
