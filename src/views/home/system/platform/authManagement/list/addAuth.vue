<template>
  <a-form
    style="height: 100%;"
    :form="form"
    @submit="handleSubmit"
  >
    <div style="padding-bottom: 80px;zoom: 1;min-height: 100%;">
      <a-form-item
        label="权限类型"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <dict-item-select-element v-decorator="['authType',{initialValue: '1'}]" :groupCode="'authType'" :disabled="type !== 'add'" placeholder="请选择类型" @change="changeAuthType"></dict-item-select-element>
      </a-form-item>
      <a-form-item
        v-if="authType === '1'"
        label="父菜单"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-tree-select
          v-decorator="[
                  'parentId',
                  {rules: [{ required: true, message: '必填项' }]}
                ]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="menuTree"
          placeholder='请选择父菜单'
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item
        v-if="authType === '2'"
        label="父菜单"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-tree-select
          v-decorator="[
                  'parentId',
                  {rules: [{ required: true, message: '必填项' }]}
                ]"
          :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
          :treeData="menuTreeWithDisable"
          placeholder='请选择父菜单'
          treeDefaultExpandAll
        >
        </a-tree-select>
      </a-form-item>
      <a-form-item
        :label="authType === '1' ? '菜单名称' : '权限名称'"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
                  'authName',
                  {rules: [{ required: true, message: '必填项' },{min: 2,max: 30, message: '名称长度必须在2~30之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}
                ]"
          :placeholder="authType === '1' ? '请输入菜单名称' : '请输入权限名称'"
        />
      </a-form-item>

      <a-form-item
        label="权限编码"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
                  'authCode',
                  {rules: [{ required: true, message: '必填项' },{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}
                ]"
          :addonBefore="preCode ? preCode + '_' : ''"
          :disabled="authType === '1' && type === 'edit'"
          placeholder="请输入编码"
        />
      </a-form-item>
      <a-form-item
        v-if="authType === '1'"
        label="路由url"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
                  'url',
                  {rules: [{ required: true, message: '必填项' },{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}
                ]"
          :addonBefore="preUrl + '/'"
          placeholder="请输入路由url"
        />
      </a-form-item>
      <a-form-item
        v-if="authType === '2'"
        label="接口url"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-textarea
          v-decorator="[
                  'authUrl'
                ]"
          placeholder="请输入接口url 。格式为requestMethod:/url;requestMethod.... 支持多个URI录入。以';'分割多个URI，以':'分割requestMethod与url。支持'*'通配符、数字通配符为“%d”。其中';'':''*''%'为英文半角。如:get:/sys/auth/list;post:/sys/auth/edit/*;get:/sys/auth/%d;"
          :rows="4"
        />
      </a-form-item>
      <a-form-item
        label="排序"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="display: inline-block; width: 50%;"
      >
        <a-input-number
          v-decorator="[
                  'authSort',
                   { initialValue: 1 },
                  {rules: [{ required: true, message: '必填项' }]}
                ]"
          :min="1"
          :max="1000"
          placeholder="请输入排序"
        />
      </a-form-item>
      <a-form-item
        v-if="authType === '2'"
        label="操作类型"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="display: inline-block; width: 50%;"
      >
        <dict-item-select-element v-decorator="['actionType',{initialValue: '1',rules: [{ required: true, message: '必填项' }]}]" :groupCode="'actionType'" placeholder="请选择类型" ></dict-item-select-element>
      </a-form-item>
      <a-form-item
        v-if="authType === '1'"
        label="菜单图标"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="display: inline-block; width: 50%;"
      >
        <a-input
          v-decorator="[
                  'icon',
                  {rules: [{ required: false }]}
                ]"
          placeholder="请输入菜单图标"
        />
      </a-form-item>
      <a-form-item
        label="备注描述"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
                  'description',
                  {rules: [{ required: false }]}
                ]"
          placeholder="请输入备注描述"
        />
      </a-form-item>
    </div>
  </a-form>
</template>

