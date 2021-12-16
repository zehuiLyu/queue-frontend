import Vue from 'vue'
import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar   进度条组件
import 'nprogress/nprogress.css' // progress bar style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN, INDEX_MAIN_PAGE_PATH, OAUTH2_LOGIN_PAGE_PATH } from '@/store/mutation-types'
import { generateIndexRouter, isOAuth2AppEnv } from '@/utils/util'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/user/login', '/index', '/user/register', '/user/register-result', '/user/alteration'] // no redirect whitelist
whiteList.push(OAUTH2_LOGIN_PAGE_PATH)

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // debugger
  //
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/service/custom') {
      next()
      NProgress.done()
    } else if (to.path === '/service/windows') {
      next()
    } else {
      var loginResult = store.getters.userInfo

      if (loginResult.type == 1) {
        next({ path: '/service/custom' })
      } else {
        next({ path: '/service/windows' })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // In the login free whitelist, if you enter the login page and are currently in the OAuth2app environment, enter the OAuth2 login page
      if (to.path === '/user/login' && isOAuth2AppEnv()) {
        next({ path: OAUTH2_LOGIN_PAGE_PATH })
      } else {
        // 在免登录白名单，直接进入
        next()
      }
      NProgress.done()
    } else {
      // If you are currently in the OAuth2APP environment, jump to the OAuth2 login page
      let path = isOAuth2AppEnv() ? OAUTH2_LOGIN_PAGE_PATH : '/index'
      next({ path: path, query: { redirect: to.fullPath } })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
