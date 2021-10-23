
import  {getSchoolNoticeList,getSchoolNoticeDetail,addSchoolNotice,updateSchoolNotice,delSchoolNotice,getNoticePublishers,setNoticePublishers}  from 'services/index';
export default {

    namespace: 'schoolNotice',
  
    state: {
        current:1
    },
  
    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },
  
    effects: {
      * getSchoolNoticeList({ payload }, { call, put }) {  // 获取学校公告列表
        let res=yield call(getSchoolNoticeList,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'save',payload:res.data });
        }
      },
      * getSchoolNoticeDetail({ payload,callback }, { call, put }) {  // 获取学校公告详情
        let res=yield call(getSchoolNoticeDetail,payload)
        if(res&&res.code&&res.code===200){
          yield put({ type: 'saveDetail',payload:res.data });
          if(callback && typeof callback === 'function'){
            callback(res)
          }
        }
      },
      * delSchoolNotice({ payload,callback }, { call, put }) {  // 删除学校公告
        let res=yield call(delSchoolNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * addSchoolNotice({ payload,callback }, { call, put }) {  // 添加学校公告
        let res=yield call(addSchoolNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * updateSchoolNotice({ payload,callback }, { call, put }) {  // 更新学校公告
        let res=yield call(updateSchoolNotice,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * getNoticePublishers({ payload,callback }, { call, put }) {  // 查看学校公告发布人
        let res=yield call(getNoticePublishers,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      * setNoticePublishers({ payload,callback }, { call, put }) {  // 设置学校公告发布人
        let res=yield call(setNoticePublishers,payload)
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
        return { ...state, schoolNoticeDetail:{...action.payload }};
      }
    },
  
  };
  