<script>
import {
  getAllMenu,
  addAuth,
  getAuthById,
  editAuthById
} from '@/http/system'
import { simpleMenuTree, findNodeByAttr } from '@/utils/auth'
import DictItemSelectElement from '@/components/business/DictItemSelectElement'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'addAuth',
  components: {
    DictItemSelectElement
  },
  props: {
    type: {
      type: String,
      required: true
    },
    visible: {
      type: Boolean,
      default: false
    },
    authId: [String]
  },
  data () {
    return {
      authType: '1',
      form: this.$form.createForm(this, {
        onValuesChange: this.onValuesChange
      }),
      menuTreeWithDisable: [],
      menuTree: [],
      checkedData: undefined,
      preCode: null,
      preUrl: '',
      hasChildren: false
    }
  },
  created () {
    this.queryAllMenu().then(() => {
      if (this.type !== 'add') {
        this.queryAuthInfo(this.authId)
      }
    })
  },
  watch: {
    visible (val) {
      if (val) {
        if (this.type === 'add') {
          this.preCode = null
          this.preUrl = ''
          this.queryAllMenu().then(() => {
            this.changeAuthType('1')
            this.form.resetFields()
          })
        } else {
          this.queryAuthInfo(this.authId)
        }
      } else {
        this.form.resetFields()
      }
    }
  },
  methods: {
    onValuesChange (props, values) {
      if (this.menuTree.length) {
        if (values.parentId) {
          let parentId = values.parentId
          let parent = findNodeByAttr(this.menuTree, 'authId', parentId)
          this.preCode = parent.authCode
          if (values.parentId !== '0') {
            this.preUrl = parent.url
          } else {
            this.preUrl = ''
          }
        }
      }
    },
    queryAllMenu () { // 获取所有目录tree
      return new Promise((resolve) => {
        getAllMenu().then(res => {
          let newTreeWithDisable = []
          let newTree = []
          simpleMenuTree(res.data, newTreeWithDisable)
          simpleMenuTree(res.data, newTree, false)
          this.menuTreeWithDisable = newTreeWithDisable
          this.menuTree = newTree
          resolve()
        })
      })
    },
    queryAuthInfo (authId) {
      getAuthById(null, {
        authId
      }).then(res => {
        let data = res.data
        this.authType = data.authType + ''
        let authCodeArr = data.authCode.split('_')
        let authCode = authCodeArr[authCodeArr.length - 1]
        let urlArr = data.url.split('/')
        let authUrl = urlArr[urlArr.length - 1]
        this.$nextTick(() => {
          if (this.authType === '1') { // 菜单权限
            this.form.setFieldsValue({
              authType: this.authType,
              parentId: data.parentId,
              authCode: authCode,
              authName: data.authName,
              url: authUrl,
              authSort: data.authSort,
              icon: data.icon,
              description: data.description
            })
          } else {
            this.form.setFieldsValue({
              authType: this.authType,
              parentId: data.parentId,
              authCode: authCode,
              authName: data.authName,
              authUrl: data.authUrl,
              actionType: data.actionType.toString(),
              authSort: data.authSort,
              description: data.description
            })
          }
        })
      })
    },
    changeAuthType (value) {
      this.form.setFieldsValue({
        parentId: null
      })
      this.authType = value
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.authType = this.authType
          let parentId = values.parentId

          if (parentId !== '0') {
            values.authCode = this.preCode + '_' + values.authCode
          }
          values.url = this.preUrl + '/' + values.url
          if (values.authType === '1') { // 菜单
            values.authUrl = undefined
          } else { // 权限
            values.url = undefined
          }
          if (this.type === 'add') {
            addAuth(values).then(res => {
              this.$message.success(messagePrompt.addSuccess)
              this.querySuccess()
            })
          } else {
            let urlParams = {
              authId: this.authId
            }
            values.authId = this.authId
            editAuthById(values, urlParams).then(res => {
              this.$message.success(messagePrompt.modifySuccess)
              this.querySuccess()
            })
          }
        }
      })
    },
    querySuccess () {
      this.$emit('updateAuth')
      this.queryAllMenu()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
