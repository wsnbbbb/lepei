
import  {getBuildings,buildingList, addBuilding, editBuilding, deleteBuilding, placeList, addPlace, deletePlace, deleteArrPlace, editPlace,
  importPlace,placeDetail,buildDetail}  from 'services/index';
export default {

    namespace: 'place',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getBuildings({ payload, callback }, { call, put }) {  // 根据类型获取建筑
        let res=yield call(getBuildings, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * importPlace({ payload, callback }, { call, put }) {  // 导入场所
        let res=yield call(importPlace, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * buildingList({ payload, callback }, { call, put }) {  //建筑管理列表
        let res=yield call(buildingList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * buildDetail({ payload, callback }, { call, put }) {  //编辑详情
        let res=yield call(buildDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addBuilding({ payload, callback }, { call, put }) {  
        let res=yield call(addBuilding, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * editBuilding({ payload, callback }, { call, put }) {  
        let res=yield call(editBuilding, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * deleteBuilding({ payload, callback }, { call, put }) {  
        let res=yield call(deleteBuilding, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * placeList({ payload, callback }, { call, put }) {  
        let res=yield call(placeList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * addPlace({ payload, callback }, { call, put }) {  //添加场所
        let res=yield call(addPlace, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * deletePlace({ payload, callback }, { call, put }) {  //场所删除
        let res=yield call(deletePlace, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * deleteArrPlace({ payload, callback }, { call, put }) {  //批量删除
        let res=yield call(deleteArrPlace, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * editPlace({ payload, callback }, { call, put }) {  // 编辑场所
        let res=yield call(editPlace, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * placeDetail({ payload, callback }, { call, put }) {  // 编辑详情
        let res=yield call(placeDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, dataList: action.payload };
      },
      saveTerm(state, action) {
        return{...state, dataList: action.payload}
      },
      saveTermDetail(state, action) {
        return{...state, data: action.payload}
      },
    },
  
  };
  