import Vue from 'vue'
import * as api from '@/api/api'
import { isURL } from '@/utils/validate'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import onlineCommons from '@jeecg/antd-online-mini'

export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? 'Good morning' : (hour <= 11 ? 'Good morning' : (hour <= 13 ? 'Good lunch time' : (hour < 20 ? 'Good afternoon' : 'Good evening')))
}

export function welcome() {
  const arr = ['Let\'s take a break', 'What are you going to eat?', 'would you like a coffee? ', 'I thought you might be tired']
  let index = Math.floor((Math.random()*arr.length))
  return arr[index]
}

/**
 * Trigger window.resize
 */
export function triggerWindowResizeEvent() {
  let event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Filter empty properties of objects
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj == 'object')) {
    return;
  }

  for ( let key in obj) {
    if (obj.hasOwnProperty(key)
      && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * Time formatting
 * @param value
 * @param fmt
 * @returns {*}
 */
export function formatDate(value, fmt) {
  let regPos = /^\d+(\.\d+)?$/;
  if(regPos.test(value)){
    //If it's a number
    let getDate = new Date(value);
    let o = {
      'M+': getDate.getMonth() + 1,
      'd+': getDate.getDate(),
      'h+': getDate.getHours(),
      'm+': getDate.getMinutes(),
      's+': getDate.getSeconds(),
      'q+': Math.floor((getDate.getMonth() + 3) / 3),
      'S': getDate.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (getDate.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
      }
    }
    return fmt;
  }else{

    value = value.trim();
    return value.substr(0,fmt.length);
  }
}

// Generate the home page Route
export function generateIndexRouter(data) {
let indexRouter = [{
          path: '/',
          name: 'dashboard',
          //component: () => import('@/components/layouts/BasicLayout'),
          component: resolve => require(['@/components/layouts/TabLayout'], resolve),
          meta: { title: 'Home Page' },
          redirect: '/dashboard/analysis',
          children: [
            ...generateChildRouters(data)
          ]
        },{
          "path": "*", "redirect": "/404", "hidden": true
        }]
  return indexRouter;
}

// Generate nested routine routing (child routing)

function  generateChildRouters (data) {
  const routers = [];
  for (let item of data) {
    let component = "";
    if(item.component.indexOf("layouts")>=0){
       component = "components/"+item.component;
    }else{
       component = "views/"+item.component;
    }

    // eslint-disable-next-line
    let URL = (item.meta.url|| '').replace(/{{([^}}]+)?}}/g, (s1, s2) => eval(s2))
    if (isURL(URL)) {
      item.meta.url = URL;
    }

    let componentPath
    if(item.component=="modules/online/cgform/OnlCgformHeadList"){
      componentPath = onlineCommons.OnlCgformHeadList
    }else if(item.component=="modules/online/cgform/OnlCgformCopyList"){
      componentPath = onlineCommons.OnlCgformCopyList
    }else if(item.component=="modules/online/cgform/auto/OnlCgformAutoList"){
      componentPath = onlineCommons.OnlCgformAutoList
    }else if(item.component=="modules/online/cgform/auto/OnlCgformTreeList"){
      componentPath = onlineCommons.OnlCgformTreeList
    }else if(item.component=="modules/online/cgform/auto/erp/OnlCgformErpList"){
      componentPath = onlineCommons.OnlCgformErpList
    }else if(item.component=="modules/online/cgform/auto/tab/OnlCgformTabList"){
      componentPath = onlineCommons.OnlCgformTabList
    }else if(item.component=="modules/online/cgform/auto/innerTable/OnlCgformInnerTableList"){
      componentPath = onlineCommons.OnlCgformInnerTableList
    }else if(item.component=="modules/online/cgreport/OnlCgreportHeadList"){
      componentPath = onlineCommons.OnlCgreportHeadList
    }else if(item.component=="modules/online/cgreport/auto/OnlCgreportAutoList"){
      componentPath = onlineCommons.OnlCgreportAutoList
    }else{
      componentPath = resolve => require(['@/' + component+'.vue'], resolve)
    }

    let menu =  {
      path: item.path,
      name: item.name,
      redirect:item.redirect,
      component: componentPath,
      //component: resolve => require(['@/' + component+'.vue'], resolve),
      hidden:item.hidden,
      //component:()=> import(`@/views/${item.component}.vue`),
      meta: {
        title:item.meta.title ,
        icon: item.meta.icon,
        url:item.meta.url ,
        permissionList:item.meta.permissionList,
        keepAlive:item.meta.keepAlive,

        internalOrExternal:item.meta.internalOrExternal,

        componentName:item.meta.componentName
      }
    }
    if(item.alwaysShow){
      menu.alwaysShow = true;
      menu.redirect = menu.path;
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters( item.children)];
    }

    //Check whether a route is generated
    if(item.route && item.route === '0'){
      //console.log(' No Route Generation item.route：  '+item.route);
      //console.log(' No Route Generation item.path：  '+item.path);
    }else{
      routers.push(menu);
    }
  }
  return routers
}

