
import  {canteenMenuList,canteenMenuDetail,createCanteenMenu,updateCanteenMenu,delCanteenMenu}  from 'services/index';
export default {

    namespace: 'canteenMenu',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * canteenMenuList({ payload }, { call, put }) {  // 获取食堂菜谱列表
        let res=yield call(canteenMenuList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * canteenMenuDetail({ payload,callback }, { call, put }) {  // 获取食堂菜谱详情
        let res=yield call(canteenMenuDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * delCanteenMenu({ payload,callback }, { call, put }) {  // 删除食堂菜谱
        let res=yield call(delCanteenMenu,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * createCanteenMenu({ payload,callback }, { call, put }) {  // 添加食堂菜谱
        let res=yield call(createCanteenMenu,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateCanteenMenu({ payload,callback }, { call, put }) {  // 更新食堂菜谱
        let res=yield call(updateCanteenMenu,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      saveDetail(state, action) {
        return { ...state, canteenMenuDetail:{...action.payload }};
      }
    },
  
  };
  