<template>
  <a-form style="height: 100%;"
          :form="form"
          @submit="handleSubmit">
    <div style="padding-bottom: 80px;zoom: 1;min-height: 100%;">
      <a-form-item label="登录账号"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 20 }">
        <a-input v-decorator="[
          'account',
          {rules: [
            { required: true, message: '必填项', whitespace: true },
            { pattern: /^[A-Za-z0-9_]{4,32}$/, message: '账号只能是4~32位英文字母、数字、下划线' }
          ]}
        ]"
                 placeholder="请输入账号，不可修改" />
      </a-form-item>
      <a-form-item label="初始密码"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <a-input v-decorator="[
          'originPW',
          { rules: [{ required: true, message: '请输入密码' },{ validator: validateToNextPassword }]}
        ]"
                 type="password"
                 placeholder="请输入初始密码" />
      </a-form-item>
      <a-form-item label="确认密码"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <a-input v-decorator="[
          'confirmPW',
          { rules: [{ required: true, message: '必填项' }, { validator: compareToFirstPassword }]}
        ]"
                 type="password"
                 @blur="handleConfirmBlur"
                 placeholder="请输入确认密码" />
      </a-form-item>

      <p class="primary-title ml-30">用户信息</p>

      <a-form-item label="用户名"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <a-input v-decorator="[
          'userName',
          {rules: [{ required: true, message: '必填项' }, { min: 2,max: 32, message: '用户名长度必须在2~32之间'}, { validator: firstSpaceValidator, message: '首位不可以是空格'}]}
        ]"
                 placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item label="用户类型"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <dict-item-select-element v-decorator="['userType',{initialValue: '2', rules: [{ required: true, message: '必填项' }]}]" :groupCode="'userType'" disables="['1']" placeholder="请选择用户类型"></dict-item-select-element>
      </a-form-item>
      <a-form-item label="手机号"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <a-input v-decorator="[
          'mobile'
        ]"
                 placeholder="请输入手机号" />
      </a-form-item>
      <a-form-item label="性别"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <dict-item-select-element v-decorator="['sex',{rules: [{ required: true, message: '必填项' }]}]" :groupCode="'sex'" placeholder="请选择性别"></dict-item-select-element>
      </a-form-item>
      <a-form-item label="邮箱"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 20 }">
        <a-input v-decorator="[
          'email',
          {rules: [
            { required: false }
          ]}
        ]"
                 placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item label="地址"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 20 }">
        <a-input v-decorator="[
          'address',
          {rules: [{ required: false }]}
        ]"
                 placeholder="请输入地址" />
      </a-form-item>

      <p class="primary-title ml-30">员工信息</p>

      <a-form-item label="状态"
                   :label-col="{ span: 4 }"
                   :wrapper-col="{ span: 16 }">
        <a-radio-group v-decorator="['isProhibit',{ initialValue: 0 }]">
          <a-radio :value="0"
                   style="margin-right: 20px;">
            启用
          </a-radio>
          <a-radio :value="1">
            禁用
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="部门"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <select-org-tree-select ref="selectOrg"  :treeCheckStrictly="true" :checkable="true" v-decorator="['orgIdLabels',{initialValue:editOrg.orgId}]" :disabled="editMode === 'edit'"></select-org-tree-select>
      </a-form-item>
      <a-form-item label="职位"
                   :label-col="{ span: 8 }"
                   :wrapper-col="{ span: 16 }"
                   style="display: inline-block; width: 50%;">
        <select-position-tree-select ref="selectPosition"  :treeCheckStrictly="true" :checkable="true" v-decorator="['positionIds',{initialValue:editPosition.id}]" :disabled="editMode === 'edit'"></select-position-tree-select>
      </a-form-item>
    </div>

    <div class="steps-content-footer">
      <a-form-item style="text-align: center;padding-top:20px;margin-top: -80px;">
        <a-button @click="cancel"
                  style="margin-right: 20px;">
          取消
        </a-button>
        <a-button type="primary"
                  @click="nextStep"
                  style="margin-right: 20px;">
          下一步
        </a-button>
        <a-button
          type="primary"
          html-type="submit"
          @click="handleSubmit"
        >
          跳过并完成
        </a-button>
      </a-form-item>
    </div>
  </a-form>
</template>

<script>
import SelectOrgTreeSelect from '@/components/business/SelectOrgTreeSelect'
import SelectPositionTreeSelect from '@/components/business/SelectPositionSelect'
import DictItemSelectElement from '@/components/business/DictItemSelectElement'
import { addUser } from '@/http/system'
import { deleteEmpty } from '@/utils'
import { messagePrompt } from '@/utils/config'

import {
  encryptionPW
} from '@/utils/auth'
export default {
  name: 'loginInfo',
  components: {
    SelectOrgTreeSelect,
    SelectPositionTreeSelect,
    DictItemSelectElement
  },
  data () {
    return {
      form: this.$form.createForm(this),
      confirmDirty: false,
      orgIds: [],
      editOrg: {},
      editPosition: {},
      editMode: null
    }
  },
  // this.cancel()
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.saveUser(false)
    },
    nextStep () {
      this.saveUser(true)
    },
    saveUser (next) {
      this.form.validateFields((err, values) => {
        if (!err) {
          let result = deleteEmpty(values)
          if (result.originPW !== result.confirmPW) {
            this.$message.error('初始密码与确认密码不一致！请重新填写')
            return
          }
          result.orgIds = this.$refs.selectOrg.getSelectOrgIds()
          result.positionIds = this.$refs.selectPosition.getSelectPositionIds()
          // 删除selectorg组件生成的默认数据
          delete result.orgIdLabels
          let password = result.originPW
          result.password = encryptionPW(password)
          delete result.originPW
          delete result.confirmPW
          addUser(result).then(res => {
            this.$emit('addSuccess')
            if (next) {
              this.$emit('nextStep', res.data)
            } else {
              this.$message.success(messagePrompt.addSuccess)
              this.cancel()
            }
          })
        }
      })
    },
    cancel () {
      this.$emit('closeDrawer')
    },
    clear () {
      this.form.resetFields()
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('originPW')) {
        callback('两次输入密码不一致！')  // eslint-disable-line
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form
      if (value && this.confirmDirty) {
        form.validateFields(['confirmPW'], { force: true })
      }
      callback()
    }
  }
}
</script>

<style lang="less" scoped>
  .steps-content-footer {
    position: relative;

  }
  .ml-30 {
    margin-left: 30px;
  }
</style>
