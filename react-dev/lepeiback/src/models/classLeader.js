
import  {classLeaderList,deleteClassLeader,addClassLeader,updateClassLeader}  from 'services/index';
export default {

    namespace: 'classLeader',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
        * getClassLeaderList({ payload,callback }, { call, put }) {  // 获取班干部
            let res=yield call(classLeaderList,payload)
            if(res&&res.code&&res.code===200){
                yield put({ type: 'save',payload:res });
            }
          },
        * delClassLeader({ payload,callback }, { call, put }) {  // 删除班干部
            let res=yield call(deleteClassLeader,payload)
            if(callback && typeof callback === 'function'){
            callback(res)
            }
        },
        * addClassLeader({ payload,callback }, { call, put }) {  // 添加班干部
            let res=yield call(addClassLeader,payload)
            if(callback && typeof callback === 'function'){
            callback(res)
            }
        },
        * updateClassLeader({ payload,callback }, { call, put }) {  // 编辑班干部
            let res=yield call(updateClassLeader,payload)
            if(callback && typeof callback === 'function'){
            callback(res)
            }
        },
      
    },
  
    reducers: {
        save(state, action) {
            return { ...state, ...action.payload };
        }
    },
  
  };
  