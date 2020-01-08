<!--
 * 根据 字典组编码 获得字典 并返回对应的下拉框组件
 * @Param groupCode 根据传入的 字典组编码：groupCode 查询字段数据返回下拉组件
 * @Param v-on:change 根据change事件函数回调 ：参数为选中字典值
 * @Param disables 禁选的下拉框数组，可以针对某些不能选择时做单独设置，如：['0'，'1']
 * @Param showChoice 是否显示请选择，默认为 false 不显示，如果想追加请选择主动设置为true。默认为“请选择”
 * @Param placeholder 默认提示
 * @Param disabled select组件禁选
 * 前提：哪个页面使用，需要在路由getRouter.js 对应的 meta信息中加入dicts。如：
                meta: {
                  title: '用户管理',
                  dicts: ['userType'],
                  linkable: true
                },
 * 如果要传入默认值选中字典项，通过对 v-decorator 传入的字段设置 value 初始值实现。 如：this.form.setFieldsValue({ 'userType': '1' })
 * 使用示例：<a-form-item label="测试下拉选择" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <dict-item-select-element v-decorator="['userType',{initialValue: '2', rules: [{ required: true, message: '必填项' }]}]" :groupCode="'userType'" disables="['1']" placeholder="请选择用户类型"></dict-item-select-element>
        </a-form-item>
 -->
<template>
  <a-select :placeholder="checkPlaceHolder"
            :value="checkValue"
            :disabled="checkDisabled"
            @change="handleChange">
    <a-select-option :value="option.value"
                     v-for="(option,index) in selectOption"
                     :key="index"
                     :disabled="option.disabled">
      {{option.label}}
    </a-select-option>
  </a-select>
</template>

<script>
import { formatDictsToArray } from '@/utils'
const choiceLabel = '请选择'
export default {
  name: 'DictItemSelectElement',
  components: {},
  props: ['groupCode', 'value', 'disabled', 'disables', 'placeholder', 'showChoice'],
  data () {
    return { selectOption: [] }
  },
  computed: {
    checkValue () {
      return (this.value === undefined || this.value === null) ? this.value : this.value.toString()
    },
    checkPlaceHolder () {
      return this.placeholder === undefined ? choiceLabel : this.placeholder
    },
    checkDisabled () {
      return this.disabled
    }
  },

  watch: {
  },

  created () {
    this.loadDicData()
  },

  mounted () {
  },

  updated () {
  },

  destroyed () {
  },
  methods: {
    loadDicData () {
      this.selectOption = formatDictsToArray(this.groupCode, this.$dict)
      if (this.showChoice === true) {
        this.selectOption.unshift({ label: choiceLabel, value: choiceLabel })
      }
      if (this.disables !== undefined) {
        this.selectOption.forEach(option => {
          if (this.disables.indexOf(option.value) > -1) {
            option.disabled = true
          }
        })
      }
    },
    handleChange (value) {
      if (value === choiceLabel) {
        value = undefined
      }
      this.$emit('change', value)
    }
  }
}
</script>