/**
 * Deep clone object, array
 * @param obj The object to be cloned
 * @return The cloned object
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Random Number Generators
 *
 * Example: Generate a random number of length 12：randomNumber(12)
 * Example: Generate a random number between 3 and 23：randomNumber(3, 23)
 *
 * @param1 minimum length
 * @param2 maximum length
 * @return int The generated number
 */
export function randomNumber() {
  // Generate random numbers from minimum to maximum values
  const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }
  if (arguments.length === 1) {
    let [length] = arguments
  // Generates a random number of the specified length that must not begin with a 0
    let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
    return parseInt(nums.join(''))
  } else if (arguments.length >= 2) {
    let [min, max] = arguments
    return random(min, max)
  } else {
    return Number.NaN
  }
}

/**
 * Randomly generated string
 * @param length  the length of string
 * @param chats Optional string range (only characters from the passed string will be generated)
 * @return string Generated string
 */
export function randomString(length, chats) {
  if (!length) length = 1
  if (!chats) chats = '0123456789qwertyuioplkjhgfdsazxcvbnm'
  let str = ''
  for (let i = 0; i < length; i++) {
    let num = randomNumber(0, chats.length - 1)
    str += chats[num]
  }
  return str
}

/**
 * Randomly generate uuid
 * @return string generated uuid
 */
export function randomUUID() {
  let chats = '0123456789abcdef'
  return randomString(32, chats)
}

/**
 * Underline to hump
 * @param string
 * @returns {*}
 */
export function underLine2CamelCase(string){
  return string.replace( /_([a-z])/g, function( all, letter ) {
    return letter.toUpperCase();
  });
}

/**
 * Check whether the handle button is displayed
 * @param bpmStatus
 * @returns {*}
 */
export function showDealBtn(bpmStatus){
  if(bpmStatus!="1"&&bpmStatus!="3"&&bpmStatus!="4"){
    return true;
  }
  return false;
}

/**
 * Enhanced CSS to output global CSS on the page
 * @param css CSS to be enhanced
 * @param id The ID of the style tag, which can be used to clear old styles
 */
export function cssExpand(css, id) {
  let style = document.createElement('style')
  style.type = "text/css"
  style.innerHTML = `@charset "UTF-8"; ${css}`

  if (id) {
    let $style = document.getElementById(id)
    if ($style != null) $style.outerHTML = ''
    style.id = id
  }

  document.head.appendChild(style)
}


