<template>
  <div>
    <div class="content-section mb16">
      <p class="section-title">基础信息</p>
      <a-form :form="baseDataForm">
        <a-form-item label="角色名称"
                     :label-col="{ span: 2 }"
                     :wrapper-col="{ span: 7 }">
          <a-input v-decorator="[
                        'roleName',
                        { rules: [{ required: true, message: '请输入角色名称' },{min: 2,max: 32, message: '角色名称长度必须在2~32之间'},{ validator: firstSpaceValidator, message: '首位不可以是空格'}]}
                    ]"
                   :read-only="isDetailPage"
                   placeholder="请输入角色名称" />
        </a-form-item>

        <a-form-item label="备注"
                     :label-col="{ span: 2 }"
                     :wrapper-col="{ span: 14}">
          <a-textarea placeholder="请输入备注"
                      :read-only="isDetailPage"
                      :rows="4"
                      v-decorator="[
                          'description'
                        ]" />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 16, offset: 2}"
                     v-if="!isDetailPage">
          <a-button :style="{marginRight: '8px'}" @click="handleCancel">取消</a-button>
          <a-button type="primary"
                    style="margin-right:20px;"
                    @click="submit">确定</a-button>
        </a-form-item>
        <div>

        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { getRoleById, updateRoleById } from '@/http/system'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'roleDetail',
  components: {},
  data () {
    return {
      baseDataForm: this.$form.createForm(this),
      data: {},
      roleId: this.$route.query.id
    }
  },
  created () {

  },
  computed: {
    /**
     * @description: 判读是详情页还是编辑页
     * @param {type}
     * @return:
     */
    isDetailPage () {
      return this.$route.query.isDetailPage === '1'
    }
  },
  mounted () {
    this.getRoleById()
  },
  methods: {
    /**
     * @description: 获取用户基本信息
     * @param {type}
     * @return:
     */
    getRoleById () {
      let urlParams = {
        roleId: this.roleId
      }
      getRoleById(null, urlParams).then(
        res => {
          const { roleName, description } = res.data
          const form = { roleName: roleName, description: description }
          this.$emit('update-userInfo', form)
          this.initForm(form)
        }
      )
    },
    /**
     * @description: 赋值
     * @param {Object} form
     * @return:
     */
    initForm (form) {
      this.baseDataForm.setFieldsValue(form)
    },
    /**
     * @description: 更新数据
     * @param {Object}  values
     * @return:
     */
    updateRoleById (values) {
      const urlParams = {
        roleId: this.roleId
      }
      const params = {
        ...urlParams,
        ...values
      }
      updateRoleById(params, urlParams).then(
        res => {
          this.$emit('update-userInfo', params)
          this.$message.success(messagePrompt.modifySuccess)
          // 跳转至列表页
          this.$router.push(
            {
              name: 'system_auth_role_list'
            }
          )
        }
      )
    },
    /**
     * @description: 校验
     * @param {type}
     * @return:
     */
    submit () {
      this.baseDataForm.validateFields((err, values) => {
        if (!err) {
          this.updateRoleById(values)
        }
      })
    },
    handleCancel (e) {
      // 跳转至列表页
      this.$router.push(
        {
          name: 'system_auth_role_list'
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
</style>
