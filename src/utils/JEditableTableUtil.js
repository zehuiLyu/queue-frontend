import { getVmParentByName } from '@/utils/util'

const FormTypes = {
  normal: 'normal',
  input: 'input',
  inputNumber: 'inputNumber',
  checkbox: 'checkbox',
  select: 'select',
  date: 'date',
  datetime: 'datetime',
  time: 'time',
  upload: 'upload',
  file: 'file',
  image: 'image',
  popup:'popup',
  list_multi:"list_multi",
  sel_search:"sel_search",
  sel_search_async:"sel_search_async",
  radio:'radio',
  checkbox_meta:"checkbox_meta",
  input_pop:'input_pop',
  sel_depart: 'sel_depart',
  sel_user: 'sel_user',
  slot: 'slot',
  hidden: 'hidden'
}
const VALIDATE_NO_PASSED = Symbol()
export { FormTypes, VALIDATE_NO_PASSED }

/**
 * Gets the specified $refs object
 * Sometimes you might encounter a situation where a component is not mounted to the page, so that an object in $refs cannot be retrieved
 * This method can wait until the mount is complete before returning the $refs object to avoid errors
 **/
export function getRefPromise(vm, name) {
  return new Promise((resolve) => {
    (function next() {
      let ref = vm.$refs[name]
      if (ref) {
        resolve(ref)
      } else {
        setTimeout(() => {
          next()
        }, 10)
      }
    })()
  })
}

/**
 * Validate the primary form and all sub-forms at once
 * @param form The main form object
 * @param cases Receives an array, each of which is an instance of JEditableTable
 * @returns {Promise<any>}
 */
export function validateFormAndTables(form, cases) {

  if (!(form && typeof form.validateFields === 'function')) {
    throw `The form argument requires a form object, but is passed in${typeof form}`
  }

  let options = {}
  return new Promise((resolve, reject) => {
    // Validate the master table form
    form.validateFields((err, values) => {
      err ? reject({ error: VALIDATE_NO_PASSED }) : resolve(values)
    })
  }).then(values => {
    Object.assign(options, { formValue: values })
    // Validates forms for all child tables
    return validateTables(cases)
  }).then(all => {
    Object.assign(options, { tablesValue: all })
    return Promise.resolve(options)
  }).catch(error => {
    return Promise.reject(error)
  })

}
/**
 * Validate the primary form and all sub-forms at once
 * @param form The main form object
 * @param cases Receives an array, each of which is an instance of JEditableTable
 * @returns {Promise<any>}
 */
export function validateFormModelAndTables(form,values, cases) {

  if (!(form && typeof form.validate === 'function')) {
    throw `form The argument requires a form object, but is ${typeof form}`
  }
  let options = {}
  return new Promise((resolve, reject) => {

    form.validate((valid,obj) => {
      valid ?resolve(values):reject({ error: VALIDATE_NO_PASSED })
    })
  }).then(values => {
    Object.assign(options, { formValue: values })

    return validateTables(cases)
  }).then(all => {
    Object.assign(options, { tablesValue: all })
    return Promise.resolve(options)
  }).catch(error => {
    return Promise.reject(error)
  })

}

/**
 * Validates and gets all the values of one or more tables
 * @param cases Receives an array, each of which is an instance of JEditableTable
 * @param deleteTempId If this parameter is set to true, the row editor does not return the ID of the new row. The ID needs to be generated in the background
 */
export function validateTables(cases, deleteTempId) {
  if (!(cases instanceof Array)) {
    throw `'The 'cases' argument of the validateTables' function requires an array, but is passed in instead ${typeof cases}`
  }
  return new Promise((resolve, reject) => {
    let tables = []
    let index = 0;
    if(!cases || cases.length === 0){
      resolve()
    }
    (function next() {
      let vm = cases[index]
      vm.getAll(true, deleteTempId).then(all => {
        tables[index] = all
        // Check whether the verification is complete. If the verification is complete, the system returns success. Otherwise, continue the verification
        if (++index === cases.length) {
          resolve(tables)
        } else (
          next()
        )
      }, error => {
        // If a form fails to pass the verification, no further verification is performed, and the system returns a failure and jumps to the form
        if (error === VALIDATE_NO_PASSED) {
          // Try to get the tabKey if it is available in the ATab component
          let paneKey;
          let tabPane = getVmParentByName(vm, 'ATabPane')
          if (tabPane) {
            paneKey = tabPane.$vnode.key
          }
          reject({error: VALIDATE_NO_PASSED, index, paneKey})
        }
        reject(error)
      })
    })()
  })
}