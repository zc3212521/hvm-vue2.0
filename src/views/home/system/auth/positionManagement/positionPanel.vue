<!-- positionPanel -->
<template>
  <div class="left-content">
    <div class="top-bar">
      <permission code="system_auth_staff_addGroups">
        <a-button
          type="primary"
          style="margin-right: 20px;"
          @click="showDrawer"
        >
          新增职位组
        </a-button>
      </permission>
      <permission code="system_auth_staff_addPosition">
        <a-button
          type="primary"
          @click="positionShowDrawer"
        >
          新增职位
        </a-button>
      </permission>
    </div>
    <div class="collapse-wrap">
      <a-collapse activeKey="1">
        <div
          v-if="positionTreeData.length == 0"
          class="kong-wrap"
        >
          暂无数据
        </div>
        <a-collapse-panel
          :key="item.id"
          v-for="item in positionTreeData"
        >
          <!-- 自定义面板 -->
          <template slot="header">
            <div class="collapse-panel-header">
              <div class="title">
                {{item.groupName}}
              </div>

              <div class="right">
                <permission code="system_auth_staff_editGroup">
                  <a-icon
                    type="edit"
                    @click.stop="editPositionGroup(item)"
                  />
                </permission>
                <permission v-if="!item.positionList" code="system_auth_staff_delGroup">
                  <a-popconfirm
                    title="确定删除吗？"
                    placement="top"
                    @confirm="deletePositionGroup(item.id)"
                    @cancel="cancel"
                    okText="确定"
                    cancelText="取消"
                  >
                    <a-icon
                      type="delete"
                      v-if="!item.positionList"
                    />
                  </a-popconfirm>
                </permission>
              </div>
            </div>
          </template>

          <div
            class="position"
            v-for="j in item.positionList"
            :key="j.id"
          >
            <div
              class="item"
              @click="handleClickPosition(j)"
              :class="{active:activePosition===j.id}"
            >
              <div class="name">
                {{j.positionName}}
              </div>

              <div
                class="right"
                @click.stop="stopPro($event)"
              >
                <permission code="system_auth_staff_edit">
                  <a-icon
                    type="edit"
                    @click.stop="editPosition(j)"
                  />
                </permission>
                <permission code="system_auth_staff_delPosition">
                  <a-popconfirm
                    title="确定删除吗？"
                    placement="top"
                    @confirm="deletePosition(j.id)"
                    @cancel="cancel"
                    okText="确定"
                    cancelText="取消"
                  >
                    <a-icon type="delete" />
                  </a-popconfirm>
                </permission>
              </div>
            </div>
          </div>
        </a-collapse-panel>
      </a-collapse>
    </div>
    <!-- 职位组抽屉组件-->
    <pop-toggle
      :title="showTitles[showIndex] + '职位组'"
      width="720"
      @close="onClose"
      @ok="positionGroupSubmit"
      :visible="visible"
    >
      <template #content>
        <add-form-group ref="addFormGroup" :showIndex="showIndex"/>
      </template>
    </pop-toggle>

    <!-- 职位抽屉组件-->
    <pop-toggle
      :title="showTitles[positionShowIndex] + '职位'"
      width="720"
      @close="positionOnClose"
      @ok="positionSubmit"
      :visible="positionVisible"
    >
      <template #content>
        <add-form ref="addForm" :showIndex="positionShowIndex" />
      </template>
    </pop-toggle>

  </div>

</template>

<script>
import Permission from '@/components/business/permission'
import AddFormGroup from './addFormGroup'
import AddForm from './addForm'
import PopToggle from '@/components/business/PopToggle'
import { messagePrompt } from '@/utils/config'
import {
  getPositionGroupTree,
  addPositionGroup,
  deletePositionGroup,
  addPosition,
  deletePosition,
  updatePosition,
  getPostioniTree,
  addPositionGroups,
  updatePositionGroups
} from '@/http/system'

