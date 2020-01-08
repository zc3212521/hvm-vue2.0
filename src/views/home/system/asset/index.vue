<template>
  <div class="h-content-wrap">
    <div class="mbx-wrap"><breadcrumb  /></div>
    <search-form
      :formOptions="searchFormItem"
      @onSearch="search"
      @onReset="reset"
    />
    <div class="content-bottom-section">
      <a-divider style="margin: 16px 0;" />
      <a-spin :spinning="false" style="text-align: center;width: 100%;">
        <a-table
          :columns="columns"
          :dataSource="data"
          :pagination="pagination"
          rowKey="id"
          @change="handleTableChange"
        >
          <template slot="action" slot-scope="text, record">
            <permission code="system_asset_edit">
              <a @click="edit(record, 'edit')" href="javascript:;">编辑</a>

              <a-divider type="vertical" />
            </permission>
            <permission code="system_asset_download">
              <a
                :href="
                  baseUrl +
                    '/sys/files/' +
                    record.fileId +
                    '/download?security-token=' +
                    token
                "
                >下载</a
              >
            </permission>
          </template>
          <template slot="bizCode" slot-scope="text">
            <Overflow-Tool-Tip :text="text" :len="12"></Overflow-Tool-Tip>
          </template>
          <template slot="bizId" slot-scope="text">
            <Overflow-Tool-Tip :text="text" :len="12"></Overflow-Tool-Tip>
          </template>
          <template slot="subBizId" slot-scope="text">
            <Overflow-Tool-Tip :text="text" :len="12"></Overflow-Tool-Tip>
          </template>
          <template slot="contentDesc" slot-scope="text">
            <Overflow-Tool-Tip :text="text"></Overflow-Tool-Tip>
          </template>
          <template slot="createTime" slot-scope="text, record">
            <Overflow-Tool-Tip :text="record.createTime | dateFilter" :len="10"></Overflow-Tool-Tip>
          </template>
        </a-table>
      </a-spin>
    </div>

    <!-- 抽屉组件-->
    <pop-toggle
      :title="'编辑'"
      width="720"
      @close="onClose"
      @ok="handleSubmitConfig"
      :visible="visible"
    >
      <template #content>
        <add-form ref="addForm"/>
      </template>
    </pop-toggle>
  </div>
</template>

