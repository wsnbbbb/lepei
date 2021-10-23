import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import common from './modules/common'

Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    superAdmin: false,
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    TOG2SUPER(state){
        state.superAdmin = true
    },
    TOG2COMMON(state){
        state.superAdmin = false
    }
}

// 创建 store 实例
export default new Vuex.Store({
    // modules:{
    //     common
    // }
    state,
    mutations
})