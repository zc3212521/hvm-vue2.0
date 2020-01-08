<template>
  <a-form :form="addForm" :class="{ 'form-readonly': readonly }">
    <custom-form-item
      v-for="item in editFormItem"
      :key="item.label"
      :item="item"
    />
  </a-form>
</template>

<script>
import moment from 'moment'
import CustomFormItem from '@com/business/CustomFormItem'
import { formatFormSelectDictItem, utc2localDate, deepClone } from '@/utils'
import { getIpsById } from '@/http/system'
// 限时
const LIMIT_TIME = '0'
// 永久
const FOREVER = '1'
// 限时选择时间页面位置，json下标
const DATE_RANGE_IDX = 2
const regexp = /^(?!((192\.168\.199\.\d{1,3}))|(192\.168\.9\.\d{1,3})|(127\.0\.0\.1))(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/
export default {
  name: 'addForm',
  components: {
    CustomFormItem
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    showIndex: {
      type: Number,
      default: 0
    },
    recordId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      addForm: this.$form.createForm(this),
      editFormItem: [],
      readonly: false
    }
  },
  watch: {
    visible: function (val) {
      if (val) {
        if (this.showIndex === 0) {
          this.readonly = false
        }
        if (this.showIndex === 1) {
          this.readonly = false
          this.getDetailData()
        }
        if (this.showIndex === 2) {
          this.readonly = true
          this.getDetailData()
        }
      }
    }
  },
  created () {
    const editFormItem = [
      {
        label: '名单类型',
        decorator: [
          'ipType',
          { rules: [{ required: true, message: '必填项' }] }
        ],
        itemType: 'select',
        selectOptions: []
      },
      {
        label: '时间限制类型',
        decorator: [
          'timeLimitType',
          {
            rules: [{ required: true, message: '必填项' }],
            getValueFromEvent: this.setDateRange
          }
        ],
        itemType: 'select',
        selectOptions: []
      },
      {
        label: 'IP起点',
        decorator: [
          'ipStart',
          {
            rules: [
              { required: true, message: '必填项' },
              { validator: this.firstSpaceValidator, message: '首位不可以是空格' },
              {
                validator: (rule, value, callback) => {
                  if (regexp.test(value)) {
                    callback()
                  } else {
                    callback('请输入正确ip') // eslint-disable-line
                  }
                }
              }
            ]
          }
        ]
      },
      {
        label: 'IP终点',
        decorator: [
          'ipEnd',
          {
            rules: [
              { required: true, message: '必填项' },
              { validator: this.firstSpaceValidator, message: '首位不可以是空格' },
              {
                validator: (rule, value, callback) => {
                  if (regexp.test(value)) {
                    callback()
                  } else {
                    callback('请输入正确ip') // eslint-disable-line
                  }
                }
              }
            ]
          }
        ]
      },
      {
        label: '状态',
        decorator: [
          'isValid',
          { initialValue: 1 },
          { rules: [{ required: true, message: '必填项' }] }
        ],
        itemType: 'radio',
        radioOptions: [
          {
            label: '启用',
            value: 1
          },
          {
            label: '禁用',
            value: 0
          }
        ]
      }
    ]
    let tempEditFormItem = formatFormSelectDictItem(
      editFormItem,
      'ipType'
    )
    this.editFormItem = formatFormSelectDictItem(
      tempEditFormItem,
      'timeLimitType',
      'ipTimeLimit'
    )
    this.columns = this.formatFormColumsItem()
    if (this.recordId) {
      if (this.showIndex === 1) {
        this.readonly = false
        this.getDetailData()
      }
      if (this.showIndex === 2) {
        this.readonly = true
        this.getDetailData()
      }
    }
  },
  methods: {
    getDetailData () {
      const urlParams = {
        ipId: this.recordId
      }
      getIpsById(null, urlParams).then(res => {
        let data = res.data
        let obj = {
          ipType: data.ipType + '',
          timeLimitType: data.timeLimitType + '', // 时间限制类型 0 限时  1永久
          ipStart: data.ipStart,
          ipEnd: data.ipEnd,
          isValid: data.isValid ? 1 : 0, // 0 禁用  1启用
          dateRange: [
            moment(utc2localDate(data.beginTime)),
            moment(utc2localDate(data.endTime))
          ]
        }
        this.setDateRange(data.timeLimitType + '')
        this.$nextTick(function () {
          this.addForm.setFieldsValue(obj)
        })
      })
    },
    /**
     * @description: 列表展示 转换字典数据
     * @param dictKey 字典组编码
     * @param idx son数组中位置
     * @return:
     */
    formatFormColumsItem () {
      return [
        {
          title: '名单类型',
          dataIndex: 'ipTypeTransName',
          key: 'ipTypeTransName'
        },
        {
          title: 'IP范围',
          dataIndex: 'ipEnd',
          key: 'ipEnd',
          customRender: (text, record) => {
            const { ipStart, ipEnd } = record
            return `${ipStart}-${ipEnd}`
          }
        },
        {
          title: '时间限制类型',
          dataIndex: 'timeLimitTypeTransName',
          key: 'timeLimitTypeTransName'
        },
        {
          title: '状态',
          dataIndex: 'isValid',
          key: 'isValid',
          scopedSlots: { customRender: 'isValid' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          key: 'createTime',
          customRender: text => {
            return utc2localDate(text)
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    /**
     * @description: 添加统计form表单 临时有效时间范围字段
     * @return:
     */
    addDateRange () {
      const editFormItem = deepClone(this.editFormItem)
      if (this.editFormItem[DATE_RANGE_IDX].decorator[0] !== 'dateRange') {
        editFormItem.splice(DATE_RANGE_IDX, 0, {
          label: '限时时间',
          decorator: [
            'dateRange',
            { rules: [{ required: true, message: '必填项' }] }
          ],
          itemType: 'dateRange',
          showTime: true,
          inlineStyle: 'width: 51%;'
        })
      } else {
        editFormItem[DATE_RANGE_IDX].inlineStyle = 'width: 51%;'
        editFormItem[DATE_RANGE_IDX].decorator.push({
          rules: [{ required: true, message: '必填项' }]
        })
      }
      this.editFormItem = editFormItem
    },
    /**
     * @description: 删除统计form表单 临时有效时间范围字段
     * @param ifLogic 是否逻辑删除 是：true 否：false。如果是逻辑删除，设置属性为display：none，如果否，在表单中remove掉数据
     * @return:
     */
    delDateRange (ifLogic) {
      if (this.editFormItem[DATE_RANGE_IDX].decorator[0] === 'dateRange') {
        const editFormItem = deepClone(this.editFormItem)
        if (ifLogic) {
          editFormItem[DATE_RANGE_IDX].inlineStyle = 'display:none;'
          editFormItem[DATE_RANGE_IDX].decorator.splice(1, 1)
          this.addForm.validateFields(['dateRange'])
        } else {
          editFormItem.splice(DATE_RANGE_IDX, 1)
        }
        this.editFormItem = editFormItem
      }
    },
    setDateRange (res) {
      if (res === LIMIT_TIME) {
        this.addDateRange()
      } else if (res === FOREVER) {
        this.delDateRange(true)
      }
      return res
    },
    reset () {
      this.addForm.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>

</style>
