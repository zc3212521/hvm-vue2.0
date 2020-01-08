<template>
  <div class="user-edit">
    <div class="content-section"
         style="margin-bottom: 16px;padding-bottom: 0;">
      <breadcrumb />
      <a-tabs class="monitor-detail" defaultActiveKey="0" @change="tagChange" v-show="isShow">
        <a-tab-pane tab="Details" key="1">
        </a-tab-pane>
        <a-tab-pane tab="Druid" key="2">
        </a-tab-pane>
        <a-tab-pane tab="Caches" key="3">
        </a-tab-pane>
        <a-tab-pane tab="Metrics" key="4">
        </a-tab-pane>
        <a-tab-pane tab="Threads" key="5">
        </a-tab-pane>
        <a-tab-pane tab="Environment" key="6">
        </a-tab-pane>
        <a-tab-pane tab="Loggers" key="7">
        </a-tab-pane>
        <a-tab-pane tab="Scheduler" key="8">
        </a-tab-pane>
      </a-tabs>
    </div>
    <template v-if="tabKey === '1'">
      <monitor-summary/>
    </template>
    <template v-else-if="tabKey === '2'">
      <druid/>
    </template>
    <template v-else-if="tabKey === '3'">
      <caches/>
    </template>
    <template v-else-if="tabKey === '4'">
      <metrics/>
    </template>
    <template v-else-if="tabKey === '5'">
      <threads/>
    </template>
    <template v-else-if="tabKey === '6'">
      <environment/>
    </template>
    <template v-else-if="tabKey === '7'">
      <loggers/>
    </template>
    <template v-else-if="tabKey === '8'">
      <scheduler/>
    </template>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import MonitorSummary from './monitorSummary'
import Metrics from './metrics'
import Druid from './druid'
import Caches from './caches'
import Scheduler from './scheduler'
import Threads from './threads'
import Environment from './environment'
import Loggers from './loggers'
import { getSysGlobalInstanceHealth } from '@/http/system'

export default {
  name: 'monitor',
  components: { Breadcrumb, Metrics, Druid, Caches, Scheduler, Threads, Environment, Loggers, MonitorSummary },
  data () {
    return {
      tabKey: '0',
      isShow: false,
      msg: ''
    }
  },
  created () {
    this.getHealth()
  },
  methods: {
    getHealth () {
      let params = {
        instIp: this.$route.query.ip,
        instPort: this.$route.query.port,
        instCtx: this.$route.query.ctx
      }
      getSysGlobalInstanceHealth(params, null).then(
        res => {
          if (res.data.code === 99998 || res.data.code === 99999) {
            this.$message.error(res.data.msg)
            this.msg = res.data.msg
            this.isShow = false
          } else {
            this.msg = ''
            this.isShow = true
            this.tabKey = '1'
          }
        }
      )
    },
    tagChange (key) {
      this.tabKey = key
    }
  }
}
</script>

<style lang="less" scoped>
  .err-msg{
    color:red;
    font-size:x-large;
    text-align: center
  }

  .top-section {
    &:after {
      content: "";
      display: block;
      clear: both;
      margin-bottom: 20px;
    }

    .right {
      float: right;

      button {
        margin-right: 20px;
      }
    }
  }

  .title {
    height: 28px;
    line-height: 28px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    display: inline-block;
    width: 50%;
  }

  .monitor-detail /deep/ .ant-tabs-bar {
    margin: 0;
  }

  .monitor-edit /deep/ .section-title {
    height: 24px;
    line-height: 24px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 16px;
    margin-bottom: 20px;
  }
</style>
