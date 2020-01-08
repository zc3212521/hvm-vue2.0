<template>
  <div class="login-wrap">
    <div id="particles-js"></div>
    <div class="company-logo">
      <img src="~@/assets/images/login_logo.png" alt="">
    </div>
    <div class="login-card">
      <p class="title">鸿冠业务管理系统</p>
      <a-form id="components-form-demo-normal-login" :form="form" class="login-form" @submit="handleSubmit">
        <a-form-item>
          <a-input v-decorator="[ 'username', { rules: [{ required: true, message: '请输入用户名' }] } ]" placeholder="请输入用户名" size="large">
            <img slot="prefix" src="~@/assets/images/login_yonghuming_icon.png" style="width: 24px;" />
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input v-decorator="[ 'password', { rules: [{ required: true, message: '请输入密码' }] } ]" type="password" size="large" placeholder="请输入密码">
            <img slot="prefix" src="~@/assets/images/login_mima_icon.png" style="width: 24px;" />
          </a-input>
        </a-form-item>
        <a-form-item v-if="showCaptcha">
          <a-input v-decorator="[ 'captchaCode', { rules: [{ required: true, message: '请输入验证码' }] } ]" size="large" placeholder="验证码" style="width: 212px;margin-right: 9px;">
            <img slot="prefix" src="~@/assets/images/login_yanzhengma_icon.png" style="width: 24px;"/>
          </a-input>
          <img class="captcha-img" @click="updataCaptcha" :src="captchaImgCode"/>
        </a-form-item>
        <a-form-item>
          <!--
          <a-checkbox v-decorator="[ 'remember', { valuePropName: 'checked', initialValue: true} ]" >
            记住我
          </a-checkbox>
          <a class="login-form-forgot" href="" >
            忘记密码
          </a>
          -->
          <a-button type="primary" html-type="submit" class="login-form-button" size="large" :loading="loading">
            登&nbsp;&nbsp;&nbsp;录
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 修改密码 -->
    <a-modal title="密码修改" v-model="updatePasswordVisible" :closable="false" :keyboard="false" :maskClosable="false" :footer="false">
      <a-alert style="display: inline-block;margin: 0px;font-weight: bold;" message="密码已过期，修改密码后可正常登录！" banner />
      <div class="content-section" style="padding-bottom: 10px;">
        <a-form :form="pwChangeForm" @submit="handlePwChangeSubmit">
          <a-form-item label="新密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="display: inline-block; width: 100%;">
            <a-input v-decorator="[ 'newPassword', { rules: [{ required: true, message: '必填项' }]} ]" type="password" @blur="handleConfirmBlur" placeholder="请输入新密码" />
          </a-form-item>
          <a-form-item label="确认新密码" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" style="display: inline-block; width: 100%;">
            <a-input v-decorator="[ 'confirmPW', { rules: [{ required: true, message: '必填项' }, { validator: compareToFirstPassword }]} ]" type="password" @blur="handleConfirmBlur" placeholder="请确认新密码" />
          </a-form-item>
          <a-form-item :style="{ textAlign: 'right' }">
            <a-button type="primary" html-type="submit">确定</a-button>
          </a-form-item>
        </a-form>
      </div>
      <template slot="title">
        <a-alert style="display: inline-block;margin: 0 20px;font-weight: bold;" message="密码已过期，修改密码后可正常登录！" banner />
      </template>
    </a-modal>
  </div>
</template>

<script>
import particlesJS from 'particlesJS'
import particlesOpt from './particles-app'
import { getLogin, getLoginCaptchaConfig, getLoginCaptchaCode } from '@/http/common'
import { mapActions } from 'vuex'
import { saveToken, encryptionPW } from '@/utils/auth'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { updateExpirePassword } from '@/http/system'
import { messagePrompt } from '@/utils/config'

