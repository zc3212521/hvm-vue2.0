<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb  /></div>
    <search-form :formOptions="searchFormItem" @onSearch="handleSubmit" @onReset="handleReset"/>
    <div class="content-bottom-section">
      <div class="control-bar">
        <permission code="system_config_ipConfig_add">
          <a-button type="primary" @click="showDrawer">
            <a-icon type="plus" />
            <span>新增</span>
          </a-button>
        </permission>
      </div>
      <a-divider style="margin: 16px 0;" />
      <a-spin class="reset-ant-tag" :spinning="false" style="text-align: center;width: 100%;">
        <a-table
          :columns="columns"
          :dataSource="data"
          :pagination="pagination"
          rowKey="id"
          @change="handleTableChange"
        >
          <template slot="isValid" slot-scope="text, record">
            <a-tag color="green" v-if="record.isValid"><span>启用</span></a-tag>
            <a-tag color="red" v-if="!record.isValid"><span>禁用</span></a-tag>
          </template>
          <template slot="action" slot-scope="text, record">
            <permission code="system_config_ipConfig_edit">
              <a @click="edit(record)" href="javascript:;">编辑</a>

              <a-divider type="vertical" />
            </permission>
            <permission code="system_config_ipConfig_scan">
              <a href="javascript:;" @click="read(record)">查看</a>
              <a-divider type="vertical" />
            </permission>
            <permission code="system_config_ipConfig_del">
              <a-popconfirm
                title="确定删除吗？"
                okText="确定"
                cancelText="取消"
                @confirm="confirmDel(record)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </permission>
          </template>
        </a-table>
      </a-spin>
    </div>

    <!-- 抽屉组件 @ok="handleSubmitConfig"-->
    <pop-toggle
      :title="showTitles[showIndex] + 'IP黑白名单'"
      width="720"
      @close="onClose"
      @ok="handleSubmitConfig"
      :visible="visible"
      :show-footer="showIndex !== 2"
    >
      <template #content>
        <add-form ref="addForm" :showIndex="showIndex" :visible="visible" :recordId="editId"/>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
// 限时
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import Permission from '@/components/business/permission'
import SearchForm from '@/components/business/SearchForm'
import PopToggle from '@/components/business/PopToggle'
import AddForm from './addForm'
import { queryAllIpsPage, deleteIps, updateIps, addIps } from '@/http/system'
import { messagePrompt } from '@/utils/config'
import { utc2localDate, formatFormSelectDictItem, localDate2utc } from '@/utils'
const LIMIT_TIME = '0'
// 永久
const FOREVER = '1'