/** For JS enhanced events, run JS code, can pass parameters */
// options params：
//    Param name     Type            Description
//    vm             VueComponent    vue instance
//    event          Object          event obj
//    jsCode         String          The JS code to execute
//    errorMessage   String          Prompt after execution error (console)
export function jsExpand(options = {}) {

  // The keyName bound to the window
  let windowKeyName = 'J_CLICK_EVENT_OPTIONS'
  if (typeof window[windowKeyName] != 'object') {
    window[windowKeyName] = {}
  }

  // Random generation of JS-enhanced execution ids to prevent collisions
  let id = randomString(16, 'qwertyuioplkjhgfdsazxcvbnm'.toUpperCase())
  // Encapsulate button click events
  let code = `
    (function (o_${id}) {
      try {
        (function (globalEvent, vm) {
          ${options.jsCode}
        })(o_${id}.event, o_${id}.vm)
      } catch (e) {
        o_${id}.error(e)
      }
      o_${id}.done()
    })(window['${windowKeyName}']['EVENT_${id}'])
  `
  // Create script tag
  const script = document.createElement('script')
  // Mount the parameters to be passed to the Window object
  window[windowKeyName]['EVENT_' + id] = {
    vm: options.vm,
    event: options.event,
    // A callback event that will be called anyway when execution is complete
    done() {
      // Deleting a new script tag after execution does not undo the result of execution.
      script.outerHTML = ''
      delete window[windowKeyName]['EVENT_' + id]
    },
    // The event that is called when js runs incorrectly
    error(e) {
      console.group(`${options.errorMessage || 'The user - defined JS enhancement code failed to run'}（${new Date()}）`)
      console.error(e)
      console.groupEnd()
    }
  }
  // Mount the event into the document
  script.innerHTML = code
  document.body.appendChild(script)
}


/**
 * Duplicate value validation tool method
 *
 * EXAMPLE：
 * { validator: (rule, value, callback) => validateDuplicateValue('sys_fill_rule', 'rule_code', value, this.model.id, callback) }
 *
 * @param tableName The name of the table being validated
 * @param fieldName The name of the field being validated
 * @param fieldVal The value of the field being validated
 * @param dataId Data ID, nullable
 * @param callback
 */
export function validateDuplicateValue(tableName, fieldName, fieldVal, dataId, callback) {
  if (fieldVal) {
    let params = { tableName, fieldName, fieldVal, dataId }
    api.duplicateCheck(params).then(res => {
      res['success'] ? callback() : callback(res['message'])
    }).catch(err => {
      callback(err.message || err)
    })
  } else {
    callback()
  }
}

/**
 * Verifies that the value passed is valid according to the encoding validation rule code
 *
 * EXAMPLE：
 * { validator: (rule, value, callback) => validateCheckRule('common', value, callback) }
 *
 * @param ruleCode Code check rule
 * @param value The value being validated
 * @param callback
 */
export function validateCheckRule(ruleCode, value, callback) {
  if (ruleCode && value) {
    value = encodeURIComponent(value)
    api.checkRuleByCode({ ruleCode, value }).then(res => {
      res['success'] ? callback() : callback(res['message'])
    }).catch(err => {
      callback(err.message || err)
    })
  } else {
    callback()
  }
}

/**
 * If the value does not exist, it is pushed into the array
 * @param array Data to manipulate
 * @param value The value to add
 * @param key Null. If the object is being compared, the address may be different but the value is actually the same. You can pass this field to determine the unique field in the object, such as ID. If not, the actual value is directly compared
 * @returns {boolean} Push returns true for success, false for no processing
 */
export function pushIfNotExist(array, value, key) {
  for (let item of array) {
    if (key && (item[key] === value[key])) {
      return false
    } else if (item === value) {
      return false
    }
  }
  array.push(value)
  return true
}

/**
 * Can be used to determine success
 * @type {symbol}
 */
export const succeedSymbol = Symbol()
/**
 * Can be used to determine failure
 * @type {symbol}
 */
export const failedSymbol = Symbol()

/**
 * Make a promise resolve anyway, unless the argument passed is not a Promise object or a method that returns a Promise object
 * Usually used in promise.all
 *
 * @param promise Methods that can pass Promise objects or return Promise objects
 * @returns {Promise<any>}
 */
export function alwaysResolve(promise) {
  return new Promise((resolve, reject) => {
    let p = promise
    if (typeof promise === 'function') {
      p = promise()
    }
    if (p instanceof Promise) {
      p.then(data => {
        resolve({ type: succeedSymbol, data })
      }).catch(error => {
        resolve({ type: failedSymbol, error })
      })
    } else {
      reject('alwaysResolve: The parameter passed in is not a Promise object or a method that returns a Promise object')
    }
  })
}

/**
 * Simple implementation of anti - debounce method
 *
 * The debounce function does not execute the function immediately the first time a given function is triggered, but instead gives a delay value, such as 100ms.
 * If the function is executed again within 100ms, the timing is restarted and the function is not actually executed until the timing ends.
 * The advantage of this is that if the same event is fired many times in a short period of time, the function will only be executed once.
 *
 * @param fn anti - debounce function
 * @param delay The number of milliseconds to anti - debounce
 * @returns {Function}
 */
