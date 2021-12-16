<template>
  <div class="main">
    <a-form-model class="user-layout-login" @keyup.enter.native="handleSubmit">
      <a-tabs :activeKey="customActiveKey" :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"  @change="handleTabClick">
        <a-tab-pane key="tab1" tab="Account and Password Login">
          <login-account ref="alogin" @validateFail="validateFail" @success="requestSuccess" @fail="requestFailed"></login-account>
        </a-tab-pane>

      </a-tabs>

      <a-form-model-item>
        <a-checkbox @change="handleRememberMeChange" default-checked>Automatic Login</a-checkbox>
<!--        <router-link :to="{ name: 'alteration'}" class="forge-password" style="float: right;">-->
<!--          忘记密码-->
<!--        </router-link>-->
        <router-link :to="{ name: 'register', params: {type:this.loginType}}" class="forge-password" style="float: right;margin-right: 10px" >
          Register an account
        </router-link>
      </a-form-model-item>

      <a-form-item style="margin-top:24px">
        <a-button size="large"  type="primary"  htmlType="submit"  class="login-button"  :loading="loginBtn"  @click.stop.prevent="handleSubmit" :disabled="loginBtn">Login
        </a-button>
      </a-form-item>

    </a-form-model>

<!--    <login-select-tenant ref="loginSelect" @success="loginSelectOk"></login-select-tenant>-->

  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN, ENCRYPTED_STRING } from '@/store/mutation-types'
import ThirdLogin from './third/ThirdLogin'
// import LoginSelectTenant from './LoginSelectTenant'
import { getEncryptedString } from '@/utils/encryption/aesEncrypt'
import { timeFix } from '@/utils/util'

import LoginAccount from './LoginAccount'
// import LoginPhone from './LoginPhone'

export default {
    components: {
      // LoginSelectTenant,
      ThirdLogin,
      LoginAccount,
      // LoginPhone
    },
    data () {
      return {
        loginType: null,
        customActiveKey: 'tab1',
        rememberMe: true,
        loginBtn: false,
        requiredTwoStepCaptcha: false,
        stepCaptchaVisible: false,
        encryptedString:{
          key:"",
          iv:"",
        },
      }
    },
    created() {
      this.loginType = this.$route.params.type
      if (!this.loginType) {
        this.$router.push({name: '/index'})
      }
      Vue.ls.remove(ACCESS_TOKEN)
      this.getRouterData();
      this.rememberMe = true
    },
    methods:{
      handleTabClick(key){
        this.customActiveKey = key
      },
      handleRememberMeChange(e){
        this.rememberMe = e.target.checked
      },
      /**跳转到登录页面的参数-账号获取*/
      getRouterData(){
        this.$nextTick(() => {
          let temp = this.$route.params.username || this.$route.query.username || ''
          if (temp) {
            this.$refs.alogin.acceptUsername(temp)
          }
        })
      },

      //Login
      handleSubmit () {
        this.loginBtn = true;

        if (this.customActiveKey === 'tab1') {
          // Log in using the account password
          this.$refs.alogin.handleLogin(this.loginType)
        } else {
          //Login by Mobile Number
          this.$refs.plogin.handleLogin(this.loginType)
        }
      },
      // Check failure
      validateFail(){
        this.loginBtn = false;
      },
      // Login succeeded
      requestSuccess(loginResult){
        debugger
        this.loginSuccess(loginResult)
      },
      //Login failure
      requestFailed (err) {
       this.$notification[ 'error' ]({
          message: 'Login failed',
          description: 'Login failed',
          duration: 4,
        });

        this.loginBtn = false;
      },
      loginSelectOk(){
        this.loginSuccess()
      },
      //login successfully
      loginSuccess (loginResult) {
        if (loginResult.type == 1) {
          this.$router.push({ path: '/service/custom' }).catch(() => {
            console.log('Login jump home page error, where this error from')
          })
        } else {
          this.$router.push({ path: '/service/windows' }).catch(() => {
            console.log('Login jump home page error, where this error from')
          })
        }

        this.$notification.success({
          message: 'Welcome',
          description: `${timeFix()}，Welcome Back`,
        });
      },

      stepCaptchaSuccess () {
        this.loginSuccess()
      },
      stepCaptchaCancel () {
        this.Logout().then(() => {
          this.loginBtn = false
          this.stepCaptchaVisible = false
        })
      },
      //Obtain password encryption rules 获取密码加密规则
      getEncrypte(){
        var encryptedString = Vue.ls.get(ENCRYPTED_STRING);
        if(encryptedString == null){
          getEncryptedString().then((data) => {
            this.encryptedString = data
          });
        }else{
          this.encryptedString = encryptedString;
        }
      }

    }

  }
</script>
<style lang="less" scoped>
  .user-layout-login {
    label {
      font-size: 14px;
    }
  .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

  .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

  .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

    .item-icon {
        font-size: 24px;
        color: rgba(0,0,0,.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color .3s;

      &:hover {
          color: #1890ff;
        }
      }

    .register {
        float: right;
      }
    }
  }
</style>
<style>
  .valid-error .ant-select-selection__placeholder{
    color: #f5222d;
  }
</style>