<script>
// import 引入顺序：npm依赖 》 组件 》 方法 》 图片等静态资源
import SearchForm from '@/components/business/SearchForm'
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import Permission from '@/components/business/permission'
import OverflowToolTip from '@/components/business/OverflowToolTip'
import PopToggle from '@/components/business/PopToggle'
import AddForm from './addForm'
import { queryAllSysFile, updateFile } from '@/http/system'
import env from '@/utils/env'
import { getTokenNoBearer } from '@/utils/auth'
import { utc2localDate } from '@/utils'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'asset',
  components: {
    OverflowToolTip,
    Breadcrumb,
    SearchForm,
    Permission,
    PopToggle,
    AddForm
  },
  data () {
    return {
      searchFormItem: [
        {
          itemType: 'input',
          label: '文件名称',
          decorator: ['realName']
        },
        {
          itemType: 'input',
          label: '存储名称',
          decorator: ['fileName']
        },
        {
          itemType: 'input-number',
          label: '业务编号',
          min: 1,
          style: 'width: 100%',
          placeholder: '请输入完整的编号',
          decorator: ['bizId']
        },
        {
          itemType: 'input-number',
          label: '子业务编号',
          min: 1,
          style: 'width: 100%',
          placeholder: '请输入完整的编号',
          decorator: ['subBizId']
        }
      ],
      flod: true,
      data: [],
      columns: [
        {
          title: '存储名称',
          dataIndex: 'fileName',
          key: 'fileName',
          scopedSlots: { customRender: 'contentDesc' }
        },
        {
          title: '文件名称',
          dataIndex: 'realName',
          key: 'realName',
          scopedSlots: { customRender: 'contentDesc' }
        },
        {
          title: '业务编码',
          dataIndex: 'bizCode',
          key: 'bizCode',
          scopedSlots: { customRender: 'bizCode' }
        },
        {
          title: '业务编号',
          dataIndex: 'bizId',
          key: 'bizId',
          scopedSlots: { customRender: 'bizId' }
        },
        {
          title: '子业务编号',
          dataIndex: 'subBizId',
          key: 'subBizId',
          scopedSlots: { customRender: 'subBizId' }
        },
        {
          title: '时间',
          dataIndex: 'createTime',
          key: 'createTime',
          scopedSlots: { customRender: 'createTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          width: 110
        }
      ],
      form: this.$form.createForm(this, {}),
      addForm: this.$form.createForm(this, {}),
      selectedRowKeys: [],
      title: '新增',
      editFormItem: [
        {
          label: '存储名称',
          disabled: 'disabled',
          decorator: [
            'fileName',
            {
              rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }]
            }
          ],
          styleType: 'block'
        },
        {
          label: '文件名称',
          decorator: ['realName', { rules: [{ required: true, message: '必填项' }, { validator: this.firstSpaceValidator, message: '首位不可以是空格' }] }],
          styleType: 'block'
        }
      ],
      fileId: '', // 编辑状态标识
      readonly: false, // 查看状态标识
      visible: false,
      token: getTokenNoBearer(),
      baseUrl: env.baseUrl,
      pagination: {},
      searchParams: null
    }
  },

  created () {
    this.getListData()
  },

  filters: {
    dateFilter: value => utc2localDate(value, 'YYYY-MM-DD HH:mm:ss')
  },

  methods: {
    /**
     * 查询
     */
    search (value) {
      this.searchParams = value
      this.pagination = Object.assign({}, this.pagination, { current: 1 })
      this.getListData()
    },
    /**
     * 重置
     */
    reset () {
      this.search(null)
    },
    /**
     * 获取列表数据
     */
    getListData () {
      let params = this.searchParams
      queryAllSysFile(params, this.pagination)
        .then(res => {
          // 请求200触发
          this.pagination = res.pagination
          this.data = res.data.records
        })
        .catch(error => {
          console.log(error) // 非200触发，无特殊操作可省略
        })
    },
    /**
     * @description: 显示新增窗口
     * @param {type}
     * @return:
     */
    showDrawer () {
      this.visible = true
    },
    /**
     * @description: 重置编辑表单
     * @param {type}
     * @return:
     */
    clearDrawerFrom () {
      this.addForm.resetFields()
      this.title = '新增'
      this.fileId = ''
      this.readonly = false
    },
    /**
     * @description: 关闭新增窗口
     * @param {type}
     * @return:
     */
    onClose () {
      this.visible = false
      this.clearDrawerFrom()
    },

    /**
     * @description: 处理数据
     * @param {type}
     * @return:
     */
    handleEditData (record) {
      const { fileName, realName } = record
      return { fileName, realName }
    },

    /**
     * @description: 跳转详情页或编辑页
     * @param {Number} id    选中的id
     * @return:
     */
    edit (record) {
      this.fileId = record.fileId
      record = this.handleEditData(record)
      this.title = '编辑'
      this.showDrawer()
      this.$nextTick(() => {
        this.$refs.addForm.addForm.setFieldsValue(record)
      })
    },

    /**
     * @description: 点击页码和条数
     * @param {Object} pagination
     * @return:
     */
    handleTableChange (pagination, filters, sorter) {
      this.pagination = pagination
      this.getListData()
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

      this.$refs.addForm.addForm.validateFields((err, values) => {
        if (!err) {
          this.updateFile(values)
        }
      })
    },

    /**
     * @description: 更新资源
     * @param {type}
     * @return:
     */
    updateFile (params) {
      const urlParams = {
        fileId: this.fileId
      }

      params = {
        ...params,
        ...urlParams
      }
      updateFile(params, urlParams).then(res => {
        this.getListData()
        this.onClose()
        this.$message.success(messagePrompt.modifySuccess)
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
