<template>
  <span>
    <permission code="system_auth_user_importUser">
      <a-button type="primary"
                @click="showImportUserModal"
                style="margin-left: 10px;">
        <a-icon type="upload" />导入用户
      </a-button>
    </permission>
    <!-- 用户导入 -->
    <a-modal title="批量导入用户"
             v-model="importUserVisible"
             :confirmLoading="importLoading"
             @ok="importUserSubmit">
      <a-form style="height: 100%;"
              :form="importForm">
        <div class="content-section mb16">
          <div>
            <a-alert style="display: inline-block;font-weight: bold;"
                     message="请先下载批量导入用户的模板文件！"
                     banner />
          </div>
          <a-form-item label="选择文件"
                       :label-col="{ span: 8 }"
                       :wrapper-col="{ span: 16 }"
                       style="display: inline-block; width: 80%;">
            <div v-decorator="[ 'file', { rules: [{ required: true, message: '必填项' }]}]">
              <a-upload :fileList="file"
                        :showUploadList="true"
                        :remove="handleRemove"
                        :beforeUpload="beforeUpload">
                <a-button> <a-icon type="upload" />选择文件</a-button>
              </a-upload>
              <a-button :href="baseUrl + '/sys/users/template/download?security-token=' + token">
                <a-icon type="download" />下载模板
              </a-button>
            </div>
          </a-form-item>
          <a-form-item label="初始密码"
                       :label-col="{ span: 8 }"
                       :wrapper-col="{ span: 16 }"
                       style="display: inline-block; width: 80%;">
            <a-input v-decorator="[ 'defaultPwd', { rules: [{ required: true, message: '必填项' }, { validator: checkDefaultPwd }]}]"
                     type="password"
                     placeholder="请输入初始密码" />
          </a-form-item>
          <a-form-item label="确认初始密码"
                       :label-col="{ span: 8 }"
                       :wrapper-col="{ span: 16 }"
                       style="display: inline-block; width: 80%;">
            <a-input v-decorator="[
                  'confirmDefaultPwd',
                  { rules: [{ required: true, message: '必填项' }, { validator: compareToDefaultPwd }]}
                ]"
                     type="password"
                     placeholder="请确认初始密码" />
          </a-form-item>
        </div>
      </a-form>
    </a-modal>
  </span>
</template>

<script>
import Permission from '@/components/business/permission'
import { importUser } from '@/http/system'
import { encryptionPW, getTokenNoBearer } from '@/utils/auth'
import env from '@/utils/env'
export default {
  name: 'importUser',
  components: {
    Permission
  },
  data () {
    return {
      importForm: this.$form.createForm(this),
      importUserVisible: false,
      file: [], // 上传的文件列表
      importLoading: false,
      authConfig: null,
      token: getTokenNoBearer(),
      baseUrl: env.baseUrl
    }
  },
  methods: {

    // 用户导入
    showImportUserModal () {
      this.file = []
      this.importForm.resetFields()
      this.importUserVisible = true
    },
    beforeUpload (file) {
      this.file = [file]
      // 上传文件之前的钩子，参数为上传的文件，若返回 false 则停止立即上传
      return false
    },
    handleRemove (file) {
      this.file = []
    },
    /**
     * 上传提交
     * @param data
     */
    importUserSubmit (e) {
      const self = this
      this.importForm.validateFields((err, values) => {
        if (!err) {
          this.importLoading = true
          if (this.file.length === 0) {
            this.$message.warning('请选择Excel文件')
            this.importLoading = false
            return false
          }

          // 加密密码
          let defaultPwd = values.defaultPwd
          values.defaultPwd = encryptionPW(defaultPwd)

          // 组装表单数据
          const formData = new FormData()
          formData.append('file', this.file[0])
          formData.append('defaultPwd', values.defaultPwd)
          importUser(formData).then(res => {
            const isSuccess = res.data.isSuccess
            const errorNumber = res.data.errorNumber
            const successNumber = res.data.successNumber
            const importCode = res.data.importCode
            this.importUserVisible = false
            if (isSuccess) {
              const msg = '导入成功！共导入' + successNumber + '条数据'
              this.$message.success(msg)
              this.closeImportUserModal()
            } else {
              this.$error({
                title: '导入完成',
                content: successNumber + '条数据导入成功，' + errorNumber + '条数据导入失败！具体查看下载的失败列表',
                onOk () {
                  self.downloadErrorList(importCode)
                }
              })
            }
          }).catch(res => {
            this.importLoading = false
            this.$message.error(res.data.detail)
          })
        }
      })
    },
    closeImportUserModal () {
      this.importForm.resetFields()
      this.file = []
      this.updateList()
      this.importLoading = false
    },
    downloadErrorList (importCode) {
      this.closeImportUserModal()
      window.location.href = this.baseUrl +
        '/sys/users/importUser/' +
        importCode +
        '/download?security-token=' +
        this.token
    },
    compareToDefaultPwd (rule, value, callback) {
      const form = this.importForm
      if (value && value !== form.getFieldValue('defaultPwd')) {
        callback('两次输入密码不一致！')  // eslint-disable-line
      } else {
        callback()
      }
    },
    checkDefaultPwd (rule, value, callback) {
      if (value && value.length < 8) {
        callback('密码不能低于8位')  // eslint-disable-line
      } else {
        callback()
      }
    },
    updateList () {
      this.$emit('updateList')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
