<template>
  <a-locale-provider :locale="zh_CN">
    <div id="app">
      <div class="load" v-if="loading">
        <a-spin tip="Loading..." :spinning="true" wrapperClassName="load"></a-spin>
      </div>
      <router-view/>
    </div>
  </a-locale-provider>
</template>

<script>
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN' // eslint-disable-line
import { mapState } from 'vuex'

export default {
  name: 'app',
  data () {
    return {
      zh_CN
    }
  },
  created () {
    const layoutMode = this.$store.state.layoutMode
    localStorage.setItem('layoutMode', layoutMode)
  },
  computed: mapState({
    menu: state => state.permission.userMenu,
    loading: state => state.globalLoading
  })
}
</script>

<style lang="less">
  @import "./assets/css/common.less";

  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    min-width: 1300px;
    overflow: auto;

    & > .ant-spin-nested-loading {
      height: 100%;

      & > .ant-spin-container {
        height: 100%;
      }
    }

    .load {
      z-index: 1500;
      text-align: center;
      position: fixed;
      transform: translateZ(0);
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      padding-top: 20%;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  #nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: blue;
      }
    }
  }

  .mbx-wrap {
    padding: 10px 0;
    overflow: hidden;
    clear: both;
    background: #fff;

    .ant-breadcrumb {
      margin-bottom: 0 !important;
    }
  }

  //弹层按钮居中
  .ant-modal-footer {
    text-align: center !important;
  }

  .ant-modal-footer div {
    text-align: center !important;
  }

  // 增加面包屑
  .add-bread {
    color: #999;
  }
  // tag标签 鼠标移入时 鼠标显示默认
  .reset-ant-tag .ant-tag {
    cursor: default !important;
  }
  // 职位管理样式重置
  .collapse-wrap{
    .ant-collapse{
      background: none;
    }
    .ant-collapse > .ant-collapse-item{
      border: none;
    }
    .ant-collapse-content{
      border: none;
    }
    .ant-collapse > .ant-collapse-item > .ant-collapse-header{
      padding: 12px 0 12px 36px;
    }
    .position{
      .right{
        span:last-child{
          margin-left: 6px;
        }
      }
    }
    .collapse-panel-header{
      .right{
        span:last-child{
          margin-left: 6px;
        }
      }
    }
  }
</style>
