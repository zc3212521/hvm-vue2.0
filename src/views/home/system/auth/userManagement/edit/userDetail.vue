<template>
  <div>
    <div class="content-section mb16">
      <p class="section-title">基础信息</p>
      <a-form :form="baseDataForm"
              :class="{ 'form-readonly': isDetailPage}" @submit="handleSubmit">
        <!--<a-form-item label="用户头像"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }"
                     class="user-avatar">
          <a-avatar :size="64"
                    icon="user"
                    :src="avatarSrc"
                    style="margin-right: 20px;" />
          <a-upload action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    v-if="!isDetailPage"
                    :multiple="false"
                    :fileList="fileList"
                    @change="handleFileChange"
                    :showUploadList="false">
            <a-button type="primary">
              <a-icon type="upload" /> 上传
            </a-button>
          </a-upload>

        </a-form-item>-->
        <a-form-item label="用户名" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <a-input v-decorator="[ 'userName', {rules: [{ required: true, message: '必填项' },{ validator: firstSpaceValidator, message: '首位不可以是空格'}]} ]" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="登录账号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block;width: 50%;">
          <a-input disabled v-decorator="[ 'account', {rules: [{ required: true, message: '必填项' },{ validator: firstSpaceValidator, message: '首位不可以是空格'}]} ]" placeholder="请输入登录账号" />
        </a-form-item>
        <a-form-item label="用户类型" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <dict-item-select-element v-decorator="['userType',{rules: [{ required: true, message: '必填项' }]}]" :groupCode="'userType'" disables="['1','2']" placeholder="请选择用户类型"></dict-item-select-element>
        </a-form-item>
        <!--<a-form-item label="性别"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-input v-decorator="[
          'confirmPW',
          {rules: [{ required: false, message: '必填项' }]}
        ]"
                   placeholder="请输入性别" />
        </a-form-item>-->
        <a-form-item label="性别" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <dict-item-select-element v-decorator="['sex',{rules: [{ required: true, message: '必填项' }]}]" :groupCode="'sex'" placeholder="请选择性别"></dict-item-select-element>
        </a-form-item>
        <a-form-item label="手机号" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <a-input v-decorator="[ 'mobile', {rules: [{ required: false, message: '必填项' }]} ]" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="邮箱" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <a-input v-decorator="[ 'email', {rules: [ { required: false, message:'邮箱必填' } ]} ]" placeholder="请输入邮箱" />
        </a-form-item>
        <!--<a-form-item label="生日"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-input v-decorator="[
          'birthday',
          {rules: [{ required: false, message: '必填项' }]}
        ]"
                   placeholder="请输入生日" />
        </a-form-item>-->
        <a-form-item label="地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" style="display: inline-block; width: 100%;">
          <a-input v-decorator="[ 'address', {rules: [{ required: false, message: '必填项' }]} ]" placeholder="请输入地址"/>
        </a-form-item>
        <p class="primary-title">员工信息</p>
        <!--
         <a-form-item label="是否锁定"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-switch v-decorator="['isLock', { valuePropName: 'checked', initialValue: baseDataForm.isLock }]" />
        </a-form-item>
        <a-form-item label="是否禁用"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-switch v-decorator="['isProhibit', { valuePropName: 'checked', initialValue: baseDataForm.isProhibit }]" />
        </a-form-item>
         -->
        <a-form-item label="部门" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <select-org-tree-select ref="selectOrg" :treeCheckStrictly="true" :checkable="true" v-decorator="['orgIdLabels',{initialValue:orgIds}]" :disabled=" isDetailPage ==  'false'"></select-org-tree-select>
        </a-form-item>
        <a-form-item label="职位" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" style="display: inline-block; width: 50%;">
          <select-position-tree-select ref="selectPosition"  :treeCheckStrictly="true" :checkable="true" v-decorator="['positionIds',{initialValue:positionIds}]" :disabled="isDetailPage ==  'false'"></select-position-tree-select>
        </a-form-item>
        <!--
        <a-form-item label="备注"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <a-textarea placeholder="请输入备注" />
        </a-form-item>-->
        <a-form-item :wrapper-col="{ span: 16, offset: 4}" v-if="!isDetailPage">
          <a-button :style="{marginRight: '8px'}" @click="handleCancel">取消</a-button>
          <a-button type="primary" html-type="submit" style="margin-right:20px;">确定</a-button>
        </a-form-item>
      </a-form>
    </div>

  </div>
</template>

