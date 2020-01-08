<!--文字超出浮层显示
  接收参数：
  text: 需要判定是否溢出隐藏的字符串
  len: 自定义需要超出隐藏的字节数。注意！！因为汉字的宽度一般为其他字符如字母的宽度的2倍，所以这里中文的len长度会计算为2，其他字符的len长度为1。如需定义超出3个汉字的部分隐藏掉，则len为6，-->
<template>
  <span>
    <a-tooltip v-if="showTip">
    <template slot="title">
      {{ text }}
    </template>
    <span class="over-span">{{ showContent }}</span>
  </a-tooltip>
    <span v-else>
      {{ text }}
    </span>
  </span>

</template>
<script>
export default {
  name: 'toolTip',
  props: {
    text: {
      type: String,
      default: ''
    },
    len: {
      type: Number,
      default: 18
    }
  },
  data () {
    return {
      showTip: true,
      showContent: ''
    }
  },
  created () {
    if (!this.text) {
      this.showTip = false
    } else {
      this.showTip = this.text.gblen() > this.len
      this.showContent = this.sliceStr(this.text, this.len) + '...'
    }
  },
  watch: {
    text (val) {
      if (!val) {
        this.showTip = false
      } else {
        this.showTip = val.gblen() > this.len
        this.showContent = this.sliceStr(this.text, this.len) + '...'
      }
    }
  },
  methods: {
    sliceStr (text, len) {
      let result = ''
      let i = 0
      for (let n = 0; n < len; n++) {
        let charCode = text.charCodeAt(i)
        if (charCode > 127 || charCode === 94) n++
        result = result + text.slice(i, i + 1)
        i++
      }
      return result
    }
  }
}
</script>

<style lang="less" scoped>
  .over-span {
    display: inline-block;
    white-space: nowrap;
  }
</style>
