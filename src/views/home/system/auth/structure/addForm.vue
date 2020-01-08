<template>
  <div>
    <p class="draw-content-title">部门信息</p>
      <a-form :form="editOrgForm">
        <a-form-item v-show="false">
          <a-input v-decorator="['orgId', { initialValue: editOrg.orgId }]" />
        </a-form-item>

        <a-form-item
          label="部门名称"
          required
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            placeholder="请输入"
            v-decorator="[
              'orgName',
              {
                rules: [{ required: true, message: '请输入部门名称' },{min: 2,max: 32, message: '部门名称长度必须在2~32之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}],
                initialValue: editOrg.orgName
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="部门编码"
          required
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            placeholder="请输入部门编码"
            v-decorator="[
              'orgCode',
              {
                rules: [{ required: true, message: '请输入部门编码' },{min: 2,max: 32, message: '部门编码长度必须在2~32之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}],
                initialValue: editOrg.orgCode
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          label="上级部门"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
        >
          <SelectOrgTreeSelect
            ref="selectParentOrg"
            v-decorator="['parentId', { initialValue: editOrg.parentId }]"
            :disabled="editMode === 'edit'"
          ></SelectOrgTreeSelect>
        </a-form-item>
        <a-form-item
          label="排序"
          required
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input-number
            placeholder="0"
            v-decorator="[
              'orgSort',
              {
                rules: [{ required: true, message: '请输入排序数值' }],
                initialValue: editOrg.orgSort
              }
            ]"
            :min="1"
            :max="9999"
          />
        </a-form-item>
      </a-form>
  </div>
</template>

<script>
import SelectOrgTreeSelect from '@/components/business/SelectOrgTreeSelect'
export default {
  name: 'addForm',
  data () {
    return {
      editOrgForm: this.$form.createForm(this, {}),
      editMode: 'add',
      orgKey: 1
    }
  },
  props: {
    editOrg: {
      type: Object
    },
    showIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    showIndex: function (val) {
      if (val === 0) {
        this.editOrgForm.resetFields()
      }
    }
  },
  components: {
    SelectOrgTreeSelect
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>

</style>
