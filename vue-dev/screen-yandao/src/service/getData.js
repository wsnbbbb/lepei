import fetch from '../config/fetch'
import {getStore} from '../config/mUtils'

const baseUrl = 'http://171.221.228.25:920222'

export const getStudentLeave = (param) => fetch(baseUrl + '/exhibition/student-leave/statistics', param ,'POST');
export const getTeacherLeave = (param) => fetch(baseUrl + '/exhibition/teacher-leave/statistics', param ,'POST');
export const getConsume = (param) => fetch(baseUrl + '/exhibition/school-data/semester-consume', param ,'POST');
export const getYzFinancial = (param) => fetch(baseUrl + '/exhibition/school-data/new-yizhou-financial', param ,'POST');
export const getYzFinancialWeekRecord = (param) => fetch(baseUrl + '/exhibition/school-data/new-yizhou-financial-week-record', param ,'POST');
export const getClassCard = (param) => fetch(baseUrl + '/exhibition/school-data/class-card', param ,'POST');
export const getSchoolSurvey = (param) => fetch(baseUrl + '/exhibition/school-data/school-survey', param ,'POST');
export const getNewRepair = (param) => fetch(baseUrl + '/exhibition/school-data/new-repair', param ,'POST');
export const getPublish = (param) => fetch(baseUrl + '/exhibition/school-data/information-publish-statistics', param ,'POST');
export const getOpinion = (param) => fetch(baseUrl + '/exhibition/school-data/opinion', param ,'POST');
export const getTodayAttendance = (param) => fetch(baseUrl + '/exhibition/school-data/today-attendance', param ,'POST');
export const getTeacherTrain = (param) => fetch(baseUrl + '/exhibition/school-data/teacher-train', param ,'POST');
export const getPosition = (param) => fetch(baseUrl + '/exhibition/school-data/module-position', param ,'POST');
export const getTodayScoreRecords = (param) => fetch(baseUrl + '/exhibition/moral-education-evaluation/today-score-records', param ,'POST');
export const getLastWeekScore = (param) => fetch(baseUrl + '/exhibition/moral-education-evaluation/last-week-score', param ,'POST');
export const getFlag = (param) => fetch(baseUrl + '/exhibition/school-data/moral-education-evaluation-flag', param ,'POST');
export const getEvaluationShow = (param) => fetch(baseUrl + '/exhibition/school-data/special-moral-education-evaluation-show', param ,'POST');



