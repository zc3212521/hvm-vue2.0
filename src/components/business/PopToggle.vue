<!--弹框跟抽屉转换组件-->

<!--可将抽屉组件展示为弹窗-->

<!--入参：
  title: 标题
  width: 宽度，默认720，在为抽屉组件时有效
  visible: 是否显示弹窗
  show-footer: 是否显示底部确认，取消按钮，默认true-->

<!--slot:
  content 内容slot，注意：当content为a-form表单时，整个表单必须封装成一个单独的组件由外部引入，否则form表单注册不成功
  footer: 自定义的底部按钮slot,当且仅当 入参 show-footer 为 true 时有效-->

<!--回调：
  ok: 点击确认按钮触发的事件
  close: 点击取消按钮触发的事件-->

<!--用例：
<pop-toggle
  title="标题"
  @close="onClose"
  :visible="visible"
  width="280"
>
  <template #content>
    <p>我是弹框内容</p>
  </template>
  <template #footer>
    <a-button @click="onClose" type="primary">关闭</a-button> // 自定义底部按钮，省略默认展示 确认跟取消两个按钮
  </template>
</pop-toggle>
-->
<template>
  <div class="pop-toggle-wrap">
    <template v-if="type === 'drawer'">
      <a-drawer
        :width="width"
        :title="title"
        wrapClassName="custom-add-drawer"
        placement="right"
        :closable="false"
        @close="onClose"
        @ok="onOk"
        :visible="visible"
      >
        <slot name="content"></slot>
        <template v-if="showFooter">
          <div
            :style="{
                position: 'absolute',
                left: 0,
                bottom: '15px',
                width: '100%',
                textAlign: 'center'
              }"
          >
            <slot name="footer">
              <a-button :style="{marginRight: '8px'}" @click="onClose">取消</a-button>
              <a-button @click="onOk" type="primary" html-type="submit">确定</a-button>
            </slot>
          </div>
        </template>
      </a-drawer>
    </template>
    <template v-if="type === 'window'">
      <template>
        <a-modal
          :title="title"
          :visible="visible"
          @ok="onOk"
          @cancel="onClose"
          :width="800"
          :class="showFooter ? '' : 'custom-modal'"
        >
          <slot name="content"></slot>
          <template v-if="!showFooter">
            <template slot="footer">{{ null }}</template>
          </template>
          <template v-else>
            <slot slot="footer">
              <slot name="footer">
                <a-button key="back" @click="onClose">取消</a-button>
                <a-button key="submit" @click="onOk" type="primary" html-type="submit">确定</a-button>
              </slot>
            </slot>
          </template>
        </a-modal>
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PopToggle',
  props: {
    title: {
      type: String,
      default: '标题'
    },
    visible: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '720'
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  computed: mapState({
    type: state => state.frontSettings.popType
  }),
  methods: {
    onClose () {
      this.$emit('close')
    },
    onOk () {
      this.$emit('ok')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
