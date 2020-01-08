<template>
  <div>
    <a-form :form="addPositionForm">
        <a-form-item
          label="职位名称"
          required
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >
          <a-input
            placeholder="请输入职位名称"
            v-decorator="['positionName',{ rules: [{ required: true, message: '请输入职位名称' }, { min: 2,max: 64, message: '职位名称长度必须在2~64之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}]"
          />
        </a-form-item>

        <a-form-item
          label="选择职位组"
          required
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 15 }"
        >

          <a-select
            v-decorator="['positionGroupId',{ rules: [{ required: true, message: '请选择职位组' }]}]"
            placeholder="请选择职位组"
          >
            <a-select-option
              :value="item.id"
              v-for="(item,index) in positionGroupData"
              :key="index"
            >
              {{item.groupName}}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
  </div>
</template>
<script>
import { getPostioniTree } from '@/http/system'
export default {
  name: 'addForm',
  data () {
    return {
      addPositionForm: this.$form.createForm(this, {}),
      positionTreeData: []
    }
  },
  props: {
    showIndex: {
      type: Number,
      default: 0
    }
  },
  computed: {
    /**
     * @description: 职位组信息
     * @param {type}
     * @return:
     */
    positionGroupData () {
      return this.positionTreeData.map(item => {
        const { groupName, id } = item
        return { groupName, id }
      })
    }
  },
  created () {
    this.getPostioniTreeFn()
  },
  methods: {
    /**
     * 获取职位组下有哪些职位
    */
    getPostioniTreeFn () {
      getPostioniTree().then(res => {
        this.positionTreeData = res.data
      })
    }
  },
  watch: {
    showIndex: function (val) {
      if (val === 0) {
        this.addPositionForm.resetFields()
      }
    }
  }

}
</script>
<style lang="less" scoped>

</style>
