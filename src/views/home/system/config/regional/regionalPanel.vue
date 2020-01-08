<!-- organizationPanel -->
<template>
  <div>
    <common-tree :init-tree-data="treeData"
                 childrenProps="childrenNode"
                 keyProps="id"
                 titleProps="orgName"></common-tree>
  </div>
</template>

<script>

import CommonTree from '@/components/base/CommonTree.vue'
const treeData = [
  {
    createTime: 'laborum non velit ad occaecat',
    createUserName: null,
    isDelete: false,
    isFinal: true,
    modifyUserName: null,
    modifyTime: null,
    tenantId: 60145574.02283856,
    orgId: 71398086.4034962,
    orgName: 'aliquip adipisicing exercitation',
    orgFullName: 'anim rep',
    parentId: 68146935.04728502,
    orgDesc: 'anim velit reprehenderit',
    id: 90794246.26492974,
    childrenNode: [
      {
        createTime: 'proident',
        createUserName: null,
        isDelete: true,
        isFinal: true,
        modifyUserName: null,
        modifyTime: 'sed exercitation elit minim id',
        tenantId: 17434169.290791333,
        orgId: 82488885.2723718,
        orgName: 'eiusmod aute',
        orgFullName: 'et velit',
        parentId: 92258890.17194474,
        orgDesc: 'incididunt',
        id: -78406663.86405295,
        childrenNode: null
      },
      {
        createTime: 'esse',
        createUserName: null,
        isDelete: true,
        isFinal: false,
        modifyUserName: null,
        modifyTime: 'Duis sint Ut',
        tenantId: -51462705.0529616,
        orgId: -61440859.5777169,
        orgName: 'deserunt mollit',
        orgFullName: 'aute',
        parentId: -48848974.24474599,
        orgDesc: 'amet in dolo',
        id: 65520438.125324935,
        childrenNode: null
      },
      {
        createTime: 'eu labore dolor in',
        createUserName: null,
        isDelete: false,
        isFinal: false,
        modifyUserName: null,
        modifyTime: 'eiusmod',
        tenantId: 92098635.70569739,
        orgId: 59023030.556043,
        orgName: 'adipis',
        orgFullName: 'in adipisicing',
        parentId: 20277194.444449887,
        orgDesc: 'sit fugiat non',
        id: 34426473.01479006,
        childrenNode: null
      },
      {
        createTime: 'in cupidatat veniam',
        createUserName: null,
        isDelete: false,
        isFinal: false,
        modifyUserName: null,
        modifyTime: 'enim est Duis in occaecat',
        tenantId: -13242354.98387973,
        orgId: -12553801.280755833,
        orgName: 'quis deserunt esse irure ullamco',
        orgFullName: 'pariatur do id',
        parentId: 71145562.9664841,
        orgDesc: 'occaecat',
        id: -48505510.881305456,
        childrenNode: null
      }
    ]
  },
  {
    createTime: 'reprehenderit sint et enim cillum',
    createUserName: null,
    isDelete: false,
    isFinal: true,
    modifyUserName: null,
    modifyTime: null,
    tenantId: 49235438.54143754,
    orgId: -27799221.117048666,
    orgName: 'est',
    orgFullName: 'dolor est labore sed occaecat',
    parentId: 91079883.93214393,
    orgDesc: 'elit ea',
    id: -78463103.24806507,
    childrenNode: [
      {
        createTime: 'anim',
        createUserName: null,
        isDelete: false,
        isFinal: false,
        modifyUserName: null,
        modifyTime: 'minim',
        tenantId: 10743671.868690312,
        orgId: -94250710.2878908,
        orgName: 'in incididunt',
        orgFullName: 'in deserunt in',
        parentId: 52974337.654234916,
        orgDesc: 'eu ex aliquip do',
        id: -1467024.87826173,
        childrenNode: null
      }
    ]
  },
  {
    createTime: 'eu irure v',
    createUserName: null,
    isDelete: true,
    isFinal: false,
    modifyUserName: null,
    modifyTime: null,
    tenantId: 60395670.7690402,
    orgId: 3028371.492919296,
    orgName: 'eiusmod ut do',
    orgFullName: 'velit in sit ea nisi',
    parentId: -35303248.6819592,
    orgDesc: '',
    id: -60958194.07649836,
    childrenNode: [
      {
        createTime: 'sed',
        createUserName: null,
        isDelete: false,
        isFinal: true,
        modifyUserName: null,
        modifyTime: 'Lorem nulla reprehenderit voluptate',
        tenantId: -62076563.661064774,
        orgId: 63655745.20245358,
        orgName: 'ut labore eiusmod ',
        orgFullName: 'proident commodo',
        parentId: -45501552.38595317,
        orgDesc: 'voluptate reprehenderit',
        id: 1156444.163365841,
        childrenNode: null
      },
      {
        createTime: 'ullamco aliquip officia minim',
        createUserName: null,
        isDelete: true,
        isFinal: false,
        modifyUserName: null,
        modifyTime: 'occaecat Excepteur',
        tenantId: -65427589.58908506,
        orgId: -43607829.6098426,
        orgName: 'dolore dolor',
        orgFullName: 'minim in sunt',
        parentId: -89015164.5850529,
        orgDesc: 'elit Lorem veniam commodo',
        id: 98961641.77776554,
        childrenNode: null
      },
      {
        createUserName: null,
        isDelete: true,
        isFinal: true,
        modifyUserName: null,
        modifyTime: 'ad Ut anim qui',
        tenantId: -49286569.49662815,
        orgId: -90380029.32587919,
        orgName: 'mollit d',
        orgFullName: 'magna qui ut non',
        parentId: 18943170.457735687,
        orgDesc: 'deserun',
        id: 5311031.037580922,
        childrenNode: null
      },
      {
        createTime: 'minim est proident quis',
        createUserName: null,
        isDelete: true,
        isFinal: true,
        modifyUserName: null,
        modifyTime: 'officia',
        tenantId: 95058227.0392626,
        orgId: -76610652.50079498,
        orgName: 'proident Excepteur',
        orgFullName: 'eiusmod nostrud sit',
        parentId: -44181027.78879027,
        orgDesc: 'ut quis velit ad',
        id: 94814725.13532066,
        childrenNode: null
      }
    ]
  }
]
export default {
  name: 'organizationPanel',

  mixins: [],

  components: {
    CommonTree
  },

  props: {},

  data () {
    return {
      treeData
    }
  },
  computed: {},

  watch: {},

  created () { },

  mounted () { },

  destroyed () { },

  methods: {}
}

</script>
<style lang='less' scoped>
</style>
