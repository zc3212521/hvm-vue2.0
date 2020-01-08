<!--
 * 面包屑组件，每个页面顶部显示链接导航的面包屑
 * 目的：为 租户、用户、角色 分配权限
 * 入参：
 *   limit：保留几位面包屑导航，不传或者传0表示显示全部面包屑
 -->
<template>
  <a-breadcrumb style="margin-left: 16px;margin-bottom: 20px; display:inline-block; padding-right:10px;">
    <a-breadcrumb-item
      v-for="(item, index) in breadcrumbData"
      :key="item.name"
    >
      <template v-if="breadcrumbData[breadcrumbData.length - 1].authType === 2">
        <router-link v-if="index === breadcrumbData.length - 2" :to="{ name: item.name }">
          {{item.title}}
        </router-link>
        <span v-else>
          {{item.title}}
        </span>
      </template>
<!--      <template v-else-if="breadcrumbData.length === 2">-->
<!--        <router-link v-if="index === 0" :to="{ name: item.name }">-->
<!--          {{item.title}}-->
<!--        </router-link>-->
<!--        <span v-else>-->
<!--          {{item.title}}-->
<!--        </span>-->
<!--      </template>-->
      <template v-else>
        <span>
          {{item.title}}
        </span>
      </template>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
import { formatBreadcrumbTitle } from '@/utils'
export default {
  name: 'Breadcrumb',
  data () {
    return {
      breadcrumbData: []
    }
  },
  created () {
    let arr = formatBreadcrumbTitle(this.$route.name)
    this.breadcrumbData = arr
  }
}
</script>

<style lang="less" scoped>

</style>
