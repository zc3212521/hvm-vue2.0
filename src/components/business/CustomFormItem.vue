<!--
对基础form表单的封装，直接通过数据来生成form表单
入参:
item: 表单数据数组，具体数据结构见下
  item = {
      itemType: 'input', // 表单类型，可选值 'input' | 'select' | 'radio' | 'textarea' | 'input-number' | 'dateRange' | 'datePicker'
      label: '用户名称', // 表单标题
      placeholder: '请选择用户名称',
      disabled: false // 是否禁用，
      decorator: ['userName', rule:[...]] // 具体用法参看ui框架（https://www.antdv.com/components/form-cn/#this.form.getFieldDecorator(id,-options)-%E5%92%8C-v-decorator=%22[id,-options]%22）
    }
formBlockItemLayout: { // 块级布局
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
formInlineItemLayout: { // 行内布局
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
inlineStyle: {width: 50%} // 行内样式,当块级布局为空时生效

注意：具体用法请结合参看ui框架
-->
<template>
  <a-form-item :label="item.label"
               :label-col="getProps(item).labelCol"
               :wrapper-col="getProps(item).wrapperCol"
               :style="getProps(item).style">

    <template v-if="item.itemType==='select'">
      <a-select v-decorator="item.decorator"
                :style="item.style || null"
                :placeholder="item.placeholder ? item.placeholder : '请选择' + item.label"
                :disabled="item.disabled">
        <a-select-option :value="item.value"
                         v-for="(item,index) in item.selectOptions"
                         :key="index">
          {{item.label}}
        </a-select-option>
      </a-select>
    </template>

    <template v-else-if="item.itemType==='radio'">
      <a-radio-group :options="item.radioOptions"
                     v-decorator="item.decorator"
                     :style="item.style || null"
                     :disabled="item.disabled">
      </a-radio-group>
    </template>

    <template v-else-if="item.itemType==='textarea'">
      <a-textarea v-decorator="item.decorator"
                  :style="item.style || null"
                  :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
                  :rows="4"
                  :disabled="item.disabled">
      </a-textarea>
    </template>
    <template v-else-if="item.itemType==='input'">
      <a-input :type="item.type"
               v-decorator="item.decorator"
               :style="item.style"
               :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
               :disabled="item.disabled">
      </a-input>
    </template>
    <template v-else-if="item.itemType==='input-number'">
      <a-input-number v-decorator="item.decorator"
                      :style="item.style || null"
                      :min="item.min"
                      :max="item.max"
                      :placeholder="item.placeholder"
                      :disabled="item.disabled">
      </a-input-number>
    </template>

    <template v-else-if="item.itemType==='dateRange'">
      <a-range-picker
        v-decorator="item.decorator"
        :style="item.style || null"
        :show-time="item.showTime"
        :format="item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
        :disabled="item.disabled"
      />
    </template>

    <template v-else-if="item.itemType==='monthRange'">
      <a-range-picker
        v-decorator="item.decorator"
        :style="item.style || null"
        :show-time="item.showTime"
        format="YYYY-MM"
        :disabled="item.disabled"
      />
    </template>

    <template v-else-if="item.itemType==='datePicker'">
      <a-date-picker
        v-decorator="item.decorator"
        :style="item.style || null"
        :show-time="item.showTime"
        :placeholder="item.placeholder ? item.placeholder : '选择时间'"
        :format="item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'"
        :showToday="true"
        :disabled="item.disabled"
      />
    </template>

    <template v-else>
      <a-input v-decorator="item.decorator"
               :placeholder="item.placeholder ? item.placeholder : '请输入' + item.label"
               :disabled="item.disabled"/>
    </template>
  </a-form-item>

</template>

<script>
const formBlockItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const formInlineItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

export default {
  name: 'customFormItem',

  mixins: [],

  components: {},

  props: {
    item: {
      require: true
    },
    formBlockItemLayout: {
      type: Object,
      default: () => formBlockItemLayout
    },
    formInlineItemLayout: {
      type: Object,
      default: () => formInlineItemLayout
    },
    // 行内样式
    inlineStyle: {
      type: String,
      default: 'display: inline-block; width: 50%'
    }
  },

  data () {
    return {
      blockStyle: {
        display: 'block',
        width: '100%'
      }
    }
  },
  computed: {},

  watch: {},

  created () {},

  mounted () { },

  destroyed () { },

  methods: {
    getProps (item) {
      if (item.styleType === 'block') {
        return Object.assign(this.formBlockItemLayout, { style: this.blockStyle })
      } else {
        if (item.inlineStyle) {
          return Object.assign(this.formInlineItemLayout, { style: this.item.inlineStyle })
        } else {
          return Object.assign(this.formInlineItemLayout, { style: this.inlineStyle })
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
</style>