export default {
  name: 'login',
  components: { AFormItem },
  data () {
    return {
      showCaptcha: false,
      captchaImgCode: '',
      loading: false,
      updatePasswordVisible: false,
      pwChangeForm: this.$form.createForm(this, {}),
      confirmDirty: false,
      captchaId: '' // 验证码ID
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  mounted () {
    particlesJS('particles-js', particlesOpt) // 背景动画

    this.loadCaptcha()
    // 暂时去掉记住密码
    /* let loginData = getRemembePW()
    if (loginData !== undefined) {
      this.form.setFieldsValue({
        'username': loginData.username,
        'password': loginData.password
      })
    } */
  },
  methods: {
    loadCaptcha () {
      getLoginCaptchaConfig().then((res) => {
        // 加载验证码图片
        this.showCaptcha = res.data.captchaEnabled
        if (this.showCaptcha) {
          this.captchaId = res.data.captchaId
          this.updataCaptcha()
        }
      })
    },
    updataCaptcha () { // 点击验证码
      getLoginCaptchaCode({ captchaId: this.captchaId }).then((res) => {
        this.captchaImgCode = res.data.captchaCode
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loading = true
          let originPw = encryptionPW(values.password)
          // let encodePw = encodeURIComponent(originPw)
          let params = {
            username: values.username,
            password: originPw
          }
          if (this.showCaptcha) {
            params.captchaId = this.captchaId
            params.captchaCode = values.captchaCode
          }
          getLogin(params).then((res) => {
            const { token, permitLogin } = res.data
            saveToken(token)
            // 记住密码功能
            /* if (values.remember) {
              rememberPW(values)
            } else {
              deleteRememberPW()
            } */
            if (permitLogin) {
              this.loading = false
              this.$router.push({
                name: 'home'
              })
            } else {
              this.updatePasswordVisible = true
            }
          }).catch(() => {
            this.loading = false
            if (this.showCaptcha) {
              // 每次登陆失败，都重置验证码
              this.form.resetFields(['captchaCode'])
              this.updataCaptcha()
            }
          })
        }
      })
    },
    ...mapActions([
      'getUserId'
    ]),
    compareToFirstPassword (rule, value, callback) {
      if (value && value !== this.pwChangeForm.getFieldValue('newPassword')) {
        callback('两次输入密码不一致！') // eslint-disable-line
      } else {
        callback()
      }
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    handlePwChangeSubmit (e) {
      e.preventDefault()
      this.pwChangeForm.validateFields((err, values) => {
        if (!err) {
          const params = { newPassword: encryptionPW(values.newPassword) }
          updateExpirePassword(params).then(res => {
            window.vm.$message.success(messagePrompt.modifyToIndex)
            this.loading = false
            this.$router.push({
              name: 'home'
            })
          }).catch(res => {
            this.loading = false
            window.vm.$message.error(res.data.detail)
          })
        }
      })
      this.loading = true
    }
  }
}
</script>

<style lang="less" scoped>
  .login-wrap {
    position: relative;
    height: 100%;
    width: 100%;
    min-width: 1200px;
    min-height: 600px;
    background: url(~@/assets/images/login_bg.png) 100% 100%;
    background-size: cover;
    overflow: hidden;
    #particles-js {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
    }
    .title {
      font-size:32px;
      padding: 55px 0 54px;
      margin: 0;
      text-align: center;
      font-weight:400;
      color:rgba(24,145,255,1);
    }
  }
  .company-logo {
    position: absolute;
    top: 44px;
    left: 44px;
    img {
      width: 201px;
      height: 65px;
    }
  }
  .login-card {
    width:480px;
    height:545px;
    background:rgba(255,255,255,1);
    box-shadow:0 4px 6px 0 rgba(0,41,79,0.1);
    border-radius:8px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    margin: 0 auto;
  }
  #components-form-demo-normal-login {
    width: 312px;
    margin: 0 auto;
  }
  #components-form-demo-normal-login .login-form-forgot {
    float: right;
  }
  #components-form-demo-normal-login .login-form-button {
    width: 100%;
    margin-top: 58px;
  }
  .captcha-img {
    width: 90px;
    height: 38px;
    vertical-align: top;
  }
</style>
<style lang="less">
  .login-wrap {
    .ant-input-affix-wrapper .ant-input:not(:first-child) {
      padding-left: 45px;
    }
    .ant-form-item-control {
      line-height: 21px;
    }
    .ant-form-item {
      /*margin-bottom: 16px;*/
    }
  }
</style>
