
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

// 默认的state 就是vuex的数据
const getDefaultState = () => {
  return {
    token: getToken(), // token
    name: '', // 用户名
    avatar: '' // 头像
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // 用户登陆
  // login({ commit }, userInfo) {
  //   const { username, password } = userInfo
  //   return new Promise((resolve, reject) => {
  //     login({ username: username.trim(), password: password }).then(response => {
  //       const { data } = response
  //       commit('SET_TOKEN', data.token)
  //       setToken(data.token)
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // 获取用户信息
  // getInfo({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     getInfo(state.token).then(response => {
  //       const { data } = response

  //       if (!data) {
  //         return reject('Verification failed, please Login again.')
  //       }

  //       const { name, avatar } = data

  //       commit('SET_NAME', name)
  //       commit('SET_AVATAR', avatar)
  //       resolve(data)
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // 用户退出
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 看你需不需要走后台退出登陆的接口 如果需要就走完后台的退出接口，那就在成功后清除token那些，不然你直接清除即可
      // logout自己修改一下哈，改成自己的后台退出接口api地址
      logout(state.token).then(() => {
        // 后台退出成功
        removeToken() // 退出后必须移除token
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
      // 不需要走后台接口就打开下面的代码
      // removeToken() // 退出后必须移除token
      // resetRouter()
      // commit('RESET_STATE')
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

