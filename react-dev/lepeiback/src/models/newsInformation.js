
import  {getNewsList, getNewsDetail,saveEdit,addNews,delNews,updateStatus, getMsgList,changeStatus,replayMsg,delMsg,getAllAticle}  from 'services/index';
  export default {
  
      namespace: 'newsInformation',
    
      state: {
          
      },
    
      subscriptions: {
        setup({ dispatch, history }) {  // eslint-disable-line
        },
      },
      effects: {
        * getNewsList({ payload,callback }, { call, put }) {  // 获取新闻列表
          let res=yield call(getNewsList,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * getAllAticle({ payload,callback }, { call, put }) {  // 获取新闻列表
          let res=yield call(getAllAticle,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * getNewsDetail({ payload,callback }, { call, put }) {  // 获取新闻列表详情
          let res=yield call(getNewsDetail,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * saveEdit({ payload,callback }, { call, put }) {  // 新闻编辑
          let res=yield call(saveEdit,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * addNews({ payload,callback }, { call, put }) {  // 新闻发布
          let res=yield call(addNews,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * delNews({ payload,callback }, { call, put }) {  // 删除
          let res=yield call(delNews,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * updateStatus({ payload,callback }, { call, put }) {  // 状态变更 
          let res=yield call(updateStatus,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * getMsgList({ payload,callback }, { call, put }) {  // 留言列表 
          let res=yield call(getMsgList,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * changeStatus({ payload,callback }, { call, put }) {  // 改变精选状态 
          let res=yield call(changeStatus,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * replayMsg({ payload,callback }, { call, put }) {  // 回复留言
          let res=yield call(replayMsg,payload)
          if(callback && typeof callback === 'function'){ 
            callback(res)
          }
        },
        * delMsg({ payload,callback }, { call, put }) {  // 删除留言
          let res=yield call(delMsg,payload)
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
    