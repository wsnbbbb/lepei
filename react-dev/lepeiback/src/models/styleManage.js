
import  {styleList,styleDetail,createStyle,updateStyle,delStyle}  from 'services/index';
export default {

    namespace: 'styleManage',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * styleList({ payload }, { call, put }) {  // 获取食堂菜谱列表
        let res=yield call(styleList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * styleDetail({ payload,callback }, { call, put }) {  // 获取食堂菜谱详情
        let res=yield call(styleDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * delStyle({ payload,callback }, { call, put }) {  // 删除食堂菜谱
        let res=yield call(delStyle,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * createStyle({ payload,callback }, { call, put }) {  // 添加食堂菜谱
        let res=yield call(createStyle,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateStyle({ payload,callback }, { call, put }) {  // 更新食堂菜谱
        let res=yield call(updateStyle,payload)
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
        return { ...state, styleDetail:{...action.payload }};
      }
    },
  
  };
  