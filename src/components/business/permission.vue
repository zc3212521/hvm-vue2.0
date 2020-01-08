<!--按钮类权限校验组件-->
<!--入参：code 具体按钮权限的code值-->
<!--用例1：只需要根据权限显示隐藏按钮
<permission code="system_auth_staff_edit">
  <a-button @click="customFunction">编辑</a-button>
</permission>
-->
<!--用例2：无权限时显示其他内容，此处无权限时显示 您没有权限 文字
<permission code="system_auth_staff_edit">
  <a-button @click="customFunction">编辑</a-button>
  <template #custom>
    您没有权限
  </template>
</permission>
-->
<template>
  <span>
    <span v-if="hasPermission">
      <slot name="default"></slot>
    </span>
    <span v-else>
      <slot name="custom"></slot>
    </span>
  </span>
</template>

<script>
import { mapState } from 'vuex'
import { getMenuNameArr, hasVisitPermission } from '@/utils/auth'
export default {
  name: 'permission',
  props: {
    code: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      hasPermission: false
    }
  },
  computed: mapState({
    auth: state => state.permission.userAuth
  }),
  watch: {
    auth: function (newValue) {
      if (newValue.length) {
        this.checkPermission()
      }
    }
  },
  mounted () {
    this.checkPermission()
  },
  methods: {
    checkPermission () {
      let nameArr = getMenuNameArr(this.code)
      if (hasVisitPermission(nameArr, this.auth)) {
        this.hasPermission = true
      } else {
        this.hasPermission = false
      }
    }
  }
}
</script>

<style lang="less" scoped>

</style>
