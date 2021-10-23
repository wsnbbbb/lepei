const state={
    isSuperAdmin: false,
    buildingList:[
      { id: "",
        name: "全部" 
      }
    ],  //初始化一个buildingList数组
};
const getters={
  renderBuilding(state){ //承载变化的buildingList
    return state.buildingList;
  },
  getIsSuperAdmin(state){
    return state.isSuperAdmin;
  }
};
const mutations={
     setBuilding(state, items){ //如何变化buildingList,插入items
        state.buildingList=items
     }
 };
const actions={
    invokePushItems(context,item){ //触发mutations里面的pushBuilding ,传入数据形参item 对应到items
        context.commit('setBuilding', item);
    }
};
export default {
     namespaced:true,//用于在全局引用此文件里的方法时标识这一个的文件名
     state,
     getters,
     mutations,
     actions
}