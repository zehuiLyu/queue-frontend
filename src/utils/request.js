import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import router from '@/router/index'
import { ACCESS_TOKEN, TENANT_ID } from "@/store/mutation-types"

/**
 * 【[Specify axios baseURL]
 * If manually specified baseURL: '/ jeECg-boot '
 * maps the backend domain name through vue.config.js
 * @type {*|string}
 */
let apiBaseUrl = window._CONFIG['domianURL'] || "/jeecg-boot";

//Create an axios instance
const service = axios.create({

  baseURL: apiBaseUrl, // api base_url
  timeout: 9000
})

const err = (error) => {
  if (error.response) {
    let data = error.response.data
    const token = Vue.ls.get(ACCESS_TOKEN)
    console.log("------exceptional response------",token)
    console.log("------exceptional response------",error.response.status)
    switch (error.response.status) {
      case 403:
        Vue.prototype.$Jnotification.error({ message: 'system prompt', description: 'access denied',duration: 4})
        break
      case 500:
        console.log("------error.response------",error.response)

        let type=error.response.request.responseType;
        if(type === 'blob'){
          blobToJson(data);
          break;
        }

        if(token && data.message.includes("Token failure")){

          if (/wxwork|dingtalk/i.test(navigator.userAgent)) {
            Vue.prototype.$Jmessage.loading('Login has expired and you are logging in again', 0)
          } else {
            Vue.prototype.$Jmodal.error({
              title: 'Login expired',
              content: 'Sorry, login has expired, please log in again',
              okText: 'ReLogin',
              mask: false,
              onOk: () => {
                store.dispatch('Logout').then(() => {
                  Vue.ls.remove(ACCESS_TOKEN)
                  try {
                    let path = window.document.location.pathname
                    console.log('location pathname -> ' + path)
                    if (path != '/' && path.indexOf('/user/login') == -1) {
                      window.location.reload()
                    }
                  } catch (e) {
                    window.location.reload()
                  }
                })
              }
            })
          }

        }
        break
      case 404:
          Vue.prototype.$Jnotification.error({ message: 'system prompt', description:'Sorry, resource not found!',duration: 4})
        break
      case 504:
        Vue.prototype.$Jnotification.error({ message: 'system prompt', description: 'Network timeout'})
        break
      case 401:
        Vue.prototype.$Jnotification.error({ message: 'system prompt', description:'Sorry, login has expired, please log in again',duration: 4})
        if (token) {
          store.dispatch('Logout').then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 1500)
          })
        }
        break
      default:
        Vue.prototype.$Jnotification.error({
          message: 'system prompt',
          description: data.message,
          duration: 4
        })
        break
    }
  } else if (error.message) {
    if (error.message.includes('timeout')) {
      Vue.prototype.$Jnotification.error({message: 'system prompt', description: 'Network timeout'})
    } else {
      Vue.prototype.$Jnotification.error({message: 'system prompt', description: error.message})
    }
  }
  return Promise.reject(error)
};

// request interceptor
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers[ 'X-Access-Token' ] = token // Let each request carry a custom token
  }

  const $route = router.currentRoute
  if ($route && $route.name && $route.name.startsWith('low-app') && $route.params.appId) {
    config.headers['X-Low-App-ID'] = $route.params.appId
  }

  let tenantid = Vue.ls.get(TENANT_ID)
  if (!tenantid) {
    tenantid = 0;
  }
  config.headers[ 'tenant-id' ] = tenantid
  if(config.method=='get'){
    if(config.url.indexOf("sys/dict/getDictItems")<0){
      config.params = {
        _t: Date.parse(new Date())/1000,
        ...config.params
      }
    }
  }
  return config
},(error) => {
  return Promise.reject(error)
})

// response interceptor
service.interceptors.response.use((response) => {
    return response.data
  }, err)

const installer = {
  vm: {},
  install (Vue, router = {}) {
    Vue.use(VueAxios, router, service)
  }
}
/**
 * Blob Resolve
 * @param data
 */
function blobToJson(data) {
  let fileReader = new FileReader();
  let token = Vue.ls.get(ACCESS_TOKEN);
  fileReader.onload = function() {
    try {
      let jsonData = JSON.parse(this.result);  // Note It is common object data, and background conversion fails
      console.log("jsonData",jsonData)
      if (jsonData.status === 500) {
        console.log("token----------》",token)
        if(token && jsonData.message.includes("Token失效")){
          Modal.error({
            title: 'Login expired',
            content: 'Sorry, login has expired, please log in again',
            okText: 'ReLogin',
            mask: false,
            onOk: () => {
              store.dispatch('Logout').then(() => {
                Vue.ls.remove(ACCESS_TOKEN)
                window.location.reload()
              })
            }
          })
        }
      }
    } catch (err) {
      // If the object fails to be parsed, the file flow is normal
      console.log("blob resolve file Reader return err",err)
    }
  };
  fileReader.readAsText(data)
}

export {
  installer as VueAxios,
  service as axios
}