const searchFormItem = [
  {
    label: '名单类型',
    decorator: ['ipType'],
    itemType: 'select',
    selectOptions: []
  },
  {
    label: '状态',
    decorator: ['isValid'],
    itemType: 'select',
    selectOptions: [
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
export default {
  name: 'ipConfig',
  components: {
    SearchForm,
    Breadcrumb,
    Permission,
    PopToggle,
    AddForm
  },
  data () {
    return {
      flod: true,
      data: [],
      columns: [],
      searchFormItem: [],
      pagination: {},
      selectedRowKeys: [],
      visible: false,
      title: '新增',
      editId: '', // 编辑状态标识
      showIndex: 0, // 0 新增，1 编辑，2 查看 默认为 '新增'
      showTitles: ['新增', '编辑', '查看'] // 0 新增，1 编辑，2 查看 默认为 '新增'
    }
  },
  created () {
    this.searchFormItem = formatFormSelectDictItem(
      searchFormItem,
      'ipType'
    )
    this.columns = this.formatFormColumsItem()
    this.getData()
  },
  mounted () {},

  methods: {
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
          width: 160,
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    /**
     * @description: 显示新增窗口
     * @param {type}
     * @return:
     */
    showDrawer () {
      this.showIndex = 0
      this.visible = true
      this.clearDrawerFrom()
    },
    /**
     * @description: 重置编辑表单
     * @param {type}
     * @return:
     */
    clearDrawerFrom () {
      this.readonly = false
      this.$nextTick(() => {
        if (this.$refs.addForm && this.$refs.addForm.addForm) {
          // 如果有选择时间范围 就把时间范围选项删掉
          this.$refs.addForm.editFormItem.map((item, index) => {
            if (item.itemType === 'dateRange') {
              this.$refs.addForm.editFormItem.splice(index, 1)
            }
          })
          this.$refs.addForm.addForm.resetFields()
        }
      })
    },
    /**
     * @description: 关闭新增编辑窗口
     * @param {type}
     * @return:
     */
    onClose () {
      this.visible = false
      this.editId = ''
    },
    /**
     * @description: 确认删除
     * @param {Object} record
     * @return:
     */
    confirmDel (record) {
      const { id } = record
      this.deleteIps(id)
    },

    /**
     * @description: 查看
     * @param {type}
     * @return:
     */
    read (record) {
      this.visible = true
      this.showIndex = 2
      this.editId = record.id
    },
    /**
     * @description: 跳转详情页或编辑页
     * @param {Number} id    选中的id
     * @return:
     */
    edit (record) {
      this.visible = true
      this.showIndex = 1
      this.editId = record.id
    },

    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getData()
    },

    /**
     * @description: 展开筛选项
     * @param {Boolean} flod
     * @return:
     */
    toggleFlod (flod) {
      this.flod = flod
    },

    /**
     * @description: 筛选
     * @param {type}
     * @return:
     */
    handleSubmit (values) {
      this.searchParams = values
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.getData()
    },

    /**
     * @description:重置筛选
     * @param {type}
     * @return:
     */
    handleReset () {
      // this.$refs.addForm.form.resetFields()
      this.handleSubmit(null)
    },

    /**
     * @description:
     * @param {type}
     * @return:
     */
    handleSubmitConfig () {
      // 查看关闭弹窗
      if (this.readonly) {
        this.onClose()
        return
      }
      // 时间限制为永久的时候删除 临时有效时间
      if (this.$refs.addForm.addForm.getForm().getFieldsValue().timeLimitType === FOREVER) {
        this.$refs.addForm.delDateRange(false)
      }
      this.$refs.addForm.addForm.validateFields((err, values) => {
        if (!err) {
          // 将临时有效时间段转换为开始时间，结束时间字段，并对时间格式进行格式化
          if (values.timeLimitType === LIMIT_TIME) {
            values.beginTime = localDate2utc(values.dateRange[0])
            values.endTime = localDate2utc(values.dateRange[1])
            delete values.dateRange
          } else {
            values.beginTime = null
            values.endTime = null
          }
          if (this.editId) {
            this.updateIps(values)
          } else {
            this.addIps(values)
          }
        }
      })
    },
    /**
     * @description: 创建配置
     * @param {type}
     * @return:
     */
    addIps (params) {
      addIps(params).then(res => {
        this.$message.success(messagePrompt.addSuccess)
        this.getData()
        this.onClose()
      })
    },
    /**
     * @description: 更新配置
     * @param {type}
     * @return:
     */
    updateIps (params) {
      const urlParams = {
        ipId: this.editId
      }
      params = {
        ...params,
        ...urlParams
      }
      updateIps(params, urlParams).then(res => {
        this.$message.success(messagePrompt.modifySuccess)
        this.getData()
        this.onClose()
      })
    },
    /**
     * @description: 删除用户
     * @param {Number} id
     * @return:
     */
    deleteIps (id) {
      const urlParams = {
        ipId: id
      }
      deleteIps(urlParams, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.getData()
      })
    },

    /**
     * @description: 获取所有用户
     * @param {type}
     * @return:
     */
    getData () {
      const pagination = this.pagination
      const params = this.searchParams
      queryAllIpsPage(params, pagination).then(res => {
        this.data = res.data.records
        this.pagination = res.pagination
      })
    }
  }
}
</script>

<style lang="less" scoped>
.control-bar {
  &:after {
    content: '';
    display: block;
    clear: both;
  }
  .bar-right {
    float: right;
    button {
      margin-right: 20px;
    }
  }
}
.action {
  position: absolute;
  right: 80px;
  top: 10px;

  button + button {
    margin-left: 20px;
  }
}
</style>
