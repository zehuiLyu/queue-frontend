import Vue from 'vue'

/**
 * Group a request
 * @param getPromise Pass in a method that gets the Promise object
 * @param groupId Group ID. If it is not transmitted or empty, it is not grouped
 * @param expire Expiration time, half a minute by default
 */
export function httpGroupRequest(getPromise, groupId, expire = 1000 * 30) {
  if (groupId == null || groupId === '') {
    console.log("--------popup----------getFrom  DB-------with---no--groupId ")
    return getPromise()
  }

  if (Vue.ls.get(groupId)) {
    console.log("---------popup--------getFrom  Cache--------groupId = " + groupId)
    return Promise.resolve(Vue.ls.get(groupId));
  } else {
    console.log("--------popup----------getFrom  DB---------groupId = " + groupId)
  }

  // Make the first request if it has not already been made
  return getPromise().then(res => {
    Vue.ls.set(groupId, res, expire);
    return Promise.resolve(res);
  })
}


