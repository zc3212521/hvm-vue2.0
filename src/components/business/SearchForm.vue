<!--
表单筛选组件，对 <h-top-bar>跟 <custom-form-item>组件的二次封装
入参：formOptions。类型为数组
 {
  itemType: 'input', // 支持类型为 input, select, radio, dateRange, monthRange
    label: '配置名称', // label 名称
  decorator: [ // 参看 （https://www.antdv.com/components/form-cn/）v-decorator配置
  'configKey'
]
},
 {
  itemType: 'dateRange',
    label: '创建时间',
  decorator: [
  'dateRange'
],
  showTime: true // 是否可选择小时分钟秒
}
-->
<template>
  <h-top-bar
    @handleSearch="onSearch"
    @handleReset="handleReset"
    @toggleFlod="toggleFlod"
    :canFlod="options.length > 2"
  >
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col
          :span="item.itemType === 'dateRange' && item.showTime ? '12' : flod ? '11' : '7'"
          v-for="item in formOptions"
          :key="item.label"
        >
          <custom-form-item
            :item="item"
            inline-style="width: 100%;"
            :formInlineItemLayout="layout"></custom-form-item>
        </a-col>
      </a-row>
    </a-form>
  </h-top-bar>
</template>

<script>
import HTopBar from '@com/business/HTopBar.vue'
import CustomFormItem from '@com/business/CustomFormItem'
import { deleteEmpty, localDate2utc } from '@/utils'
export default {
  name: 'SearchForm',
  components: {
    HTopBar,
    CustomFormItem
  },
  props: {
    formOptions: {
      type: Array,
      required: true
    },
    layout: {
      type: Object,
      default: () => ({
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      })
    }
  },
  data () {
    return {
      flod: true, // 控制头部筛选组件是否折叠
      form: this.$form.createForm(this, {})
    }
  },
  computed: {
    options () {
      return this.formOptions.map(item => {
        if (item.itemType === 'dateRange') {
          return item
        } else {
          item.styleType = 'inline'
          return item
        }
      })
    }
  },
  methods: {
    /**
     * @description: 筛选
     * @return:
     */
    onSearch () {
      this.form.validateFields((err, values) => {
        if (!err) {
          let result = deleteEmpty(values)
          Object.keys(result).forEach(item => {
            if (this.getDateRangeFields().includes(item)) {
              result[item][0] = localDate2utc(result[item][0])
              result[item][1] = localDate2utc(result[item][1])
            }
          })
          this.$emit('onSearch', result)
        }
      })
    },
    getDateRangeFields () {
      return this.formOptions.map(item => {
        if (item.itemType && item.itemType === 'dateRange') {
          return item.decorator[0]
        } else {
          return ''
        }
      })
    },
    /**
     * @description:重置筛选
     * @return:
     */
    handleReset () {
      this.form.resetFields()
      this.$emit('onReset')
    },
    /**
     * @description: 展开筛选项
     * @param {Boolean} flod
     * @return:
     */
    toggleFlod (flod) {
      this.flod = flod
    }
  }
}
</script>

<style lang="less" scoped></style>