export default {
  name: 'positionPanel',

  mixins: [],

  components: {
    Permission, PopToggle, AddFormGroup, AddForm
  },

  props: {},

  data () {
    return {
      positionTreeData: [],
      positionVisible: false,
      visible: false,
      activePosition: '',
      groupTitle: '新增',
      itemTitle: '新增',
      addPositionGroupForm: this.$form.createForm(this, {}),
      addPositionForm: this.$form.createForm(this, {}),
      editPositionGroupId: '',
      editPositionId: '',
      positionShowIndex: 0,
      showIndex: 0, // 0 新增，1 编辑，2 查看 默认为 '新增'
      showTitles: ['新增', '编辑'] // 0 新增，1 编辑，2 查看 默认为 '新增'
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

  watch: {},

  created () {
    // this.getPositionGroupTree()
    // this.handleDefaultPosition()
    this.getPostioniTreeFn()
  },

  mounted () { },

  destroyed () { },

  methods: {
    /**
     * 阻止事件冒泡
    */
    stopPro (e) { },
    /**
     * 取消删除
    */
    cancel (e) { },
    /**
     * 获取职位组下有哪些职位
    */
    getPostioniTreeFn () {
      getPostioniTree().then(res => {
        this.positionTreeData = res.data
      })
    },
    /**
     * 新增职位组
    */
    addPositionGroups (params) {
      addPositionGroups(params).then(res => {
        if (res.status === 201) {
          this.$message.success(messagePrompt.addSuccess)
          this.visible = false
          this.getPostioniTreeFn()
          this.$nextTick(() => {
            if (this.$refs.addForm) {
              this.$refs.addForm.getPostioniTreeFn()
            }
            this.$refs.addFormGroup.addPositionGroupForm.resetFields()
          })
        }
      })
    },
    /**
     * @description: 点击职位高亮
     * @param {type}
     * @return:
     */
    handleClickPosition (item) {
      const { id, positionName, positionGroupId } = item
      this.activePosition = id
      this.$emit('update-position', { id, positionName, positionGroupId })
    },
    /**
     * @description: 显示新增职位弹窗
     * @param {type}
     * @return:
     */
    positionShowDrawer () {
      this.positionVisible = true
      this.positionShowIndex = 0
    },
    /**
     * @description:显示新增职位组弹窗
     * @param {type}
     * @return:
     */
    showDrawer () {
      this.visible = true
      this.showIndex = 0
      this.$nextTick(() => {
        this.$refs.addFormGroup.addPositionGroupForm.resetFields()
      })
    },
    /**
     * @description: 重置职位组弹窗
     * @param {type}
     * @return:
     */
    clearPositionGroup () {
      if (this.$refs.addFormGroup && this.$refs.addFormGroup.addPositionGroupForm) {
        this.$refs.addFormGroup.addPositionGroupForm.resetFields()
        this.groupTitle = '新增'
        this.editPositionGroupId = ''
      }
    },
    /**
     * @description:  重置职位弹窗
     * @param {type}
     * @return:
     */
    clearPosition () {
      this.$refs.addForm.addPositionForm.resetFields()
      this.itemTitle = '新增'
      this.editPositionId = ''
    },
    /**
     * @description: 关闭新增职位组弹窗
     * @param {type}
     * @return:
     */
    onClose () {
      this.visible = false
      this.clearPositionGroup()
    },
    /**
     * @description: 关闭新增职位弹窗
     * @param {type}
     * @return:
     */
    positionOnClose () {
      this.positionVisible = false
      this.clearPosition()
    },

    /**
     * @description: 编辑职位组
     * @param {Object} item {groupName:"xxxx",id:"1"}
     * @return:
     */
    editPositionGroup (item) {
      this.showDrawer()
      this.groupTitle = '编辑'
      this.showIndex = 1
      this.editPositionGroupId = item.positionGroupId
      const { groupName, groupDesc } = item
      this.$nextTick(() => {
        if (this.$refs.addFormGroup && this.$refs.addFormGroup.addPositionGroupForm) {
          this.$refs.addFormGroup.addPositionGroupForm.setFieldsValue(
            { groupName, groupDesc }
          )
        }
      })
    },
    /**
     * @description: 编辑职位
     * @param {Object} item {positionName:"xxxx",id:"1"}
     * @return:
     */
    editPosition (item) {
      this.positionShowDrawer()
      this.positionShowIndex = 1
      const { positionName, id, positionGroupId } = item
      this.itemTitle = '编辑'
      this.editPositionId = id
      this.$nextTick(() => {
        if (this.$refs.addForm && this.$refs.addForm.addPositionForm) {
          this.$refs.addForm.addPositionForm.setFieldsValue(
            { positionName, positionGroupId }
          )
        }
      })
    },
    /**
     * @description: 新增职位组提交
     * @param {type}
     * @return:
     */
    positionGroupSubmit () {
      this.$refs.addFormGroup.addPositionGroupForm.validateFields((err, values) => {
        if (!err) {
          if (this.showIndex === 1) {
            // 编辑
            this.updatePositionGroup(values)
          } else {
            // 新增
            this.addPositionGroups(values)
          }
        }
      })
    },
    /**
     * @description: 新增职位提交
     * @param {type}
     * @return:
     */
    positionSubmit () {
      this.$refs.addForm.addPositionForm.validateFields((err, values) => {
        if (!err) {
          if (this.positionShowIndex === 1) {
            // 编辑
            this.updatePosition(values)
          } else {
            console.log(values)
            // 新增
            this.addPosition(values)
          }
          // this.positionOnClose()
        }
      })
    },
    /**
     * @description: 获取职位树
     * @param {type}
     * @return:
     */
    getPositionGroupTree () {
      getPositionGroupTree().then(res => {
        this.positionTreeData = res.data || []
        this.handleDefaultPosition()
      })
    },
    /**
     * @description: 设置默认选择的职位 默认第一项
     * @param {type}
     * @return:
     */
    handleDefaultPosition () {
      if (this.positionTreeData && this.positionTreeData.length) {
        const positionDtoList = this.positionTreeData[0].positionDtoList
        if (positionDtoList && positionDtoList.length) {
          const item = positionDtoList[0]
          this.handleClickPosition(item)
        }
      }
    },
    /**
     * @description: 新增职位组
     * @param {type}
     * @return:
     */
    addPositionGroup (value) {
      addPositionGroup(value).then(res => {
        this.getPositionGroupTree()
        this.onClose()
      })
    },
    /**
     * @description: 删除职位组
     * @param {type}
     * @return:
     */
    deletePositionGroup (id) {
      const urlParams = {
        positionGroupId: id
      }
      deletePositionGroup(null, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.getPostioniTreeFn()
        this.$refs.addForm.getPostioniTreeFn()
      })
    },
    /**
     * @description: 更新职位组
     * @param {Object} values
     * @return:
     */
    updatePositionGroup (values) {
      const params = {
        groupName: values.groupName,
        groupDesc: values.groupDesc
      }
      const urlParams = {
        positionGroupId: this.editPositionGroupId
      }
      updatePositionGroups(params, urlParams).then(res => {
        this.$message.success(messagePrompt.modifySuccess)
        this.visible = false
        this.getPostioniTreeFn()
        this.$refs.addForm.getPostioniTreeFn()
      })
    },
    /**
     * @description: 新增职位
     * @param {type}
     * @return:
     */
    addPosition (values) {
      addPosition(values).then(res => {
        this.$message.success(messagePrompt.addSuccess)
        this.positionVisible = false
        this.getPostioniTreeFn()
        this.$refs.addForm.addPositionForm.resetFields()
      })
    },
    /**
     * @description: 删除职位
     * @param {type}
     * @return:
     */
    deletePosition (id) {
      const urlParams = {
        positionId: id
      }
      deletePosition(null, urlParams).then(res => {
        this.$message.success(messagePrompt.delSuccess)
        this.getPostioniTreeFn()
      })
    },
    /**
     * @description: 更新职位
     * @param {type}
     * @return:
     */
    updatePosition (values) {
      const params = {
        ...values
      }
      const urlParams = {
        positionId: this.editPositionId
      }
      updatePosition(params, urlParams).then(res => {
        this.$message.success(messagePrompt.modifySuccess)
        // 向父组件传递修改后的职位名称
        this.$emit('updatePositionName', params)
        this.positionVisible = false
        this.getPostioniTreeFn()
      })
    }
  }
}

</script>
<style lang='less' scoped>
.kong-wrap {
  text-align: center;
  padding-top: 200px;
  background: #fff;
  color: #999;
}
.left-content {
  .top-bar {
    padding-left: 24px;
    margin-bottom: 34px;
  }
  .collapse-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    .right {
      i + i {
        margin-left: 8px;
      }
      i:hover {
        color: #1890ff;
      }
    }
  }
  /deep/ .ant-tabs-ink-bar {
    background-color: #fff;
  }
  /deep/ .ant-tabs-bar {
    width: 100%;
  }
  /deep/ .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
    text-align: left;
    padding-left: 50px;
  }
  /deep/ .ant-collapse-content-box {
    padding: 0;
  }
  /deep/ .ant-collapse {
    border: 0;
  }
  /deep/ .ant-tabs-nav .ant-tabs-tab-active {
    background-color: #e6f7ff;
  }
}
.position {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 40px;
    height: 40px;
    padding-left: 50px;
    padding-right: 20px;
    transition: color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    cursor: pointer;
    text-decoration: none;
    &:hover,
    &:active,
    &.active {
      .name {
        color: #1890ff;
      }
    }
    &.active {
      background-color: #e6f7ff;
    }

    .right {
      i + i {
        margin-left: 8px;
      }
      i:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
