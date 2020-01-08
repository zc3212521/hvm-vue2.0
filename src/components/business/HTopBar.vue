<!--基础表单筛选组件-->
<!--入参:
  canFlod 是否有展开收起功能 true/false, 默认为 true
  disabled 是否禁用 查询,重置 按钮 true/false, 默认为 false -->
<!--点击 查询 触发 handleSearch 方法；-->
<!--点击 重置 触发 handleReset 方法；-->
<!--点击 展开收起 触发 toggleFlod 方法，方法接收展开收起 flod 参数-->
<!--用例：
<h-top-bar
  @handleSearch="handleSubmit"
  @handleReset="handleReset"
  @toggleFlod="toggleFlod"
  :canFlod="false" // 可选
  :disabled="true" // 可选
>
  <a-form :form="form">
    <a-row :gutter="24">
      <a-col
        :span="12"
      >
        <a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
          <a-input />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</h-top-bar>
-->
<template>
  <div class="headerContainer" :class="{ flod }">
    <div :class="[flod ? 'topbar-left-flod': '']">
      <slot></slot>
    </div>
    <div :class="[flod ? 'topbar-right-flod': 'topbar-right']">
      <a-button
        type="primary"
        html-type="submit"
        @click="handleSearch"
        :disabled="disabled"
      >
        查询
      </a-button>
      <a-button
        :style="{ margin: '0 8px' }"
        @click="handleReset"
        :disabled="disabled"
      >
        重置
      </a-button>
      <a
        href="javascript:;"
        v-if="canFlod"
        @click="switchFlod"
        style="text-decoration:none;"
      >
        <template v-if="flod">
          展开 <a-icon type="down" />
        </template>
        <template v-else>
          收起 <a-icon type="up" />
        </template>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HTopBar',
  props: {
    canFlod: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      flod: true
    }
  },
  methods: {
    handleSearch (e) {
      e.preventDefault()
      this.$emit('handleSearch')
    },
    handleReset (e) {
      e.preventDefault()
      this.$emit('handleReset')
    },
    switchFlod () {
      this.flod = !this.flod
      this.$emit('toggleFlod', this.flod)
    }
  }
}
</script>

<style lang="less" scoped>
  .headerContainer {
    background-color: #fff;
    padding: 20px 24px;
    position: relative;
    transition: height.3s;
    margin-bottom: 16px;

    &.flod {
      height: 76px;
      overflow: hidden;
      .topbar-right-flod {
        position: absolute;
        right: 24px;
        top: 20px;
        height: 39px;
        line-height: 39px;
        vertical-align: bottom;
      }
      .topbar-left-flod {
        margin-right: 200px;
      }
    }
    .topbar-right {
      position: relative;
      height: 39px;
      line-height: 39px;
      /*margin-bottom: 10px;*/
      float: right;
    }
    .my-icon {
      &:hover {
        color: #1890ff;
      }

      cursor: pointer;
      font-size: 20px;
      color: #666;
    }
    &:after {
      content: ' ';
      display: block;
      clear: both;
    }
  }
</style>
