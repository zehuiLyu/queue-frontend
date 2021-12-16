import Vue from 'vue'
import { ONL_AUTH_FIELDS } from "@/store/mutation-types"
import { getAction } from '@/api/manage'


const online = {
  state: {
    //Store object properties value,text
    authFields: [],
  },
  mutations: {
    SET_AUTHFIELDS: (state, fields) => {
      console.log('fields',fields)
      Vue.set(state, 'authFields', fields)
    }
  },
  actions: {
    xxxxxx({ commit }, userInfo) {
    }

  }
}

export default online