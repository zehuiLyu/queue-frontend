<template>
    <div>
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-form-model-item required prop="username">
          <a-input v-model="model.username" size="large" placeholder="Please input your username / e.g. anna">
            <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-model-item>
        <a-form-model-item required prop="password">
          <a-input v-model="model.password" size="large" type="password" autocomplete="false" placeholder="Please input your password / 123456">
            <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
          </a-input>
        </a-form-model-item>
      </a-form-model>
    </div>
</template>

<script>
  import { getAction } from '@/api/manage'
  import Vue from 'vue'
  import { mapActions } from 'vuex'

  export default {
    name: 'LoginAccount',
    data(){
      return {
        requestCodeSuccess: false,
        randCodeImage: '',
        currdatetime: '',
        loginType: 0,
        model:{
          username: '',
          password: '',
          inputCode: ''
        },
        validatorRules:{
          username: [
            { required: true, message: 'Please input your username!' },
            { validator: this.handleUsernameOrEmail }
          ],
          password: [{
            required: true, message: 'Please input your password!', validator: 'click'
          }],
          inputCode: [{
            required: true, message: 'Please Enter Verify Code!'
          }]
        }

      }
    },
    created() {
      // this.handleChangeCheckCode();
    },
    methods:{
      ...mapActions(['Login']),
      // Determining the Login Type 判断登录类型
      handleUsernameOrEmail (rule, value, callback) {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          this.loginType = 0
        } else {
          this.loginType = 1
        }
        callback()
      },
      /**
       * verify in field
       * @param arr
       * @param callback
       */
      validateFields(arr, callback){
        let promiseArray = []
        for(let item of arr){
          let p = new Promise((resolve, reject) => {
            this.$refs['form'].validateField(item, (err)=>{
              if(!err){
                resolve();
              }else{
                reject(err);
              }
            })
          });
          promiseArray.push(p)
        }
        Promise.all(promiseArray).then(()=>{
          callback()
        }).catch(err=>{
          callback(err)
        })
      },
      acceptUsername(username){
        this.model['username'] = username
      },
      //Account and Password Login
      handleLogin(loginType){
        this.validateFields([ 'username', 'password' ], (err)=>{
          if(!err){
            let loginParams = {
              username: this.model.username,
              password: this.model.password,
              type: loginType,
            }
            console.log("login parameter", loginParams)
            this.Login(loginParams).then((res) => {
              this.$emit('success', res.result)
            }).catch((err) => {
              this.$emit('fail', err)
            });
          }else{
            this.$emit('validateFail')
          }
        })
      }


    }

  }
</script>

<style scoped>

</style>