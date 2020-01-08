<template>
  <a-form
    style="height: 100%;"
    :form="form"
    @submit="handleSubmit"
  >
    <div style="padding-bottom: 80px;zoom: 1;min-height: 100%;">
      <a-form-item
        label="状态"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-radio-group v-decorator="['status']">
          <a-radio :value="1" style="margin-right: 20px;">
            启用
          </a-radio>
          <a-radio :value="0">
            禁用
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="离职日期"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-date-picker v-decorator="['quitDate', { rules: [{ type: 'object', required: false, message: 'Please select time!' }]}]" style="width: 100%;"/>
      </a-form-item>
      <a-form-item
        label="身份证号"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-input
          v-decorator="[
          'IDnum',
          {rules: [{ required: false }]}
        ]"
          placeholder="请输入身份证号"
        />
      </a-form-item>
      <a-form-item
        label="归属银行"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="display: inline-block; width: 50%;"
      >
        <a-input
          v-decorator="[
          'bank',
          {rules: [{ required: false }]}
        ]"
          placeholder="请输入归属银行"
        />
      </a-form-item>
      <a-form-item
        label="银行账号"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="display: inline-block; width: 50%;"
      >
        <a-input
          v-decorator="[
          'bankAccount',
          {rules: [{ required: false }]}
        ]"
          placeholder="请输入银行账号"
        />
      </a-form-item>
      <a-form-item
        label="部门"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="display: inline-block; width: 50%;"
      >
        <a-input
          v-decorator="[
          'department',
          {rules: [{ required: false }]}
        ]"
          placeholder="请输入部门"
        />
      </a-form-item>
      <a-form-item
        label="职位"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="display: inline-block; width: 50%;"
      >
        <a-input
          v-decorator="[
          'position',
          {rules: [{ required: false }]}
        ]"
          placeholder="请输入职位"
        />
      </a-form-item>
      <a-form-item
        label="备注描述"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-textarea
          v-decorator="[
          'des',
          {rules: [{ required: false }]}
        ]"
          placeholder="请输入备注描述"
        />
      </a-form-item>
    </div>

    <a-form-item
      style="text-align: center;padding: 10px; margin-top: -80px;"
    >
      <a-button @click="goPreStep" style="margin-right: 160px;">
        上一步
      </a-button>
      <a-button @click="cancel" style="margin-right: 20px;">
        取消
      </a-button>
      <a-button
        type="primary"
        html-type="submit"
      >
        下一步
      </a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name: 'staffInfo',
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('nextStep', values)
        }
      })
    },
    cancel () {
      this.$emit('closeDrawer')
    },
    goPreStep () {
      this.$emit('goPreStep')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
