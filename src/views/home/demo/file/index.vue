<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb  /></div>
    <a-form style="height: 100%;"
            :form="form"
            @submit="handleSubmit">
      <div class="content-section mb16" style="padding-bottom: 260px;zoom: 1;min-height: 100%;">
        <a-form-item label="文件"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 60%;">
          <!--<a-input v-decorator="[-->
          <!--'file',-->
          <!--{ rules: [{ required: true, message: '请选择上传文件' }]}-->
          <!--]"-->
          <!--type="file"-->
          <!--ref="myfile"-->
          <!--@change="changeFile($event)"-->
          <!--placeholder="请选择上传文件" />-->
          <div>
            <a-upload :fileList="file"  :remove="handleRemove" :beforeUpload="beforeUpload">
              <a-button> <a-icon type="upload" /> 选择文件 </a-button>
            </a-upload>
          </div>

        </a-form-item>
        <a-form-item label="业务编号"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 60%;">
          <a-input v-decorator="['bizId']" type="number"
                   placeholder="对应bizId,根据项目具体要求传入"
          />
        </a-form-item>
        <a-form-item label="业务编码"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 60%;">
          <a-input v-decorator="['bizCode']"
                   placeholder="对应bizCode,根据项目具体要求传入"
          />
        </a-form-item>
        <a-form-item label="子业务编号"
                     :label-col="{ span: 8 }"
                     :wrapper-col="{ span: 16 }"
                     style="display: inline-block; width: 60%;">
          <a-input v-decorator="['subBizId']" type="number"
                   placeholder="对应subBizId,根据项目具体要求传入"
          />
        </a-form-item>

        <a-form-item style="text-align: center;padding: 10px;width: 60%;">
          <a-button type="primary"
                    html-type="submit">
            上传
          </a-button>
        </a-form-item>
      </div>
    </a-form>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import { uploadSysFile } from '@/http/system'
import { messagePrompt } from '@/utils/config'
export default {
  name: 'editUserPassword',
  components: {
    Breadcrumb
  },
  data () {
    return {
      file: [],
      form: this.$form.createForm(this)
    }
  },

  methods: {
    beforeUpload (file) {
      this.file = [file]
      return false
    },
    handleRemove (file) {
      this.file = []
    },
    // changeFile (e) {
    //   this.file = e.target.files
    // },
    handleSubmit (e) {
      e.preventDefault()
      var len = this.file.length
      if (len === 0) {
        this.$message.info('请选择文件')
      } else {
        this.form.validateFields((err, values) => {
          if (!err) {
            let formData = new FormData()
            formData.append('file', this.file[0])
            if (values.bizId) {
              formData.append('bizId', values.bizId)
            }
            if (values.bizCode) {
              formData.append('bizCode', values.bizCode)
            }
            if (values.subBizId) {
              formData.append('subBizId', values.subBizId)
            }
            uploadSysFile(formData).then(res => {
              window.vm.$message.success(messagePrompt.uploadSuccess)
              this.form.resetFields()
              this.file = []
            }).catch(res => {
              window.vm.$message.error(res.data.detail)
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
