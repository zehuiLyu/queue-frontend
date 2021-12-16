import JEditableTable from '@/components/jeecg/JEditableTable'
import { VALIDATE_NO_PASSED, getRefPromise, validateFormAndTables } from '@/utils/JEditableTableUtil'
import { httpAction, getAction } from '@/api/manage'

export const JEditableTableMixin = {
  components: {
    JEditableTable
  },
  data() {
    return {
      title: 'operation',
      visible: false,
      form: this.$form.createForm(this),
      confirmLoading: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    }
  },
  methods: {

    /** Get all instances of editableTable   */
    getAllTable() {
      if (!(this.refKeys instanceof Array)) {
        throw this.throwNotArray('refKeys')
      }
      let values = this.refKeys.map(key => getRefPromise(this, key))
      return Promise.all(values)
    },

    /** Iterate over all instances of JEditableTable  */
    eachAllTable(callback) {
      // traverse
      this.getAllTable().then(tables => {
        tables.forEach((item, index) => {
          if (typeof callback === 'function') {
            callback(item, index)
          }
        })
      })
    },

    /** This method is called when the create button is clicked */
    add() {

      return new Promise((resolve) => {
        this.tableReset();
        resolve();
      }).then(() => {
        if (typeof this.addBefore === 'function') this.addBefore()
        // Null data is added by default
        let rowNum = this.addDefaultRowNum
        if (typeof rowNum !== 'number') {
          rowNum = 1
          console.warn('Since you did not define addDefaultRowNum in data or addDefaultRowNum is not a number, an empty data is added by default. If you do not want to add empty data by default, define addDefaultRowNum to 0')
        }
        this.eachAllTable((item) => {
          item.add(rowNum)
        })
        if (typeof this.addAfter === 'function') this.addAfter(this.model)
        this.edit({})
      })

    },
    /** This method is called when the Edit (Modify) button is clicked */
    edit(record) {
      if(record && '{}'!=JSON.stringify(record)){
        this.tableReset();
      }
      if (typeof this.editBefore === 'function') this.editBefore(record)
      this.visible = true
      this.activeKey = this.refKeys[0]
      this.form.resetFields()
      this.model = Object.assign({}, record)
      if (typeof this.editAfter === 'function') this.editAfter(this.model)
    },
    /** Close the popover and return all JEditableTable instances to their initial state */
    close() {
      this.visible = false
      this.$emit('close')
    },
    //Clear the data of child table
    tableReset(){
      this.eachAllTable((item) => {
        item.clearRow()
      })
    },
    /** Query the data of a TAB */
    requestSubTableData(url, params, tab, success) {
      tab.loading = true
      getAction(url, params).then(res => {
        let { result } = res
        let dataSource = []
        if (result) {
          if (Array.isArray(result)) {
            dataSource = result
          } else if (Array.isArray(result.records)) {
            dataSource = result.records
          }
        }
        tab.dataSource = dataSource
        typeof success === 'function' ? success(res) : ''
      }).finally(() => {
        tab.loading = false
      })
    },
    /** Initiate a request and automatically determine whether to add or modify the request */
    request(formData) {
      let url = this.url.add, method = 'post'
      if (this.model.id) {
        url = this.url.edit
        method = 'put'
      }
      this.confirmLoading = true
      httpAction(url, formData, method).then((res) => {
        if (res.success) {
          this.$message.success(res.message)
          this.$emit('ok')
          this.close()
        } else {
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.confirmLoading = false
      })
    },

    /* --- handle 事件 --- */

    /** ATab switch event */
    handleChangeTabs(key) {
      // Automatically resets the scrollTop status to prevent a blank screen
      getRefPromise(this, key).then(editableTable => {
        editableTable.resetScrollTop()
      })
    },
    /** Turn off button click events */
    handleCancel() {
      this.close()
    },
    /** Determine the button click event */
    handleOk() {
      /** Triggering form validation */
      this.getAllTable().then(tables => {
        /** Verify the primary table and all sub-tables at once */
        return validateFormAndTables(this.form, tables)
      }).then(allValues => {
        if (typeof this.classifyIntoFormData !== 'function') {
          throw this.throwNotFunction('classifyIntoFormData')
        }
        let formData = this.classifyIntoFormData(allValues)
        // issue a request
        return this.request(formData)
      }).catch(e => {
        if (e.error === VALIDATE_NO_PASSED) {
          // If there is a child table that is not validated by the form, it is automatically jumped to its TAB
          this.activeKey = e.index == null ? this.activeKey : this.refKeys[e.index]
        } else {
          console.error(e)
        }
      })
    },

    /* --- throw --- */

    /** not a function */
    throwNotFunction(name) {
      return `${name} Undefined or not a function`
    },

    /** not a array */
    throwNotArray(name) {
      return `${name} Undefined or not an array`
    }

  }
}