
import  {getEvaluationRecords, getApointBySemesterIdAndGradeId, getEvaluationRecordsDetail,getEvaluationLogs,
  updateEvaluationRecords, getEvaluationGroup, getEvaluationGroupDetail, getGradeTree, modifyClassEvaluationGroup,
  getEvaluationGroupList, getSemestersList, getSameScoreTypeGroup, copyClassEvaluationGroup, getClassEvaluationType,
  deleteClassEvaluationType, getAllSchoolUser, commonPersonList, commonTypes, getClassesTree, getStudents, addClassEvaluationType,
  getEvaluationFlagDetail,  getApointGroup, setEvaluationFlag, weekObtainList, flagObtainDetail, obtainFlag, flagDetailWeek,
  getWeekList, getDailyDetail, getWeekDetail, getMonthDetail, getMonthList, getGradeByGroupId, addClassEvaluationGroup, getClassEvaluationTypeDetail,
  updateClassEvaluationType, getAllPubStudents
  
}  from 'services/index';
export default {

    namespace: 'evaluate',
  
    state: {
        
    },
  
    subscriptions: {
      setup({ dispatch, history }) {
      },
    },
  
    effects: {
      * getEvaluationRecords({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationRecords,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getApointBySemesterIdAndGradeId({ payload,callback }, { call, put }) {
        let res=yield call(getApointBySemesterIdAndGradeId,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getEvaluationRecordsDetail({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationRecordsDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getEvaluationLogs({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationLogs,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * updateEvaluationRecords({ payload,callback }, { call, put }) {
        let res=yield call(updateEvaluationRecords,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getEvaluationGroup({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationGroup,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getEvaluationGroupDetail({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationGroupDetail,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getGradeTree({ payload,callback }, { call, put }) {
        let res=yield call(getGradeTree,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * modifyClassEvaluationGroup({ payload,callback }, { call, put }) {
        let res=yield call(modifyClassEvaluationGroup,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getEvaluationGroupList({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationGroupList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getSemestersList({ payload,callback }, { call, put }) {
        let res=yield call(getSemestersList,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getSameScoreTypeGroup({ payload,callback }, { call, put }) {
        let res=yield call(getSameScoreTypeGroup,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * copyClassEvaluationGroup({ payload,callback }, { call, put }) {
        let res=yield call(copyClassEvaluationGroup,payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getClassEvaluationType({ payload,callback }, { call, put }) {
        let res=yield call(getClassEvaluationType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * deleteEvaluationType({ payload,callback }, { call, put }) {
        let res=yield call(deleteClassEvaluationType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getAllSchoolUser({ payload,callback }, { call, put }) {
        let res=yield call(getAllSchoolUser, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * teacherExaminers({ payload,callback }, { call, put }) {
        let res=yield call(commonPersonList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * studentExaminers({ payload,callback }, { call, put }) {
        let res=yield call(commonPersonList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * commonTypes({ payload,callback }, { call, put }) {
        let res=yield call(commonTypes, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getClassesTree({ payload,callback }, { call, put }) {
        let res=yield call(getClassesTree, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getStudents({ payload,callback }, { call, put }) {
        let res=yield call(getStudents, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * addClassEvaluationType({ payload,callback }, { call, put }) {
        let res=yield call(addClassEvaluationType, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getEvaluationFlagDetail({ payload,callback }, { call, put }) {
        let res=yield call(getEvaluationFlagDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getApointGroup({ payload,callback }, { call, put }) {
        let res=yield call(getApointGroup, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * setEvaluationFlag({ payload,callback }, { call, put }) {
        let res=yield call(setEvaluationFlag, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * weekObtainList({ payload,callback }, { call, put }) {
        let res=yield call(weekObtainList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * flagObtainDetail({ payload,callback }, { call, put }) {
        let res=yield call(flagObtainDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * obtainFlag({ payload,callback }, { call, put }) {
        let res=yield call(obtainFlag, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },


      * flagDetailWeek({ payload,callback }, { call, put }) {
        let res=yield call(flagDetailWeek, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getWeekList({ payload,callback }, { call, put }) {
        let res=yield call(getWeekList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getMonthList({ payload,callback }, { call, put }) {
        let res=yield call(getMonthList, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },

      * getDailyDetail({ payload,callback }, { call, put }) {
        let res=yield call(getDailyDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
      * getWeekDetail({ payload,callback }, { call, put }) {
        let res=yield call(getWeekDetail, payload)
        if(callback && typeof callback === 'function'){
          callback(res)
        }
      },
      
    * getMonthDetail({ payload,callback }, { call, put }) {
      let res=yield call(getMonthDetail, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
      
    * getGradeByGroupId({ payload,callback }, { call, put }) {
      let res=yield call(getGradeByGroupId, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * addClassEvaluationGroup({ payload,callback }, { call, put }) {
      let res=yield call(addClassEvaluationGroup, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },

    * getClassEvaluationTypeDetail({ payload,callback }, { call, put }) {
      let res=yield call(getClassEvaluationTypeDetail, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
      
    * updateClassEvaluationType({ payload,callback }, { call, put }) {
      let res=yield call(updateClassEvaluationType, payload)
      if(callback && typeof callback === 'function'){
        callback(res)
      }
    },
      
    

    },
  
    reducers: {
     
    },
  
  };
  