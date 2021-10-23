import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import common from './modules/common'

Vue.use(Vuex)

// 应用初始状态
const state = {
    isShow: false,
    activeName: 'student-statistics',
}

// 定义所需的 mutations
const mutations = {
    toggleToTrue(state){
        state.isShow = true
    },
    toggleToFalse(state){
        state.isShow = false
    },
    resetTab(state){
        state.activeName = 'student-statistics'
    },
    setTab(state, name){
        state.activeName = name
    },
}

// 创建 store 实例
export default new Vuex.Store({
    state,
    mutations
})