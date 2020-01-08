<template>
  <div>
    <div class="content-section">
      <p class="section-title">基础信息</p>
      <a-form :form="baseDataForm" :class="{ 'form-readonly':isDetailPage}" @submit="handleSubmit">
        <a-form-item label="租户名称"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-input v-decorator="['tenantName', { rules: [{ required: true, message: '必填项' },{ min: 1, max: 64, message: '租户名称长度必须在1~64之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}] }]" placeholder="请输入租户名称" />
        </a-form-item>
        <a-form-item label="账号"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-input disabled v-decorator="['account',{ rules: [{ required: true, message: '必填项' },{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}]" placeholder="请输入账号" />
        </a-form-item>
        <a-form-item label="联系号码"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-input v-decorator="['mobile',
                { rules: [{ required: false, message: '必填项' }] }]" placeholder="请输入联系号码" />
        </a-form-item>
        <a-form-item label="邮箱"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 50%;">
          <a-input v-decorator="['email',
                { rules: [{ required: false, message: '必填项' }] }]" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="备注"
                     :label-col="{ span: 4 }"
                     :wrapper-col="{ span: 20 }">
          <a-textarea v-decorator="['description']" placeholder="请输入备注" />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 20, offset: 4}"
                     v-if="!isDetailPage">
          <a-button :style="{marginRight: '8px'}" @click="handleCancel">取消</a-button>
          <a-button type="primary" html-type="submit"
                    style="margin-right:20px;">确定</a-button>
        </a-form-item>

      </a-form>
    </div>
  </div>
</template>

<script>
import { queryTenantInfoById, updateTenant } from '@/http/system'
import { deleteEmpty } from '@/utils'
import { messagePrompt } from '@/utils/config'

/**
 * @description:
 * @param {type}
 * @return: url
 */
const getObjectURL = (file) => {
  var url = null
  if (window.createObjectURL !== undefined) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}
export default {
  name: 'userDetail',
  data () {
    return {
      baseDataForm: this.$form.createForm(this, {}),
      fileList: []
    }
  },
  computed: {
    /**
       * @description: 判读是详情页还是编辑页
       * @param {type}
       * @return:
       */
    isDetailPage () {
      return this.$route.query.isDetailPage === '1'
    },
    avatarSrc () {
      return this.fileList.length ? getObjectURL(this.fileList[0].originFileObj) : ''
    }
  },
  mounted () {
    let id = this.$route.query.id
    this.queryTenantInfo(id)
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.baseDataForm.validateFields((err, values) => {
        if (!err) {
          let result = deleteEmpty(values)
          const paramsGroup = {
            tenantName: values.tenantName,
            tenantId: this.$route.query.id,
            mobile: result.mobile,
            email: result.email,
            description: values.description
          }
          const urlParams = {
            tenantId: this.$route.query.id
          }
          updateTenant(paramsGroup, urlParams).then(res => {
            this.$message.success(messagePrompt.modifySuccess)
            // 跳转至列表页
            this.$router.push(
              {
                name: 'system_platform_tenant_list'
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
          name: 'system_platform_tenant_list'
        }
      )
    },
    queryTenantInfo (id) {
      // this.loading = true
      // let urlParams = {
      //   tenantId: id
      // }
      queryTenantInfoById(id).then(res => {
        let data = res.data
        const {
          tenantName,
          email,
          password,
          account,
          description,
          mobile
        } = data

        this.baseDataForm.setFieldsValue({
          tenantName,
          email,
          password,
          account,
          description,
          mobile
        })
        // this.$emit('get-user-info', { userName, isLock, isProhibit })
        // this.loading = false
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
