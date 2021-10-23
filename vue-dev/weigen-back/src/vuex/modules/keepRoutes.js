const state={
  includeRoute:[],
  excludeRoute:{},
};
const getters={
  includeRoute(state){ 
    return state.includeRoute;
  },
  excludeRoute(state){ 
    return state.excludeRoute;
  }
};
const mutations={
  setIncludeRoute(state, items){ 
      state.includeRoute=items
  },
  setExcludeRoute(state, items){ 
      state.excludeRoute=items
  }
};
const actions={
  setIncludeRoute({ commit },items){ 
    commit('setIncludeRoute', items);
  },
  setExcludeRoute({ commit },items){ 
    commit('setExcludeRoute', items);
  }
};
export default {
   namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
   state,
   getters,
   mutations,
   actions
}