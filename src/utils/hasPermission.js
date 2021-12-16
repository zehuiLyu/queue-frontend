import { USER_AUTH,SYS_BUTTON_AUTH } from "@/store/mutation-types"

const hasPermission = {
    install (Vue, options) {
          //console.log(options);
          Vue.directive('has', {
            inserted: (el, binding, vnode)=>{

                //The node permission is processed. If a match is made, the global permission is not processed
                if(!filterNodePermission(el, binding, vnode)){
                  filterGlobalPermission(el, binding, vnode);
                }

            }
          });
    }
};

/**
 * Process node permission control
 */
export function filterNodePermission(el, binding, vnode) {
  let permissionList = [];
  try {
    let obj = vnode.context.$props.formData;
    if (obj) {
      let bpmList = obj.permissionList;
      for (let bpm of bpmList) {
        if(bpm.type != '2') {
          permissionList.push(bpm);
        }
      }
    }else{
      return false;
    }
  } catch (e) {
    //console.log("Page Permission Exception----", e);
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    //el.parentNode.removeChild(el)
    return false;
  }

  console.log("Process node page permissions--NODE--");
  let permissions = [];
  for (let item of permissionList) {
    if(item.type != '2') {
      permissions.push(item.action);
    }
  }

  if (!permissions.includes(binding.value)) {

    return false;
  }else{
    for (let item2 of permissionList) {
      if(binding.value === item2.action){
        return true;
      }
    }
  }
  return false;
}

/**
 * Global permission control
 */
export function filterGlobalPermission(el, binding, vnode) {


  let permissionList = [];
  let allPermissionList = [];


  let authList = JSON.parse(sessionStorage.getItem(USER_AUTH) || "[]");
  for (let auth of authList) {
    if(auth.type != '2') {
      permissionList.push(auth);
    }
  }

  let allAuthList = JSON.parse(sessionStorage.getItem(SYS_BUTTON_AUTH) || "[]");
  for (let gauth of allAuthList) {
    if(gauth.type != '2') {
      allPermissionList.push(gauth);
    }
  }
  //Set whether the global configuration is matched
  let invalidFlag = false;
  if(allPermissionList != null && allPermissionList != "" && allPermissionList != undefined && allPermissionList.length > 0){
    for (let itemG of allPermissionList) {
      if(binding.value === itemG.action){
        if(itemG.status == '0'){
          invalidFlag = true;
          break;
        }
      }
    }
  }
  if(invalidFlag){
    return;
  }
  if (permissionList === null || permissionList === "" || permissionList === undefined||permissionList.length<=0) {
    el.parentNode.removeChild(el);
    return;
  }
  let permissions = [];
  for (let item of permissionList) {
    //Permission policy 1 Is displayed. 2 Is disabled
    if(item.type != '2'){

      if(item.action){
        if(item.action.includes(",")){
          let split = item.action.split(",")
            for (let i = 0; i <split.length ; i++) {
              if(!split[i] ||split[i].length==0){
                continue;
              }
              permissions.push(split[i]);
          }
        }else{
          permissions.push(item.action);
        }
      }

    }
  }
  if (!permissions.includes(binding.value)) {
    el.parentNode.removeChild(el);
  }
}

export default hasPermission;
