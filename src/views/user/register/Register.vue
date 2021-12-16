<template>
  <div class="main user-layout-register">
    <h3><span>Register</span></h3>
    <a-form-model ref="form" :model="model" :rules="validatorRules">
      <a-form-model-item prop="username">
        <a-input v-model="model.username" size="large" type="text" autocomplete="false" placeholder="Please input your username"/>
      </a-form-model-item>

      <a-popover placement="rightTop" trigger="click" :visible="state.passwordLevelChecked">
        <template slot="content">
          <div :style="{ width: '240px' }">
            <div :class="['user-register', passwordLevelClass]">Strength: <span>{{ passwordLevelName }}</span></div>
            <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
            <div style="margin-top: 10px;">
              <span>Please enter at least 8 characters. Do not use passwords that can be easily guessed.</span>
            </div>
          </div>
        </template>
        <a-form-model-item prop="password">
          <a-input
            v-model="model.password"
            size="large"
            type="password"
            @click="handlePasswordInputClick"
            autocomplete="false"
            placeholder="The password must be at least 8 characters and case sensitive">
          </a-input>
        </a-form-model-item>
      </a-popover>

      <a-form-model-item prop="password2">
        <a-input v-model="model.password2" size="large" type="password" autocomplete="false"
                 placeholder="Confirm password"></a-input>
      </a-form-model-item>

      <a-form-model-item>
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="register-button"
          :loading="registerBtn"
          @click.stop.prevent="handleSubmit"
          :disabled="registerBtn">Register
        </a-button>
        <router-link class="login" :to="{ name: 'login' }">Login with existing account</router-link>
      </a-form-model-item>

    </a-form-model>
  </div>
</template>