<script>
import SelectOrgTreeSelect from '@/components/business/SelectOrgTreeSelect'
import SelectPositionTreeSelect from '@/components/business/SelectPositionSelect'
import DictItemSelectElement from '@/components/business/DictItemSelectElement'
import { getUserInfoById, updateUser, selectOrganizationByUserId, getPositionUserJoinList } from '@/http/system'
import { deleteEmpty, deepClone } from '@/utils'
import { messagePrompt } from '@/utils/config'

/**
 * @description:
 * @param file
 * @return: url
 */
// const getObjectURL = (file) => {
//   var url = null
//   if (window.createObjectURL !== undefined) { // basic
//     url = window.createObjectURL(file)
//   } else if (window.URL !== undefined) { // mozilla(firefox)
//     url = window.URL.createObjectURL(file)
//   } else if (window.webkitURL !== undefined) { // webkit or chrome
//     url = window.webkitURL.createObjectURL(file)
//   }
//   return url
// }
export default {
  name: 'userDetail',
  components: {
    SelectOrgTreeSelect,
    SelectPositionTreeSelect,
    DictItemSelectElement
  },
  data () {
    return {
      baseDataForm: this.$form.createForm(this, {}),
      fileList: [],
      orgId: 0,
      orgIds: [],
      positionIds: []
    }
  },
  computed: {
    /**
       * @description: 判读是详情页还是编辑页
       * @return:
       */
    isDetailPage () {
      return this.$route.query.isDetailPage === '1'
    }
    // avatarSrc () {
    //   return this.fileList.length ? getObjectURL(this.fileList[0].originFileObj) : ''
    // }
  },
  mounted () {
    let id = this.$route.query.id
    this.queryUserInfo(id)
    this.selectOrganizationByUserId(id)
    this.getPositionUserJoinList(id)
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.baseDataForm.validateFields((err, values) => {
        if (!err) {
          let result = deleteEmpty(values)
          const paramsGroup = {
            userName: values.userName,
            userId: this.$route.query.id,
            userType: values.userType,
            mobile: result.mobile,
            email: result.email,
            sex: values.sex,
            address: values.address,
            isLock: values.isLock,
            isProhibit: values.isProhibit,
            orgIds: this.$refs.selectOrg.getSelectOrgIds(),
            positionIds: this.$refs.selectPosition.getSelectPositionIds()
          }
          const urlParams = {
            userId: this.$route.query.id
          }
          updateUser(paramsGroup, urlParams).then(res => {
            this.$message.success(messagePrompt.modifySuccess)
            // 跳转至列表页
            this.$router.push(
              {
                name: 'system_auth_user_list'
              }
            )
          }).catch(err => {
            if (err) {
              this.$message.error(messagePrompt.modifyFail)
            }
          })
        }
      })
    },
    handleCancel (e) {
      // 跳转至列表页
      this.$router.push(
        {
          name: 'system_auth_user_list'
        }
      )
    },
    // handleFileChange (info) {
    //   let fileList = [...info.fileList]
    //   // 1. Limit the number of uploaded files
    //   //    Only to show two recent uploaded files, and old ones will be replaced by the new
    //   fileList = fileList.slice(-1)
    //   // 2. read from response and show file link
    //   fileList = fileList.map((file) => {
    //     if (file.response) {
    //       // Component will show file.url as link
    //       file.url = file.response.url
    //     }
    //     return file
    //   })
    //   this.fileList = fileList
    // },
    queryUserInfo (id) {
      let urlParams = {
        userId: id
      }
      getUserInfoById(null, urlParams).then(res => {
        let data = res.data
        const {
          userName,
          userType,
          mobile,
          email,
          sex,
          address,
          // isLock,
          // isProhibit,
          account

        } = data
        this.baseDataForm.setFieldsValue({
          userName,
          userType,
          mobile,
          email,
          sex,
          address,
          // isLock,
          // isProhibit,
          account
        })
        this.$emit('get-user-info', { userName })
      })
    },
    selectOrganizationByUserId (id) {
      let urlParams = {
        userId: id
      }
      selectOrganizationByUserId(null, urlParams).then(res => {
        let orgIds = deepClone(this.orgIds)
        res.data.forEach(item => {
          orgIds.push({
            value: item.orgId
          })
        })
        this.orgIds = orgIds
      })
    },
    getPositionUserJoinList (id) {
      let urlParams = {
        userId: id
      }
      getPositionUserJoinList(null, urlParams).then(res => {
        let positionIds = deepClone(this.positionIds)
        res.data.forEach(item => {
          positionIds.push({
            value: item.positionId
          })
        })
        this.positionIds = positionIds
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