export function simpleDebounce(fn, delay = 100) {
  let timer = null
  return function () {
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * Replace all values without using regular expressions
 * @param text The string to be replaced
 * @param checker  The content before the substitution
 * @param replacer The content after the replacement
 * @returns {String} The replaced string
 */
export function replaceAll(text, checker, replacer) {
  let lastText = text
  text = text.replace(checker, replacer)
  if (lastText !== text) {
    return replaceAll(text, checker, replacer)
  }
  return text
}

/**
 * Get event bubble path compatible with IE11, Edge, Chrome, Firefox, Safari
 * Currently in use: JEditableTable Span mode
 */
export function getEventPath(event) {
  let target = event.target
  let path = (event.composedPath && event.composedPath()) || event.path

  if (path != null) {
    return (path.indexOf(window) < 0) ? path.concat(window) : path
  }

  if (target === window) {
    return [window]
  }

  let getParents = (node, memo) => {
    memo = memo || []
    const parentNode = node.parentNode

    if (!parentNode) {
      return memo
    } else {
      return getParents(parentNode, memo.concat(parentNode))
    }
  }
  return [target].concat(getParents(target), window)
}

/**
 * Gets the parent based on the component name
 * @param vm
 * @param name
 * @returns {Vue | null|null|Vue}
 */
export function getVmParentByName(vm, name) {
  let parent = vm.$parent
  if (parent && parent.$options) {
    if (parent.$options.name === name) {
      return parent
    } else {
      let res = getVmParentByName(parent, name)
      if (res) {
        return res
      }
    }
  }
  return null
}

/**
 * Make a never value (null | undefined)
 *
 * @param value The value to process
 * @param def The default value, if the value of (null | undefined) it returns the default value, can not pass, the default value is' '
 */
export function neverNull(value, def) {
  return value == null ? (neverNull(def, '')) : value
}

/**
 * Removes an element from an array based on its value
 * @param array array
 * @param prod attribute name
 * @param value attribute value
 * @returns {string}
 */
export function removeArrayElement(array, prod, value) {
  let index = -1
  for(let i = 0;i<array.length;i++){
    if(array[i][prod] == value){
      index = i;
      break;
    }
  }
  if(index>=0){
    array.splice(index, 1);
  }
}

/** Determine if it is an OAuth2APP environment   */
export function isOAuth2AppEnv() {
  return /wxwork|dingtalk/i.test(navigator.userAgent)
}

/**
 * Obtain the block report printing address
 * @param url
 * @param id
 * @param open Auto open or not
 * @returns {*}
 */
export function getReportPrintUrl(url, id, open) {

  url = url.replace(/{{([^}]+)?}}/g, (s1, s2) => eval(s2))
  if (url.includes('?')) {
    url += '&'
  } else {
    url += '?'
  }
  url += `id=${id}`
  url += `&token=${Vue.ls.get(ACCESS_TOKEN)}`
  if (open) {
    window.open(url)
  }
  return url
}

/**
 * JS implements AOP facets
 *
 * @param obj The object that contains the function
 * @param funcName The name of the function to slice
 * @param callback The return value of callback is the final return value of funcName
 */
export function aspectAroundFunction(obj, funcName, callback) {
  if (typeof callback !== 'function' || !obj) {
    console.warn('【aspectAroundFunction】obj或callback格式不正确')
    return
  }
  // Save the original function
  let func = obj[funcName]
  if (typeof func !== 'function') {
    console.warn('【aspectAroundFunction】' + funcName + 'are not the same')
    return
  }
  // Assign a new method
  // When funcName is called externally, the new method I defined is first called
  // The callback method passed in is then called to decide whether to execute funcName and to change the argument and return value
  obj[funcName] = function (...args) {
    return callback({
      args,
      // The given funcName method is actually executed only when proceed is executed
      proceed() {
        try {
          return func.apply(obj, args)
        } catch (e) {
          console.error(e)
        }
      },
    })
  }
}