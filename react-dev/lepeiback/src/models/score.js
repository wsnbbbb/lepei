
import  { getScoreList, getRuleItems, getRuleList, saveRule, getLevelList, saveLevel, getPersonScoreLog,
  personScoreMedal, medalList, saveMedal, personScoreGoods, personScoreGoodsDetail,
  personScoreGoodsAdd, personScoreGoodsEdit, personScoreGoodsDelete, exchangeRecord}  from 'services/index';
export default {

    namespace: 'score',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {

      * getScoreList({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getScoreList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getRuleItems({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getRuleItems, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
     
      * getRuleList({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getRuleList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * saveRule({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(saveRule, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getLevelList({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getLevelList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * saveLevel({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(saveLevel, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getPersonScoreLog({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(getPersonScoreLog, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personScoreMedal({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personScoreMedal, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * medalList({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(medalList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * saveMedal({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(saveMedal, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personScoreGoods({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personScoreGoods, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personScoreGoodsDetail({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personScoreGoodsDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personScoreGoodsAdd({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personScoreGoodsAdd, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personScoreGoodsEdit({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personScoreGoodsEdit, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * personScoreGoodsDelete({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(personScoreGoodsDelete, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * exchangeRecord({ payload, callback }, { call, put }) {  // 列表
        let res=yield call(exchangeRecord, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      
    },
  
    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
      
    },
  
  };
  