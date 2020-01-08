<template>
  <div>
    <div class="content-section mb16">
      <p class="section-title">基础信息</p>
      <a-form :form="dataForm" :class="{ 'form-readonly': true}">
        <a-form-item label="用户名" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <a-input v-decorator="[ 'userName', {rules: [{ required: false, message: '必填项' }]} ]" placeholder="请输入用户名"/>
        </a-form-item>
        <a-form-item label="登录账号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block;width: 50%;">
          <a-input v-decorator="[ 'account', {rules: [{ required: false, message: '必填项' }]} ]" placeholder="请输入登录账号"/>
        </a-form-item>
        <a-form-item label="用户类型" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <dict-item-select-element v-decorator="['userType',{rules: [{ required: false, message: '必填项' }]}]" :groupCode="'userType'" placeholder="请选择用户类型"></dict-item-select-element>
        </a-form-item>
        <a-form-item label="性别" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <dict-item-select-element v-decorator="['sex',{rules: [{ required: false, message: '必填项' }]}]" :groupCode="'sex'" placeholder="请选择性别"></dict-item-select-element>
        </a-form-item>
        <a-form-item label="手机号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <a-input v-decorator="[ 'mobile', {rules: [{ required: false, message: '必填项' }]} ]" placeholder="请输入手机号"/>
        </a-form-item>
        <a-form-item label="邮箱" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <a-input v-decorator="[ 'email', {rules: [ { type: 'email', message: '请输入有效的email' }, { required: false } ]} ]" placeholder="请输入邮箱"/>
        </a-form-item>
        <a-form-item label="地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" style="display: inline-block; width: 100%;">
          <a-input v-decorator="[ 'address', {rules: [{ required: false, message: '必填项' }]} ]" placeholder="请输入地址"/>
        </a-form-item>
        <div>
          <a-form-item label="是否锁定" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
            <a-switch v-decorator="['isLock', { valuePropName: 'checked' }]"/>
          </a-form-item>
          <a-form-item label="是否禁用" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
            <a-switch v-decorator="['isProhibit', { valuePropName: 'checked' }]"/>
          </a-form-item>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getUserInfoById } from '@/http/system'
import DictItemSelectElement from '@/components/business/DictItemSelectElement'

export default {
  name: 'userDetails',
  components: { DictItemSelectElement },
  props: {
    userId: {
      type: String
    }
  },
  data () {
    return {
      dataForm: this.$form.createForm(this, {}),
      loading: false
    }
  },
  watch: {
    userId: function (newValue) {
      this.queryUserDetails(newValue)
    }
  },
  mounted () {
    if (this.userId) {
      this.queryUserDetails(this.userId)
    }
  },
  methods: {
    queryUserDetails (userId) {
      this.loading = true
      let urlParams = { userId: userId }
      getUserInfoById(null, urlParams).then(res => {
        const { userName, account, userType, sex, mobile, email, address, isLock, isProhibit } = res.data
        this.dataForm.setFieldsValue({ userName, account, userType, sex, mobile, email, address, isLock, isProhibit })
        this.$emit('user-details', { userId, userName, isLock, isProhibit })
        this.loading = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .user-avatar /deep/ .ant-form-item-label label {
    height: 64px;
    line-height: 64px;
  }
</style>
