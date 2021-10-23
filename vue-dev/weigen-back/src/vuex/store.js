import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import common from './modules/common';
import keepRoutes from './modules/keepRoutes';
import {routes} from '../routes/routes';
import router from '../routes'


Vue.use(Vuex)

// 应用初始状态
const state = {
    count: 10,
    
}

// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    },
    

}

// 创建 store 实例
export default new Vuex.Store({
    modules:{
        common,keepRoutes
    }
})