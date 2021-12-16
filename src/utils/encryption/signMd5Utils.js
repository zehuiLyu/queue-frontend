import md5 from 'md5'
//Signed key string
const signatureSecret = "dd05f1c54d63749eda95f9fa6d49v442a";

export default class signMd5Utils {
  /**
   * json Parameters in ascending order
   * @param jsonObj parameter send
   */

  static sortAsc(jsonObj) {
    let arr = new Array();
    let num = 0;
    for (let i in jsonObj) {
      arr[num] = i;
      num++;
    }
    let sortArr = arr.sort();
    let sortObj = {};
    for (let i in sortArr) {
      sortObj[sortArr[i]] = jsonObj[sortArr[i]];
    }
    return sortObj;
  }


  /**
   * @param url The requested URL should contain the request parameters (? Subsequent parameters of url)
   * @param requestParams Request parameters (JSON parameters for POST)
   * @returns {string} getsignature
   */
  static getSign(url, requestParams) {
    let urlParams = this.parseQueryString(url);
    let jsonObj = this.mergeObject(urlParams, requestParams);
    //console.log("sign jsonObj: ",jsonObj)
    let requestBody = this.sortAsc(jsonObj);
    console.log("sign requestBody: ",requestBody)
    return md5(JSON.stringify(requestBody) + signatureSecret).toUpperCase();
  }

  /**
   * @param url Request-URL
   * @returns {{}} Assemble the request parameters in the URL into JSON objects
   */
  static parseQueryString(url) {
    let urlReg = /^[^\?]+\?([\w\W]+)$/,
      paramReg = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
      urlArray = urlReg.exec(url),
      result = {};

    // Gets the last comma parameter variable on the URL sys/dict/getDictItems/sys_user,realname,username
    //【don't have encode here】Encode with conditional parameter example：/sys/dict/getDictItems/sys_user,realname,id,username!='admin'%20order%20by%20create_time
    let lastpathVariable = url.substring(url.lastIndexOf('/') + 1);
    if(lastpathVariable.includes(",")){
      if(lastpathVariable.includes("?")){
        lastpathVariable = lastpathVariable.substring(0, lastpathVariable.indexOf("?"));
      }
      //Resolve Sign signature verification failure #2728
      result["x-path-variable"] = decodeURIComponent(lastpathVariable);
    }
    if (urlArray && urlArray[1]) {
      let paramString = urlArray[1], paramResult;
      while ((paramResult = paramReg.exec(paramString)) != null) {
        //The numeric value is changed to string, and the encryption rules of the front and back ends are the same
        if(this.myIsNaN(paramResult[2])){
          paramResult[2] = paramResult[2].toString()
        }
        result[paramResult[1]] = paramResult[2];
      }
    }
    return result;
  }

  /**
   * @returns {*} Combine two objects into one
   */
  static mergeObject(objectOne, objectTwo) {
    if (objectTwo && Object.keys(objectTwo).length > 0) {
      for (let key in objectTwo) {
        if (objectTwo.hasOwnProperty(key) === true) {
          //The numeric value is changed to string, and the encryption rules of the front and back ends are the same
          if(this.myIsNaN(objectTwo[key])){
            objectTwo[key] = objectTwo[key].toString()
          }
          objectOne[key] = objectTwo[key];
        }
      }
    }
    return objectOne;
  }

  static urlEncode(param, key, encode) {
    if (param == null) return '';
    let paramStr = '';
    let t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
      paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
    } else {
      for (let i in param) {
        let k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
        paramStr += this.urlEncode(param[i], k, encode);
      }
    }
    return paramStr;
  };

  static getDateTimeToString() {
    const date_ = new Date()
    const year = date_.getFullYear()
    let month = date_.getMonth() + 1
    let day = date_.getDate()
    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    let hours = date_.getHours()
    let mins = date_.getMinutes()
    let secs = date_.getSeconds()
    const msecs = date_.getMilliseconds()
    if (hours < 10) hours = '0' + hours
    if (mins < 10) mins = '0' + mins
    if (secs < 10) secs = '0' + secs
    if (msecs < 10) secs = '0' + msecs
    return year + '' + month + '' + day + '' + hours + '' + mins + '' + secs
  }
    // true:numeric type，false：non-numeric type
  static myIsNaN(value) {
    return typeof value === 'number' && !isNaN(value);
  }

}