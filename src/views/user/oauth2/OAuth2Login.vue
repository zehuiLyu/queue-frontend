<template>
  <div>
    <div id="loader-wrapper">
      <div id="loader"></div>
      <div class="loader-section section-left"></div>
      <div class="loader-section section-right"></div>
      <div class="load_title">Logging in please wait patiently</div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { isOAuth2AppEnv, timeFix } from '@/utils/util'
import { INDEX_MAIN_PAGE_PATH } from '@/store/mutation-types'

export default {
  name: 'OAuth2Login',
  data() {
    return {
      env: {
        thirdApp: false,
        wxWork: false,
        dingtalk: false,
      },
    }
  },
  beforeCreate() {
    // If you are not currently in an OAuth2APP environment, redirect to the/User /login page
    if (!isOAuth2AppEnv()) {
      this.$router.replace({path: '/user/login'})
    }
  },
  created() {
    this.checkEnv()
    this.doOAuth2Login()
  },
  methods: {
    ...mapActions(['ThirdLogin']),

    /** Detect the current environment */
    checkEnv() {
      // 判断当时是否是企业微信环境
      if (/wxwork/i.test(navigator.userAgent)) {
        this.env.thirdApp = true
        this.env.wxWork = true
      }
      // 判断当时是否是钉钉环境
      if (/dingtalk/i.test(navigator.userAgent)) {
        this.env.thirdApp = true
        this.env.dingtalk = true
      }
    },

    /** Perform OAuth2 login */
    doOAuth2Login() {
      if (this.env.thirdApp) {
        // 判断是否携带了Token，是就说明登录成功
        if (this.$route.query.oauth2LoginToken) {
          this.thirdType = this.$route.query.thirdType
          let token = this.$route.query.oauth2LoginToken
          this.doThirdLogin(token)
        } else if (this.env.wxWork) {
          this.doWechatEnterpriseOAuth2Login()
        } else if (this.env.dingtalk) {
          this.doDingTalkOAuth2Login()
        }
      }
    },

    // Perform login based on token
    doThirdLogin(token) {
      let param = {}
      param.thirdType = this.thirdType
      param.token = token
      this.ThirdLogin(param).then(res => {
        if (res.success) {
          this.loginSuccess()
        } else {
          this.requestFailed(res)
        }
      })
    },
    loginSuccess() {
      // Login successful, redirect to home page
      this.$router.replace({path: INDEX_MAIN_PAGE_PATH})

      this.$notification.success({
        message: 'welcome',
        description: `${timeFix()}，welcome back`,
      })
    },
    requestFailed(err) {
      this.$error({
        title: 'login failure',
        content: ((err.response || {}).data || {}).message || err.message || 'An error occurred. Please try again later',
        okText: 'log in again',
        onOk() {
          window.location.reload()
        },
        onCancel() {
          window.location.reload()
        },
      })
    },


    doWechatEnterpriseOAuth2Login() {
      this.sysOAuth2Login('wechat_enterprise')
    },

    doDingTalkOAuth2Login() {
      this.sysOAuth2Login('dingtalk')
    },

    /** Background structure oauth2 login address */
    sysOAuth2Login(source) {
      let url = `${window._CONFIG['domianURL']}/sys/thirdLogin/oauth2/${source}/login`
      url += `?state=${encodeURIComponent(window.location.origin)}`
      window.location.href = url
    },

  },
}
</script>

<style scoped>

</style>