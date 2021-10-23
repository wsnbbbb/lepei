
import  { headPicList, getHeadPic, updateHeadPics, personHeadPicList, registerFaces}  from 'services/index';
export default {

    namespace: 'portrait',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * headPicList({ payload, callback }, { call, put }) {  
        let res=yield call(headPicList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getHeadPic({ payload, callback }, { call, put }) {  
        let res=yield call(getHeadPic, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * updateHeadPics({ payload, callback }, { call, put }) {  
        let res=yield call(updateHeadPics, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personHeadPicList({ payload, callback }, { call, put }) {  
        let res=yield call(personHeadPicList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * registerFaces({ payload, callback }, { call, put }) {  
        let res=yield call(registerFaces, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, dataList: action.payload };
      },
    },
  
  };
  