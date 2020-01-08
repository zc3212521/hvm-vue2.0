<template>
  <div class="auth-distribute">
    <div class="content-section" style="margin-bottom: 16px;padding-bottom: 0;">
      <breadcrumb  />
      <span class="add-bread">/&nbsp;&nbsp;{{$route.query.name}}</span>
      <a-tabs class="distribute-detail" defaultActiveKey="1" @change="callback">
        <a-tab-pane tab="授予租户" key="1" />
      </a-tabs>
    </div>
    <template v-if="tabKey === '1'">
      <div>
        <div>
          <distribute-to-tenants />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import Breadcrumb from '@/components/base/Breadcrumb.vue'
import DistributeToTenants from './tenants'
export default {
  name: 'distribution',
  components: {
    Breadcrumb,
    DistributeToTenants
  },
  data () {
    return {
      tabKey: '1'
    }
  },
  created () {
  },
  methods: {
    callback (key) {
      this.tabKey = key
    }
  }
}
</script>

<style lang="less" scoped>
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
.distribute-detail /deep/ .ant-tabs-bar {
  margin: 0;
}
.distribute-detail /deep/ .section-title {
  height: 24px;
  line-height: 24px;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  margin-bottom: 20px;
}
</style>