<script>
  import { mixinDevice } from '@/utils/mixin.js'
  import { getSmsCaptcha } from '@/api/login'
  import { getAction, postAction } from '@/api/manage'
  import { checkOnlyUser } from '@/api/api'
  import Vue from 'vue'
  import { ACCESS_TOKEN, USER_NAME,USER_INFO,USER_AUTH,SYS_BUTTON_AUTH,UI_CACHE_DB_DICT_DATA,TENANT_ID,CACHE_INCLUDED_ROUTES } from "@/store/mutation-types"

  const levelNames = {
    0: 'Low',
    1: 'Low',
    2: 'Middle',
    3: 'Strong'
  }
  const levelClass = {
    0: 'error',
    1: 'error',
    2: 'warning',
    3: 'success'
  }
  const levelColor = {
    0: '#ff0000',
    1: '#ff0000',
    2: '#ff7e05',
    3: '#52c41a'
  }
  export default {
    name: 'Register',
    components: {},
    mixins: [mixinDevice],
    data() {
      return {
        loginType: null,
        model: {},
        validatorRules: {
          username: [
            { required: false },
            { validator: this.checkUsername }
          ],
          password: [
            { required: false },
            { validator: this.handlePasswordLevel }
          ],
          password2: [
            { required: false },
            { validator: this.handlePasswordCheck }
          ],
          mobile: [
            { required: false },
            { validator: this.handlePhoneCheck }
          ],
          captcha: [
            { required: false },
            { validator: this.handleCaptchaCheck }
          ]
        },
        state: {
          time: 60,
          smsSendBtn: false,
          passwordLevel: 0,
          passwordLevelChecked: false,
          percent: 10,
          progressColor: '#FF0000'
        },
        registerBtn: false
      }
    },
    computed: {
      passwordLevelClass() {
        return levelClass[this.state.passwordLevel]
      },
      passwordLevelName() {
        return levelNames[this.state.passwordLevel]
      },
      passwordLevelColor() {
        return levelColor[this.state.passwordLevel]
      }
    },
    created() {
      this.loginType = this.$route.params.type
      if (!this.loginType) {
        this.$router.push({ path: '/user/login' })
      }
    },
    methods: {

      checkUsername(rule, value, callback) {
        if (!value) {
          callback(new Error('Please input username'))
        } else {
          var params = {
            username: value,
            type: this.loginType
          }
          checkOnlyUser(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback('The username already exists!')
            }
          })
        }
      },
      handleEmailCheck(rule, value, callback) {
        let params = {
          email: value
        }
        checkOnlyUser(params).then((res) => {
          if (res.success) {
            callback()
          } else {
            callback('The email has been registered!')
          }
        })
      },
      handlePasswordLevel(rule, value, callback) {
        let level = 0
        let reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/
        if (!reg.test(value)) {
          callback(new Error('At least 8 digits with upper and lower case letters and special symbols!'))
        }
        // 判断这个字符串中有没有数字
        if (/[0-9]/.test(value)) {
          level++
        }
        // 判断字符串中有没有字母
        if (/[a-zA-Z]/.test(value)) {
          level++
        }
        // 判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(value)) {
          level++
        }
        this.state.passwordLevel = level
        this.state.percent = level * 30
        if (level >= 2) {
          if (level >= 3) {
            this.state.percent = 100
          }
          callback()
        } else {
          if (level === 0) {
            this.state.percent = 10
          }
          callback(new Error('Insufficient password strength'))
        }
      },

      handlePasswordCheck(rule, value, callback) {
        let password = this.model['password']
        //console.log('value', value)
        if (value === undefined) {
          callback(new Error('Please input your password'))
        }
        if (value && password && value.trim() !== password.trim()) {
          callback(new Error('The passwords are inconsistent'))
        }
        callback()
      },


      handlePasswordInputClick() {
        if (!this.isMobile()) {
          this.state.passwordLevelChecked = true
          return
        }
        this.state.passwordLevelChecked = false
      },

      handleSubmit() {
        this.$refs['form'].validate((success) => {
          debugger
          if (success == true) {
            let values = this.model

            let data=new FormData();
            data.append("username",values.username)
            data.append("password",values.password)
            data.append("type",this.loginType)

            postAction('/user/register', data).then((res) => {
              if (!res.success) {
                this.registerFailed(res.message)
              } else {
                this.$router.push({ name: 'registerResult', params: { ...values } })

              }
            })
          }
        })
      },

      getCaptcha(e) {
        e.preventDefault()
        let that = this
        this.$refs['form'].validateField(['mobile'], (err) => {
            if (!err) {
              this.state.smsSendBtn = true
              let interval = window.setInterval(() => {
                if (that.state.time-- <= 0) {
                  that.state.time = 60
                  that.state.smsSendBtn = false
                  window.clearInterval(interval)
                }
              }, 1000)
              const hide = this.$message.loading('验证码发送中..', 3)
              const params = {
                mobile: this.model.mobile,
                smsmode: '1'
              }
              postAction('/sys/sms', params).then((res) => {
                if (!res.success) {
                  this.registerFailed(res.message)
                  setTimeout(hide, 0)
                }
                setTimeout(hide, 500)
              }).catch(err => {
                setTimeout(hide, 1)
                clearInterval(interval)
                that.state.time = 60
                that.state.smsSendBtn = false
                this.requestFailed(err)
              })
            }
          }
        )
      },
      registerFailed(message) {
        this.$notification['error']({
          message: 'Register failed',
          description: message,
          duration: 2
        })

      },
      requestFailed(err) {
        this.$notification['error']({
          message: 'Error',
          description: ((err.response || {}).data || {}).message || 'An error occurred. Please try again later',
          duration: 4
        })
        this.registerBtn = false
      }
    },
    watch: {
      'state.passwordLevel'(val) {
        console.log(val)

      }
    }
  }
</script>
<style lang="less">
  .user-register {

    &.error {
      color: #ff0000;
    }

    &.warning {
      color: #ff7e05;
    }

    &.success {
      color: #52c41a;
    }

  }

  .user-layout-register {
    .ant-input-group-addon:first-child {
      background-color: #fff;
    }
  }
</style>
<style lang="less" scoped>
  .user-layout-register {

    & > h3 {
      font-size: 16px;
      margin-bottom: 20px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .register-button {
      width: 50%;
    }

    .login {
      float: right;
      line-height: 40px;
    }
  }
</style>