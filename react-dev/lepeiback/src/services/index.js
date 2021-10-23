import request from '../utils/request';
import { baseUrl } from '../config'

// 海康门禁
export const hikVision=(params)=> {
  return request(`${baseUrl}/manager/hik-vision/index`,{
    method:'GET',
  });
}
// 长虹系统
export const changhongSystem=(params)=> {
  return request(`${baseUrl}/manager/changhong/index`,{
    method:'GET',
  });
}
// 阅卷系统
export const readPaperSystem=(params)=> {
  return request(`${baseUrl}/manager/read-paper/index`,{
    method:'GET',
  });
}
// 微耕门禁
export const weigen=(params)=> {
  return request(`${baseUrl}/pub/users/get-local-server-user-info`,{
    method:'GET',
  });
}
// 电子班牌
export const classBrand=(params)=> {
  return request(`${baseUrl}/pub/users/get-class-card-server-user-info`,{
    method:'GET',
  });
}
// 元高分
export const yuangaofen=(params)=> {
  return request(`${baseUrl}/manager/yuangaofen`,{
    method:'GET',
  });
}
// 凡龙
export const vanlon=(params)=> {
  return request(`${baseUrl}/manager/vanlon-record`,{
    method:'GET',
  });
}
// 获取所有学校
export const getAllSchool=(params)=> {
  return request(`${baseUrl}/pub/schools/list`,{
    method:'GET',
  });
}
// 获取学校详情
export const getSchool=(params)=> {
  return request(`${baseUrl}/pub/schools/${params.schoolId}`,{
    method:'GET',
  });
}
// 获取短信验证码
export const getCode=(params)=> {
  return request(`${baseUrl}/pub/message/get-verification-code`,{
    method:'GET',
    urlParam:params
  });
}
// 短信验证码校验
export const checkCode=(params)=> {
  return request(`${baseUrl}/manager/school-user/check-verification-code`,{
    method:'POST',
    urlParam:params
  });
}
// 获取七牛上传token
export const getPicToken=(params)=> {
  return request(`${baseUrl}/pub/upload/get-qiniu-token`,{
    method:'GET',
  });
}
// 登录
export const getLogin=(params)=> {
  return request(`${baseUrl}/pub/users/login`,{
    method:'POST',
    urlParam:(params)
  });
}
// 华阳中学登录
export const jumpLogin=(params)=> {
  return request(`${baseUrl}/pub/users/hy-school-sso-login`,{
    method:'POST',
    urlParam:params
  });
}
// 获取所有年级
export const getGradeName=(params)=> {
  // if(!params){
  //   return request(`${baseUrl}/pub/grades/get-grades-by-type`,{
  //     method:'GET',
  //   });
  // }else{
    return request(`${baseUrl}/pub/grades/get-grades-by-type`,{
      method:'GET',
      urlParam:params
    });
  // }
}
// 获取指定年级下的班级
export const getClassName=(params)=> {
  return request(`${baseUrl}/pub/classes/get-classes-by-grade-id`,{
    method:'GET',
    urlParam:params
  });
}
// 获取所有教职工
export const getTeachersAndWorks=(params)=> {
  return request(`${baseUrl}/pub/persons/get-teacher-staffs`,{
    method:'GET',
    urlParam:params
  });
}
// 获取所有学生
export const getStudents=(params)=> {
  return request(`${baseUrl}/manager/persons/students`,{
    method:'GET',
    urlParam:params
  });
}
// 获取行政班所属班级（含年级及年级下对应的班级）
export const getClassByGrade=(params)=> {
  return request(`${baseUrl}/pub/classes/get-class-tree`,{
    method:'GET',
  });
}
// 获取所有职务
export const commonJobList=(params)=> {
  return request(`${baseUrl}/pub/job/get-job`,{
    method:'GET',
    // urlParam:params
  });
}
// 获取所有人员
export const commonPersonList=(params)=> {
  return request(`${baseUrl}/pub/persons/get-person`,{
    method:'GET',
    urlParam:params
  });
}
// 获取所有学业阶段
export const commonTypes=(params)=> {
  return request(`${baseUrl}/pub/grades/get-types`,{
    method:'GET',
    urlParam:params
  });
}
// 获取班级树状结构(学业阶段/年级/班级)
export const getClassesTree=(params)=> {
  return request(`${baseUrl}/pub/classes/get-classes-tree`,{
    method:'GET',
    urlParam:params
  });
}
// 获取所有年级
export const commonGradeList=(params)=> {
  return request(`${baseUrl}/pub/grades/get-grade`,{
    method:'GET',
    urlParam:params
  });
}
// 获取所有教室
export const getAllClassRooms=(params)=> {
  return request(`${baseUrl}/pub/place/get-classrooms`,{
    method:'GET',
    // urlParam:params
  });
}
// 获取所有场所
export const getAllRooms=(params)=> {
  return request(`${baseUrl}/pub/place/get-all-rooms`,{
    method:'GET',
    urlParam:params
  });
}
// 获取指定学校的所有后台账号
export const getAllSchoolUser=(params)=> {
  return request(`${baseUrl}/pub/school-user/get-users`,{
    method:'GET',
    // urlParam:params
  });
}
// 获取所有的建筑
export const getAllBuildings=(params)=> {
  return request(`${baseUrl}/pub/place/get-builds`,{
    method:'GET',
    // urlParam:params
  });
}
// 获取指定建筑下的所有场所form
export const getAllPlacesByBuild=(params)=> {
  return request(`${baseUrl}/pub/place/get-places-by-build`,{
    method:'GET',
    urlParam:params
  });
}
// 账号管理
export const getInformation=(params)=> {
  return request(`${baseUrl}/manager/school-user`,{
    method:'GET',
    // urlParam:params
  });
}
export const updateInformation=(params)=> {
  return request(`${baseUrl}/manager/school-user/update-info`,{
    method:'POST',
    urlParam:params
  });
}
export const updatePsd=(params)=> {
  return request(`${baseUrl}/manager/school-user/${params.userId}`,{
    method:'PUT',
    urlParam:params
  });
}
export const verifiyCode=(params)=> {
  return request(`${baseUrl}/manager/school-user/check-verification-code`,{
    method:'POST',
    urlParam:params
  });
}
export const bindCount=(params)=> {
  return request(`${baseUrl}/manager/school-user/bind`,{
    method:'POST',
    urlParam:params
  });
}
export const unbindCount=(params)=> {
  return request(`${baseUrl}/manager/school-user/unbind`,{
    method:'POST',
    urlParam:params
  });
}

// 年级管理
export const gradeList=(params)=> {
  return request(`${baseUrl}/manager/grades`,{
    method:'GET',
    urlParam:params
  });
}
export const deleteGrade=(params)=> {
  const gradeId=params.gradeId;
  return request(`${baseUrl}/manager/grades/${gradeId}`,{
    method:'DELETE',
  });
}
export const addGrade=(params)=> {
  delete params.gradeId
  return request(`${baseUrl}/manager/grades`,{
    method:'POST',
    urlParam:params
  });
}
export const updateGrade=(params)=> {
  const id=params.gradeId
  delete params.gradeId
  return request(`${baseUrl}/manager/grades/${id}`,{
    method:'PUT',
    urlParam:params
  });
}
// 职务管理
export const jobList=(params)=> {
  return request(`${baseUrl}/manager/jobs`,{
    method:'GET',
    urlParam:params
  });
}
export const deleteJob=(params)=> {
  return request(`${baseUrl}/manager/jobs/${params.jobId}`,{
    method:'DELETE',
  });
}
export const addJob=(params)=> {
  return request(`${baseUrl}/manager/jobs`,{
    method:'POST',
    urlParam:params
  });
}
export const updateJob=(params)=> {
  const id=params.jobId;
  delete params.jobId;
  return request(`${baseUrl}/manager/jobs/${id}`,{
    method:'PUT',
    urlParam:params
  });
}
export const jobDetail=(params)=> {
  return request(`${baseUrl}/manager/jobs/${params.jobId}`,{
    method:'GET'
  });
}
export const getAllNodes=(params)=> {
  return request(`${baseUrl}/manager/school-nodes/get-nodes`,{
    method:'GET',
    urlParam:params
  });
}

// 班级管理
export const classList=(params)=> {
  return request(`${baseUrl}/manager/classes`,{
    method:'GET',
    urlParam:params
  });
}
export const classDetail=(params)=> {
  return request(`${baseUrl}/manager/classes/${params.classId}`,{
    method:'GET',
  });
}
export const deleteClass=(params)=> {
  return request(`${baseUrl}/manager/classes/${params.classId}`,{
    method:'DELETE',
  });
}
export const addClass=(params)=> {
  return request(`${baseUrl}/manager/classes`,{
    method:'POST',
    urlParam:params
  });
}
export const updateClass=(params)=> {
  return request(`${baseUrl}/manager/classes/${params.classId}`,{
    method:'PUT',
    urlParam:params
  });
}
//学期管理
export const termList=(params)=> {
  return request(`${baseUrl}/manager/school-semesters`,{
    method:'GET',
    urlParam:params
  });
}
export const addTerm=(params)=> {
  return request(`${baseUrl}/manager/school-semesters`,{
    method:'POST',
    urlParam:params
  });
}
export const delTerm=(params)=> {
  return request(`${baseUrl}/manager/school-semesters/${params.semesterId}`,{
    method:'DELETE'
  });
}
// export const termDetail=(params)=> {
//   return request(`${baseUrl}/manager/school-semesters/${params.semesterId}`,{
//     method:'GET',
//     urlParam:params
//   });
// }
export const termDetail=(params)=> {
  return request(`${baseUrl}/manager/school-semesters/semester-view`,{
    method:'GET',
    urlParam:params
  });
}
// export const updateTerm=(params)=> {
//   return request(`${baseUrl}/manager/school-semesters/${params.semesterId}`,{
//     method:'PUT',
//     urlParam:params
//   });
// }
export const updateTerm=(params)=> {
  return request(`${baseUrl}/manager/school-semesters/semester-update`,{
    method:'POST',
    urlParam:params
  });
}
export const getCalendar=(params)=> {
  return request(`${baseUrl}/manager/school-calendars/get-detail`,{
    method:'GET',
    urlParam:params
  });
}
export const addCalendar=(params)=> {
  return request(`${baseUrl}/manager/school-calendars/set-calendar`,{
    method:'POST',
    urlParam:params
  });
}
// 人员管理
export const personList=(params)=> {
  return request(`${baseUrl}/manager/persons`,{
    method: 'GET',
    urlParam: params
  });
}
export const personDetail=(params)=> {
  return request(`${baseUrl}/manager/persons/${params.personId}`,{
    method:'GET',
  });
}
export const delPerson=(params)=> {
  return request(`${baseUrl}/manager/persons/${params.personId}`,{
    method:'DELETE'
  });
}
export const delAllPerson=(params)=> {
  return request(`${baseUrl}/manager/persons/batch-delete`,{
    method:'POST',
    urlParam:params
  });
}
export const createPerson=(params)=> {
  return request(`${baseUrl}/manager/persons`,{
    method:'POST',
    urlParam:params
  });
}
export const updatePerson=(params)=> {
  return request(`${baseUrl}/manager/persons/${params.personId}`,{
    method:'PUT',
    urlParam:params
  });
}
// 班干部管理
export const classLeaderList=(params)=> {
  return request(`${baseUrl}/manager/class-cadre`,{
    method:'GET',
    urlParam:params
  });
}
export const deleteClassLeader=(params)=> {
  const gradeId=params.id;
  return request(`${baseUrl}/manager/class-cadre/${gradeId}`,{
    method:'DELETE',
  });
}
export const addClassLeader=(params)=> {
  return request(`${baseUrl}/manager/class-cadre`,{
    method:'POST',
    urlParam:params
  });
}
export const updateClassLeader=(params)=> {
  const id=params.id
  delete params.gradeId
  return request(`${baseUrl}/manager/class-cadre/${id}`,{
    method:'PUT',
    urlParam:params
  });
}
//部门管理
export const departmentList=(params)=> {
  return request(`${baseUrl}/manager/departments`,{
    method:'GET',
    urlParam:params
  });
}
// 部门树状结构
export const departmentTree = (params) => {
  return request(`${baseUrl}/pub/department/list-tree`,{
    method:'GET',
    urlParam:params
  });
}
export const addDepartment=(params)=> {
  return request(`${baseUrl}/manager/departments`,{
    method:'POST',
    urlParam:params
  });
}
export const departmentDetail=(params)=> {
  return request(`${baseUrl}/manager/departments/${params.departmentId}`,{
    method:'GET',
    // urlParam:params
  });
}

export const updateDepartment=(params)=> {
  return request(`${baseUrl}/manager/departments/${params.departmentId}`,{
    method:'PUT',
    urlParam:params
  });
}
export const delDepartment=(params)=> {
  return request(`${baseUrl}/manager/departments/${params.departmentId}`,{
    method:'DELETE',
  });
}
export const delDepartmentPerson=(params)=> {
  return request(`${baseUrl}/manager/departments/unbind`,{
    method:'POST',
    urlParam:params
  });
}
export const addDepartmentPerson=(params)=> {
  return request(`${baseUrl}/manager/departments/batch-bind`,{
    method:'POST',
    urlParam:params
  });
}
export const delAllDepartmentPerson=(params)=> {
  return request(`${baseUrl}/manager/departments/batch-unbind`,{
    method:'POST',
    urlParam:params
  });
}
export const changeDepartment = (params) => {
  return request(`${baseUrl}/manager/departments/change-person-department`,{
    method:'POST',
    urlParam:params
  });
}
export const setManager = (params) => {
  return request(`${baseUrl}/manager/departments/change-person-status`,{
    method:'POST',
    urlParam:params
  });
}
export const getAllPerson = (params) => {
  return request(`${baseUrl}/pub/persons/teacher-list`,{
    method:'GET',
    urlParam:params
  });
}
export const batchAddTeacher = (params) => {
  return request(`${baseUrl}/manager/departments/batch-bind`,{
    method:'POST',
    urlParam:params
  });
}
//建筑管理
export const getBuildings = (params) => {
  return request(`${baseUrl}/pub/place/get-buildings-by-type`,{
    method:'GET',
    urlParam:params
  });
}
export const buildingList=(params)=> {
  return request(`${baseUrl}/manager/school-build`,{
    method:'GET',
    urlParam:params
  });
}
export const addBuilding=(params)=> {
  return request(`${baseUrl}/manager/school-build`,{
    method:'POST',
    urlParam:params
  });
}
export const editBuilding=(params)=> {
  const id=params.buildId
  return request(`${baseUrl}/manager/school-build/${id}`,{
    method:'PUT',
    urlParam:params
  });
}
export const deleteBuilding=(params)=> {
  const id=params.buildId
  return request(`${baseUrl}/manager/school-build/${id}`,{
    method:'DELETE',
    urlParam:params
  });
}
export const buildDetail=(params)=> {
  const id=params.buildId
  return request(`${baseUrl}/manager/school-build/${id}`,{
    method:'GET',
  });
}
//场所管理
export const placeList=(params)=> {
  return request(`${baseUrl}/manager/school-place`,{
    method:'GET',
    urlParam:params
  });
}
export const placeDetail=(params)=> {
  const id=params.placeId
  return request(`${baseUrl}/manager/school-place/${id}`,{
    method:'GET',
  });
}
export const importPlace = (params) => {
  return request(`${baseUrl}/manager/school-place/import`,{
    method:'POST',
    urlParam:params,
    formdata: true
  });
}
export const addPlace=(params)=> {
  return request(`${baseUrl}/manager/school-place`,{
    method:'POST',
    urlParam:params
  });
}
export const deletePlace=(params)=> {
  const id=params.placeId
  return request(`${baseUrl}/manager/school-place/${id}`,{
    method:'DELETE',
    urlParam:params
  });
}
export const deleteArrPlace=(params)=> {
  return request(`${baseUrl}/manager/school-place/batch-delete`,{
    method:'POST',
    urlParam:params
  });
}
export const editPlace=(params)=> {
  const id=params.placeId
  return request(`${baseUrl}/manager/school-place/${id}`,{
    method:'PUT',
    urlParam:params
  });
}

//课表管理
export const getClassTree=(params)=> {
  const id=params.placeId
  return request(`${baseUrl}/pub/classes/get-class-tree`,{
    method:'GET',
    urlParam:params
  });
}

export const updateWeekSchedule=(params)=> {
  return request(`${baseUrl}/manager/schedules/make-week-schedule`,{
    method:'GET',
    urlParam:params
  });
}

export const getSchedules=(params)=> {
  return request(`${baseUrl}/manager/schedules`,{
    method:'GET',
    urlParam:params
  });
}

export const getScheduleDetail = (params)=> {
  return request(`${baseUrl}/manager/schedules/get-schedule-detail`,{
    method:'GET',
    urlParam:params
  });
}

export const updateSchedules=(params)=> {
  return request(`${baseUrl}/manager/schedules/update-class-schedule`,{
    method:'POST',
    urlParam:params
  });
}

export const getSubject=(params)=> {
  return request(`${baseUrl}/manager/school-subject`,{
    method:'GET',
    urlParam:params
  });
}

export const getAllSubject=(params)=> {
  return request(`${baseUrl}/pub/subject/get-subjects`,{
    method:'GET',
    urlParam:params
  });
}

export const getTeacher=(params)=> {
  return request(`${baseUrl}/manager/persons`,{
    method:'GET',
    urlParam:params
  });
}


export const saveSchedules=(params)=> {
  return request(`${baseUrl}/manager/schedules`,{
    method:'POST',
    urlParam:params
  });
}
export const createSchedule=(params)=> {
  return request(`${baseUrl}/manager/course/create-schedule`,{
    method:'POST',
    urlParam: params
  });
}

//课表查询
export const getStudent=(params)=> {
  return request(`${baseUrl}/manager/persons`,{
    method:'GET',
    urlParam:params
  });
}

export const getSemesters=(params)=> {
  return request(`${baseUrl}/manager/school-semesters`,{
    method:'GET',
    urlParam:params
  });
}

export const queryStudentSchedule=(params)=> {
  return request(`${baseUrl}/manager/schedules/student-schedule`,{
    method:'GET',
    urlParam:params
  });
}

export const queryTeacherSchedule=(params)=> {
  return request(`${baseUrl}/manager/schedules/teacher-schedule`,{
    method:'GET',
    urlParam:params
  });
}

export const queryClassSchedule=(params)=> {
  return request(`${baseUrl}/manager/schedules/classroom-schedule`,{
    method:'GET',
    urlParam:params
  });
}

export const getClassRoom=(params)=> {
  return request(`${baseUrl}/manager/school-place`,{
    method:'GET',
    urlParam:params
  });
}

export const uploadSchedules=(params)=> {
  return request(`${baseUrl}/manager/schedules/upload`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}

export const getScheduleConfig=(params)=> {
  return request(`${baseUrl}/manager/schedules/get-schedule-config`,{
    method:'GET',
    urlParam: params
  });
}

export const setScheduleConfig=(params)=> {
  return request(`${baseUrl}/manager/schedules/set-schedule-config`,{
    method:'POST',
    urlParam: params
  });
}

export const getweeksBySemester=(params)=> {
  return request(`${baseUrl}/manager/schedules/get-weeks-by-semester`,{
    method:'GET',
    urlParam: params
  });
}
export const scheduleSync=(params)=> {
  return request(`${baseUrl}/manager/changhong/sync-schedules`,{
    method:'GET',
    urlParam: params
  });
}
export const scheduleSync1=(params)=> {
  return request(`${baseUrl}/manager/seiue/sync-schedules`,{
    method:'GET',
    urlParam: params
  });
}

//班级空间
export const getAllgrade=(params)=> {
  return request(`${baseUrl}/pub/grades/get-grade`,{
    method:'GET',
    urlParam: params
  });
}

export const getClassesByGradeId=(params)=> {
  return request(`${baseUrl}/pub/classes/get-classes-by-grade-id`,{
    method:'GET',
    urlParam: params
  });
}

export const getAllClasses=(params)=> {
  return request(`${baseUrl}/manager/classes`,{
    method:'GET',
    urlParam: params
  });
}

export const getStyleDetail=(params)=> {
  return request(`${baseUrl}/manager/student-style/detail`,{
    method:'GET',
    urlParam: params
  });
}

export const deleteStyle=(params)=> {
  const id=params.studentStyleId
  return request(`${baseUrl}/manager/student-style/${id}`,{
    method:'DELETE'
  });
}

export const showPublishers=(params)=> {
  return request(`${baseUrl}/manager/student-style/show-publishers`,{
    method:'GET',
    urlParam: params
  });
}

export const setPublishers=(params)=> {
  return request(`${baseUrl}/manager/student-style/set-publishers`,{
    method:'POST',
    urlParam: params
  });
}

export const studentStyle=(params)=> {
  return request(`${baseUrl}/manager/student-style`,{
    method:'GET',
    urlParam: params
  });
}

//工资条管理
export const getSalaryList=(params)=> {
  return request(`${baseUrl}/manager/salary`,{
  method:'GET',
  urlParam: params
  });
}
export const publishSalary=(params)=> {
  return request(`${baseUrl}/manager/salary/publish`,{
  method:'POST',
  urlParam: params
  });
}
export const delSalary=(params)=> {
  const salaryId=params.salaryId
  return request(`${baseUrl}/manager/salary/${salaryId}`,{
  method:'DELETE',
  urlParam: params
  });
}
export const uploadSalary=(params)=> {
  return request(`${baseUrl}/manager/salary/import`,{
  method:'POST',
  urlParam: params,
  formdata: true
  });
}
export const getSalaryDetail=(params)=> {
  const salaryId=params.salaryId
  return request(`${baseUrl}/manager/salary/${salaryId}`,{
  method:'GET',
  urlParam: params,
  });
}
export const delPersonSalary=(params)=> {
  return request(`${baseUrl}/manager/salary/person-salary-delete`,{
  method:'POST',
  urlParam: params,
  });
}
export const updateSalaryRemark=(params)=> {
  return request(`${baseUrl}/manager/salary/update-remark`,{
  method:'POST',
  urlParam: params,
  });
}
export const updateSalaryItem=(params)=> {
  return request(`${baseUrl}/manager/salary/item-update`,{
  method:'POST',
  urlParam: params,
  });
}
export const updateSalaryTitle=(params)=> {
  const salaryId=params.salaryId
  return request(`${baseUrl}/manager/salary/${salaryId}`,{
  method:'PUT',
  urlParam: params,
  });
}

//系统设置
export const getAccount=(params)=> {
  return request(`${baseUrl}/manager/account`,{
  method:'GET',
  urlParam: params,
  });
}

export const addAccount=(params)=> {
  return request(`${baseUrl}/manager/account`,{
  method:'POST',
  urlParam: params,
  });
}

export const accountDetail=(params)=> {
  const userId=params.userId
  return request(`${baseUrl}/manager/account/${userId}`,{
  method:'GET',
  });
}

export const updateAccount=(params)=> {
  const userId=params.userId
  return request(`${baseUrl}/manager/account/${userId}`,{
  method:'PUT',
  urlParam: params,
  });
}

export const deleteAccount=(params)=> {
  const userId=params.userId
  return request(`${baseUrl}/manager/account/${userId}`,{
  method:'DELETE',
  urlParam: params,
  });
}
//批量导入
export const uploadStaff=(params)=> {
  return request(`${baseUrl}/manager/persons/person-import`,{
  method:'POST',
  urlParam: params,
  formdata: true
  });
}
export const uploadStudents=(params)=> {
  return request(`${baseUrl}/manager/persons/student-import`,{
  method:'POST',
  urlParam: params,
  formdata: true
  });
}
export const uploadGrade=(params)=> {
  return request(`${baseUrl}/manager/grades/import`,{
  method:'POST',
  urlParam: params,
  formdata: true
  });
}
export const uploadClasses=(params)=> {
  return request(`${baseUrl}/manager/classes/class-import`,{
  method:'POST',
  urlParam: params,
  formdata: true
  });
}
export const uploadTeacher=(params)=> {
  return request(`${baseUrl}/manager/classes/relation-import`,{
  method:'POST',
  urlParam: params,
  formdata: true
  });
}
// 教职工请假
export const getApplyLeave=(params)=> {
  return request(`${baseUrl}/manager/apply-leave`,{
    method:'GET',
    urlParam: params,
  });
}
export const delLeaveApply=(params)=> {
  const applyLeaveId=params.applyLeaveId
  return request(`${baseUrl}/manager/apply-leave/${applyLeaveId}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const leaveDetail=(params)=> {
  return request(`${baseUrl}/manager/apply-leave/apply-record`,{
    method:'GET',
    urlParam: params,
  });
}
// 退出登录
export const loginOut=(params)=> {
  return request(`${baseUrl}/pub/users/logout`,{
    method:'GET',
    urlParam: params,
  });
}
export const logOff=(params)=> {
  return request(`${baseUrl}/other/hy-school/home`,{
    method:'GET',
    urlParam: params,
  });
}
// 请假类型
export const getLeaveType=(params)=> {
  return request(`${baseUrl}/manager/apply-leave-type`,{
    method:'GET',
    urlParam: params,
  });
}
export const getLeaveTypeDetail=(params)=> {
  return request(`${baseUrl}/manager/apply-leave-type/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const delLeaveType=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/apply-leave-type/${typeId}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getLeaveRule=(params)=> {
  return request(`${baseUrl}/manager/apply-leave-rule`,{
    method:'GET',
    urlParam: params,
  });
}
export const addLeaveRule=(params)=> {
  return request(`${baseUrl}/manager/apply-leave-rule`,{
    method:'POST',
    urlParam: params,
  });
}
export const getLeaveRuleDetail=(params)=> {
  const ruleId=params.ruleId
  return request(`${baseUrl}/manager/apply-leave-rule/${ruleId}`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateLeaveRuleDetail=(params)=> {
  const ruleId=params.ruleId
  return request(`${baseUrl}/manager/apply-leave-rule/${ruleId}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delLeaveRule=(params)=> {
  const ruleId=params.ruleId
  return request(`${baseUrl}/manager/apply-leave-rule/${ruleId}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const addLeaveType=(params)=> {
  return request(`${baseUrl}/manager/apply-leave-type`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateLeaveType=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/apply-leave-type/${typeId}`,{
    method:'PUT',
    urlParam: params,
  });
}
// 请假概况（图表）
export const getLeaveBarData=(params)=> {
  return request(`${baseUrl}/manager/apply-leave/get-bar-data`,{
    method:'GET',
    urlParam: params,
  });
}
export const getLeavePieData=(params)=> {
  return request(`${baseUrl}/manager/apply-leave/get-pie-data`,{
    method:'GET',
    urlParam: params,
  });
}
// 教室申请
export const getRoomApply=(params)=> {
  return request(`${baseUrl}/manager/room-apply`,{
    method:'GET',
    urlParam: params,
  });
}
export const getApplyHandlers=(params)=> {
  return request(`${baseUrl}/manager/room-apply/get-rule`,{
    method:'GET',
    urlParam: params,
  });
}
export const setApplyHandlers=(params)=> {
  return request(`${baseUrl}/manager/room-apply/set-rule`,{
    method:'POST',
    urlParam: params,
  });
}
export const getRoomApplyDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/room-apply/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const delRoomApply=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/room-apply/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getRoomBarData=(params)=> {
  return request(`${baseUrl}/manager/room-apply/room-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const getRoomApplyNum=(params)=> {
  return request(`${baseUrl}/manager/room-apply/applicant-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
// 报事报修
export const getRepairList=(params)=> {
  return request(`${baseUrl}/manager/repair`,{
    method:'GET',
    urlParam: params,
  });
}
export const getRepairTypeList=(params)=> {
  return request(`${baseUrl}/manager/repair-type`,{
    method:'GET',
    urlParam: params,
  });
}
export const addRepairType=(params)=> {
  return request(`${baseUrl}/manager/repair-type`,{
    method:'POST',
    urlParam: params,
  });
}
export const getRepairTypeDetail=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/repair-type/${typeId}`,{
    method:'GET',
    urlParam: params,
  });
}
export const editRepairType=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/repair-type/${typeId}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delRepairType=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/repair-type/${typeId}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const delRepairApply=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/repair/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getAllRepairTypes=(params)=> {
  return request(`${baseUrl}/manager/repair-type/get-types`,{
    method:'GET',
    urlParam: params,
  });
}
export const getRepairApplyDetail=(params)=> {
  const repairId=params.repairId
  return request(`${baseUrl}/manager/repair/${repairId}`,{
    method:'GET',
  });
}
export const getRepairBarData=(params)=> {
  return request(`${baseUrl}/manager/repair/records-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const getRepairPieData=(params)=> {
  return request(`${baseUrl}/manager/repair/records-type-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const getRepairApplicant=(params)=> {
  return request(`${baseUrl}/manager/repair/records-applicant-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const getRepairAddress=(params)=> {
  return request(`${baseUrl}/manager/repair/records-address-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
// 一卡通开卡
export const getPersonCard=(params)=> {
  return request(`${baseUrl}/manager/person-card`,{
    method:'GET',
    urlParam: params,
  });
}
export const openPersonCard=(params)=> {
  return request(`${baseUrl}/manager/person-card/open-card`,{
    method:'POST',
    urlParam: params,
  });
}
export const uploadPersonCard=(params)=> {
  return request(`${baseUrl}/manager/person-card/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
// 卡片管理
export const getPeopleCard=(params)=> {
  return request(`${baseUrl}/manager/ic-card/get-person`,{
    method:'GET',
    urlParam: params,
  });
}
export const getCardData=(params)=> {
  return request(`${baseUrl}/manager/ic-card/get-card`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStRechargeDetail=(params)=> {
  return request(`${baseUrl}/manager/st-card/customer-recharge`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSxRechargeDetail=(params)=> {
  return request(`${baseUrl}/manager/sx-card/person-recharge-query`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStCustomerConsumeDetail=(params)=> { //商通客户消费金额查询
  return request(`${baseUrl}/manager/st-card/customer-consume`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStCustomerConsumeByTimesDetail=(params)=> { //商通客户计次消费查询
  return request(`${baseUrl}/manager/st-card/customer-consume-by-times`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSxCustomerConsumeDetail=(params)=> {
  return request(`${baseUrl}/manager/sx-card/person-consume-query`,{
    method:'GET',
    urlParam: params,
  });
}
export const getCustomerCircleDetail=(params)=> {
  return request(`${baseUrl}/manager/sx-card/person-circle-query`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStIcCircleDetail=(params)=> { //商通ic卡金额圈存查询
  return request(`${baseUrl}/manager/st-card/card-circle`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStIcCircleByTimesDetail=(params)=> { //商通ic卡计次圈存查询
  return request(`${baseUrl}/manager/st-card/card-circle-by-times`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSxIcCircleDetail=(params)=> {
  return request(`${baseUrl}/manager/sx-card/ic-circle-query`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStIcConsumeDetail=(params)=> { //商通ic卡消费金额查询
  return request(`${baseUrl}/manager/st-card/card-consume`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStIcConsumeByTimesDetail=(params)=> {//商通ic卡计次消费查询
  return request(`${baseUrl}/manager/st-card/card-consume-by-times`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSxIcConsumeDetail=(params)=> {
  return request(`${baseUrl}/manager/sx-card/ic-consume-query`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStIcBalance=(params)=> {
  return request(`${baseUrl}/manager/st-card/balance-info`,{
    method:'GET',
    urlParam: params,
  });
}
export const setStIcConsumeLimit=(params)=> {
  return request(`${baseUrl}/manager/st-card/set-consume-limit`,{
    method:'POST',
    urlParam: params,
  });
}
export const getStIcConsumeLimitDetail=(params)=> {
  return request(`${baseUrl}/manager/st-card/consume-limit-info`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSxIcConsumeLimitDetail=(params)=> {
  return request(`${baseUrl}/manager/sx-card/get-ic-consume`,{
    method:'GET',
    urlParam: params,
  });
}
export const setSxIcConsumeLimit=(params)=> {
  return request(`${baseUrl}/manager/sx-card/ic-consume-set`,{
    method:'GET',
    urlParam: params,
  });
}
export const lePeiOperate=(params)=> {
  return request(`${baseUrl}/manager/lp-card/set`,{
    method:'POST',
    urlParam: params,
  });
}
export const getSxMoney=(params)=> {
  return request(`${baseUrl}/manager/sx-card/card-info-query`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStMoney=(params)=> {
  return request(`${baseUrl}/manager/st-card/cash-info`,{
    method:'GET',
    urlParam: params,
  });
}
export const getConsumeList = (params) => { // 天四消费概况列表
  return request(`${baseUrl}/manager/card-transaction-records`,{
    method:'GET',
    urlParam: params,
  });
}

//
export const accessList=(params)=> {
  return request(`${baseUrl}/manager/access`,{
  method:'GET',
  urlParam: params,
  });
}

export const getjobList=(params)=> {
  return request(`${baseUrl}/manager/jobs`,{
  method:'GET',
  urlParam: params,
  });
}

export const accessDetail=(params)=> {
  return request(`${baseUrl}/manager/access/get-detail`,{
  method:'GET',
  urlParam: params,
  });
}

export const allGrades=(params)=> {
  return request(`${baseUrl}/manager/grades`,{
  method:'GET',
  urlParam: params,
  });
}

export const updataAccredit=(params)=> {
  return request(`${baseUrl}/manager/access/accredit`,{
  method:'POST',
  urlParam: params,
  });
}

//过程性评价
export const templateList=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-template`,{
  method:'GET',
  urlParam: params,
  });
}

export const deleteTemplate=(params)=> {
  const templateId=params.templateId
  return request(`${baseUrl}/manager/student-evaluation-template/${templateId}`,{
  method:'DELETE',
  });
}

export const essentialList=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-template/special-points`,{
  method:'GET',
  urlParam: params,
  });
}

export const getAllTemplate=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-template/get-all-template`,{
  method:'GET',
  });
}

export const getAllSemesters=(params)=> {
  return request(`${baseUrl}/pub/semester/get-semesters`,{
  method:'GET',
  });
}

export const createTemplate=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-template`,{
  method:'POST',
  urlParam: params,
  });
}

export const deletePoint=(params)=> {
  const pointId=params.pointId
  return request(`${baseUrl}/manager/student-evaluation-points/${pointId}`,{
    method:'DELETE',
  });
}

export const pointDetail=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-points/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const getPointTeacher=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-points/get-point-teacher`,{
    method:'GET',
  });
}
export const getPointTeacher1=(params)=> {
  return request(`${baseUrl}/pub/persons/get-teacher-staffs`,{
    method:'GET',
    urlParam: params,
  });
}
export const updatePoint=(params)=> {
  const pointId=params.pathId
  return request(`${baseUrl}/manager/student-evaluation-points/${pointId}`,{
  method:'PUT',
  urlParam: params,
  });
}
export const templateDetail=(params)=> {
  const pointId=params.pathId
  return request(`${baseUrl}/manager/student-evaluation-template/template-detail`,{
  method:'GET',
  urlParam: params,
  });
}
export const personRecordDetail=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/person-record-detail`,{
  method:'GET',
  urlParam: params,
  });
}
export const studentTemplateDetail=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-template/detail`,{
  method:'GET',
  urlParam: params,
  });
}
export const editTemplate=(params)=> {
  const id=params.templateId
  return request(`${baseUrl}/manager/student-evaluation-template/${id}`,{
  method:'PUT',
  urlParam: params,
  });
}

export const getQuotas=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-quotas/get-quotas`,{
    method:'GET',
    urlParam: params,
  });
}
export const addQuotas=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-quotas`,{
    method:'POST',
    urlParam: params,
  });
}
export const addPoint=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-points`,{
    method:'POST',
    urlParam: params,
  });
}
export const editQuota=(params)=> {
  const pathId=params.pathId
  return request(`${baseUrl}/manager/student-evaluation-points/${pathId}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const groupRecordDetail=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/group-record-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const groupPointRank=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/group-point-rank`,{
    method:'GET',
    urlParam: params,
  });
}

export const personPieData=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/person-pie-data`,{
    method:'GET',
    urlParam: params,
  });
}
export const studentPointRank=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/student-point-rank`,{
    method:'GET',
    urlParam: params,
  });
}

// 班级通知
export const getClassNotice=(params)=> {
  return request(`${baseUrl}/manager/class-notice`,{
    method:'GET',
    urlParam: params,
  });
}
export const getReceipt=(params)=> {
  return request(`${baseUrl}/manager/class-notice/read-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const setClassNotice=(params)=> {
  return request(`${baseUrl}/manager/class-notice`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateClassNotice=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/class-notice/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const classNoticeDetail=(params)=> {
  const id = params.id
  return request(`${baseUrl}/manager/class-notice/${id}`,{
    method:'GET',
  });
}
export const delClassNotice=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/class-notice/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const classNoticeBarData=(params)=> {
  return request(`${baseUrl}/manager/class-notice/get-bar-data`,{
    method:'GET',
    urlParam: params,
  });
}
export const classNoticeList=(params)=> {
  return request(`${baseUrl}/manager/class-notice/get-statistics-data`,{
    method:'GET',
    urlParam: params,
  });
}
export const classNoticePublisher=(params)=> {
  return request(`${baseUrl}/manager/class-notice/records-publisher-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
// 食堂菜谱
export const canteenMenuList=(params)=> {
  return request(`${baseUrl}/manager/canteen-menu`,{
    method:'GET',
    urlParam: params,
  });
}
export const canteenMenuDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/canteen-menu/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const createCanteenMenu=(params)=> {
  return request(`${baseUrl}/manager/canteen-menu`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateCanteenMenu=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/canteen-menu/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delCanteenMenu=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/canteen-menu/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
// 科目管理
export const getSubjectList=(params)=> {
  return request(`${baseUrl}/manager/school-subject`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSubjectDetail=(params)=> {
  const id=params.subjectId
  return request(`${baseUrl}/manager/school-subject/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const createSubject=(params)=> {
  return request(`${baseUrl}/manager/school-subject`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateSubject=(params)=> {
  const id=params.subjectId
  return request(`${baseUrl}/manager/school-subject/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delSubject=(params)=> {
  const id=params.subjectId
  return request(`${baseUrl}/manager/school-subject/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}

//班级统计
export const classScoreDetail=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/class-score-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const classPointDetail=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/class-point-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const classPointRank=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/class-point-rank`,{
    method:'GET',
    urlParam: params,
  });
}
export const personScoredetail=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/person-score-detail`,{
    method:'GET',
    urlParam: params,
  });
}

export const personScore=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/person-score`,{
    method:'GET',
    urlParam: params,
  });
}

export const groupList=(params)=> {
  return request(`${baseUrl}/manager/student-evaluation-statistics/group-list`,{
    method:'GET',
    urlParam: params,
  });
}



export const deleteQuotas=(params)=> {
  const quotaId=params.quotaId
  return request(`${baseUrl}/manager/student-evaluation-quotas/${quotaId}`,{
    method:'DELETE',
  });
}

export const deletePoint1=(params)=> {
  const pointId=params.pointId
  return request(`${baseUrl}/manager/student-evaluation-points/${pointId}`,{
    method:'DELETE',
  });
}
export const getPointByQuota=(params)=> {
  const pointId=params.pointId
  return request(`${baseUrl}/manager/student-evaluation-points/get-point-by-quota`,{
    method:'GET',
    urlParam: params,
  });
}
// 班级考评
export const getGradeScoreBar=(params)=> {
  return request(`${baseUrl}/manager/class-score/grade-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const getClassScoreBar=(params)=> {
  return request(`${baseUrl}/manager/class-score/class-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const getClassScoreList=(params)=> {
  return request(`${baseUrl}/manager/class-score/statistics-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getClassScoreType=(params)=> {
  return request(`${baseUrl}/manager/class-score-type`,{
    method:'GET',
    urlParam: params,
  });
}
export const delClassScoreType=(params)=> {
  const id=params.typeId
  return request(`${baseUrl}/manager/class-score-type/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getTermTypes=(params)=> {
  return request(`${baseUrl}/manager/class-score-type/get-types`,{
    method:'GET',
    urlParam: params,
  });
}
export const getTypeDetail=(params)=> {
  const id=params.typeId
  return request(`${baseUrl}/manager/class-score-type/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const getClassScoreDetail=(params)=> {
  return request(`${baseUrl}/manager/class-score/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const addClassScoreType=(params)=> {
  return request(`${baseUrl}/manager/class-score-type`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateClassScoreType=(params)=> {
  const id=params.typeId
  return request(`${baseUrl}/manager/class-score-type/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const getPubStudents=(params)=> {
  return request(`${baseUrl}/pub/persons/students`,{
    method:'GET',
    urlParam: params,
  });
}

export const getAllPubStudents=(params)=> {
  return request(`${baseUrl}/pub/persons/student-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const getApprovalRules=(params)=> {
  return request(`${baseUrl}/pub/approval-rules/list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSingleClassScore=(params)=> {
  return request(`${baseUrl}/manager/class-score/show-score`,{
    method:'GET',
    urlParam: params,
  });
}
export const setSingleClassScore=(params)=> {
  return request(`${baseUrl}/manager/class-score/update-score`,{
    method:'POST',
    urlParam: params,
  });
}
export const getClassScoreLog=(params)=> {
  return request(`${baseUrl}/manager/class-score/get-logs`,{
    method:'GET',
    urlParam: params,
  });
}

//学生请假
export const studenLeaveType=(params)=> {
  return request(`${baseUrl}/manager/student-leave-type`,{
    method:'GET',
    urlParam: params,
  })
}

export const studentLeaveList=(params)=> {
  return request(`${baseUrl}/manager/student-leave`,{
    method:'GET',
    urlParam: params,
  });
}

export const deleteLeaveRecord=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-leave/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}

export const leaveRecordDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-leave/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const studentLeaveType=(params)=> {
  return request(`${baseUrl}/manager/student-leave-type`,{
    method:'GET',
    urlParam: params,
  });
}
export const addStudentLeaveType=(params)=> {
  return request(`${baseUrl}/manager/student-leave-type`,{
    method:'POST',
    urlParam: params,
  });
}
export const deleteStudentLeaveType=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-leave-type/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const editStudentLeaveType=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-leave-type/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const getHandlers=(params)=> {
  return request(`${baseUrl}/manager/student-leave/get-handlers`,{
    method:'GET',
    urlParam: params,
  });
}
export const setHandlers=(params)=> {
  return request(`${baseUrl}/manager/student-leave/set-handlers`,{
    method:'POST',
    urlParam: params,
  });
}
export const recordsStatistics=(params)=> {
  return request(`${baseUrl}/manager/student-leave/records-statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const recordsTypeStatistics=(params)=> {
  return request(`${baseUrl}/manager/student-leave/records-type-statistics`,{
    method:'GET',
    urlParam: params,
  });
}

// 访客系统
export const getVisitList=(params)=> {
  return request(`${baseUrl}/manager/visit-records`,{
    method:'GET',
    urlParam: params,
  });
}
export const getVisitDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/visit-records/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateVisit=(params)=> {
  return request(`${baseUrl}/manager/visit-records/update-record`,{
    method:'POST',
    urlParam: params,
  });
}
// 教室通知
export const getRoomNotice=(params)=> {
  return request(`${baseUrl}/manager/room-notice`,{
    method:'GET',
    urlParam: params,
  });
}
export const roomNoticeDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/room-notice/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const setRoomNotice=(params)=> {
  return request(`${baseUrl}/manager/room-notice`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateRoomNotice=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/room-notice/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delRoomNotice=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/room-notice/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
// 顺势为手环(定位终端管理)
export const getSswPositionList=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-positions`,{
    method:'GET',
    urlParam: params,
  });
}
export const setSswPosition=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-positions`,{
    method:'POST',
    urlParam: params,
  });
}
export const delSswPosition=(params)=> {
  const id=params.positionId
  return request(`${baseUrl}/manager/shunshiwei-positions/delete-data?positionId=${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const sswPositionDetail=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-positions/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateSswPosition=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/shunshiwei-positions/update-data?positionId=${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
// 手环标签配置
export const getSswPersonMacList=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-person-mac`,{
    method:'GET',
    urlParam: params,
  });
}
export const sswPersonMacDetail=(params)=> {
  const id=params.personId
  return request(`${baseUrl}/manager/shunshiwei-person-mac/${id}`,{
    method:'GET',
    // urlParam: params,
  });
}
export const updateSswPersonMac=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-person-mac/update-mac`,{
    method:'POST',
    urlParam: params,
  });
}
export const setSswPersonMacInfo=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-person-mac/send-user-info`,{
    method:'POST',
    urlParam: params,
  });
}
export const sswPersonMacImport=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-person-mac/import`,{
    method:'POST',
    urlParam: params,
    formdata:true
  });
}
//社团选课
export const associationClassList=(params)=> {
  return request(`${baseUrl}/manager/course/get-course`,{
    method:'GET',
    urlParam: params,
  });
}
export const associationCourseList=(params)=> {
  return request(`${baseUrl}/manager/course/course-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getTeacherStaffs=(params)=> {
  return request(`${baseUrl}/pub/persons/get-teacher-staffs`,{
    method:'GET',
    urlParam: params,
  });
}
export const getClasses=(params)=> {
  return request(`${baseUrl}/manager/classes`,{
    method:'GET',
    urlParam: params,
  });
}
export const creatCourse=(params)=> {
  return request(`${baseUrl}/manager/course`,{
    method:'POST',
    urlParam: params,
  });
}
export const deleteCourse=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getChosenCourseStudent=(params)=> {
  return request(`${baseUrl}/manager/course/get-chosen-course-student`,{
    method:'GET',
    urlParam: params,
  });
}
export const getNotChosenCourseStudent=(params)=> {
  return request(`${baseUrl}/manager/course/get-not-chosen-course-student`,{
    method:'GET',
    urlParam: params,
  });
}
export const getChosenStudent=(params)=> {
  return request(`${baseUrl}/manager/course/get-chosen-student`,{
    method:'GET',
    urlParam: params,
  });
}
export const getPreStudent=(params)=> {
  return request(`${baseUrl}/manager/course/get-student`,{
    method:'GET',
    urlParam: params,
  });
}
export const preSetStudent=(params)=> {
  return request(`${baseUrl}/manager/course/pre-set-student`,{
    method:'POST',
    urlParam: params,
  });
}
export const courseDetail=(params)=> {
  return request(`${baseUrl}/manager/course/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateCourse=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const courseImport=(params)=> {
  return request(`${baseUrl}/manager/course/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}



// 手环状态查询
export const getSswPersonMacStatus=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-person-mac/get-person-mac`,{
    method:'GET',
    urlParam: params,
  });
}

export const getSswPersonMacData=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-mac-data/get-current-data`,{
    method:'GET',
    urlParam: params,
  });
}
// 手环数据查询
export const getSswTrackList=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-mac-data/get-track-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSswHeartList=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-mac-data/get-heart-rate-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSswHealthList=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-mac-data/get-health-list`,{
    method:'GET',
    urlParam: params,
  });
}
// 手环消息发送
export const getSswMessageList=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-message`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSswMessageDetail=(params)=> {
  const id=params.messageId
  return request(`${baseUrl}/manager/shunshiwei-message/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSswMessageRecordList=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-message/send-records-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSswResendMessage=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-message/re-send-message`,{
    method:'PUT',
    urlParam: params,
  });
}
export const addSswMessage=(params)=> {
  return request(`${baseUrl}/manager/shunshiwei-message`,{
    method:'POST',
    urlParam: params,
  });
}
export const delSswMessage=(params)=> {
  const id=params.messageId
  return request(`${baseUrl}/manager/shunshiwei-message/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getBlueToothAttendList=(params)=> {
  return request(`${baseUrl}/manager/attend-records`,{
    method:'GET',
    urlParam: params,
  });
}
export const getCurrentSemesterSections=(params)=> {
  return request(`${baseUrl}/pub/section/get-current-semester-sections`,{
    method:'GET',
  });
}

export const trustList=(params)=> {
  return request(`${baseUrl}/manager/trust`,{
    method:'GET',
    urlParam: params,
  });
}
export const creatTrust=(params)=> {
  return request(`${baseUrl}/manager/trust`,{
    method:'POST',
    urlParam: params,
  });
}
export const deleteTrust=(params)=> {
  const id=params.trustId
  return request(`${baseUrl}/manager/trust/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const trustDetail=(params)=> {
  return request(`${baseUrl}/manager/trust/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateTrust=(params)=> {
  const id=params.trustId
  return request(`${baseUrl}/manager/trust/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const trustRecords=(params)=> {
  return request(`${baseUrl}/manager/trust/records`,{
    method:'GET',
    urlParam: params,
  });
}

export const recordDetail=(params)=> {
  return request(`${baseUrl}/manager/trust/record-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const refund=(params)=> {
  return request(`${baseUrl}/manager/trust/refund`,{
    method:'POST',
    urlParam: params,
  });
}
// 易科士一卡通
export const yksCustomerRechargeDetail=(params)=> {
  return request(`${baseUrl}/manager/yqsh-card/customer-recharge`,{

    method:'GET',
    urlParam: params,
  });
}
export const yksCustomerConsumeDetail=(params)=> {
  return request(`${baseUrl}/manager/yqsh-card/customer-consume`,{
    method:'GET',
    urlParam: params,
  });
}
export const yksCustomerCircleDetail=(params)=> {
  return request(`${baseUrl}/manager/yqsh-card/customer-circle`,{
    method:'GET',
    urlParam: params,
  });
}
export const yksIcCircleDetail=(params)=> {
  return request(`${baseUrl}/manager/yqsh-card/card-circle`,{
    method:'GET',
    urlParam: params,
  });
}
export const yksIcConsumeDetail=(params)=> {
  return request(`${baseUrl}/manager/yqsh-card/card-consume`,{
    method:'GET',
    urlParam: params,
  });
}
export const getYksIcMoney=(params)=> {
  return request(`${baseUrl}/manager/yqsh-card/balance-info`,{
    method:'GET',
    urlParam: params,
  });
}
export const getYksCustomerMoney=(params)=> {
  return request(`${baseUrl}/manager/yqsh-card/cash-info`,{
    method:'GET',
    urlParam: params,
  });
}
// 校园简介
export const getSchoolBrief=(params)=> {
  return request(`${baseUrl}/manager/school/get-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateSchoolBrief=(params)=> {
  return request(`${baseUrl}/manager/school/update-info`,{
    method:'PUT',
    urlParam: params,
  });
}
// 过程性评价学生资料
export const getMaterialList=(params)=> {
  return request(`${baseUrl}/manager/student-materials`,{
    method:'GET',
    urlParam: params,
  });
}
export const getMaterialDetail=(params)=> {
  return request(`${baseUrl}/manager/student-materials/get-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const createMaterial=(params)=> {
  return request(`${baseUrl}/manager/student-materials`,{
    method:'POST',
    urlParam: params,
  });
}
export const deleteMaterial=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-materials/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getLabels=(params)=> {
  return request(`${baseUrl}/manager/student-material-labels/get-labels`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateLabels=(params)=> {
  return request(`${baseUrl}/manager/student-material-labels/update-labels`,{
    method:'PUT',
    urlParam: params,
  });
}
export const getLabelsByPid=(params)=> {
  return request(`${baseUrl}/manager/student-material-labels/get-labels-by-pid`,{
    method:'GET',
    urlParam: params,
  });
}
export const getStudentMaterials=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-materials/${id}`,{
    method:'GET',
    // urlParam: params,
  });
}
export const updateStudentMaterials=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-materials/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}

//新生成绩发布
export const getStudentScore=(params)=> {
  return request(`${baseUrl}/manager/student-score`,{
    method:'GET',
    urlParam: params,
  });
}
// 学生刷卡统计
export const getGradeStatistics=(params)=> {
  return request(`${baseUrl}/manager/student-attend-statistics/grade-statistics`,{
    method:'GET',
    urlParam: params,
  });
}

export const deleteStudentScore=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/student-score/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}

export const importStudentScore=(params)=> {
  return request(`${baseUrl}/manager/student-score/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}

export const getScoreDetail=(params)=> {
  const id=params.scoreId
  return request(`${baseUrl}/manager/student-score/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const getClassStatistics=(params)=> {
  return request(`${baseUrl}/manager/student-attend-statistics/class-statistics`,{
    method:'GET',
    urlParam: params,
  });
}

export const updateScoreTitle=(params)=> {
  const id=params.scoreId
  return request(`${baseUrl}/manager/student-score/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}

export const updateItemScore=(params)=> {
  return request(`${baseUrl}/manager/student-score/update-item-score`,{
    method:'POST',
    urlParam: params,
  });
}

export const delPersonScore=(params)=> {
  return request(`${baseUrl}/manager/student-score/del-person-score`,{
    method:'POST',
    urlParam: params,
  });
}
export const getSwipeCardList=(params)=> {
  return request(`${baseUrl}/manager/student-attend-statistics/statistics-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSwipeCardDetail=(params)=> {
  return request(`${baseUrl}/manager/student-attend-statistics/detail`,{
    method:'GET',
    urlParam: params,
  });
}

export const getCadres=(params)=> {
  return request(`${baseUrl}/pub/class-cadre/get-cadres`,{
    method:'GET',
    urlParam:params
  });
}

//风采管理
export const styleList=(params)=> {
  return request(`${baseUrl}/manager/school-styles`,{
    method:'GET',
    urlParam: params,
  });
}
export const styleDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/school-styles/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const createStyle=(params)=> {
  return request(`${baseUrl}/manager/school-styles`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateStyle=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/school-styles/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delStyle=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/school-styles/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
// 校园公告
export const getSchoolNoticeList=(params)=> {
  return request(`${baseUrl}/manager/school-notice`,{
    method:'GET',
    urlParam: params,
  });
}
export const getSchoolNoticeDetail=(params)=> {
  const id =params.id
  return request(`${baseUrl}/manager/school-notice/${id}`,{
    method:'GET',
    urlParam: params,
  });
}
export const addSchoolNotice=(params)=> {
  return request(`${baseUrl}/manager/school-notice`,{
    method:'POST',
    urlParam: params,
  });
}
export const updateSchoolNotice=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/school-notice/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delSchoolNotice=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/school-notice/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getNoticePublishers=(params)=> {
  return request(`${baseUrl}/manager/school-notice/get-publishers`,{
    method:'GET',
    urlParam: params,
  });
}
export const setNoticePublishers=(params)=> {
  return request(`${baseUrl}/manager/school-notice/set-publishers`,{
    method:'POST',
    urlParam: params,
  });
}
//小诺机器人
export const didanoDevices=(params)=> {
  return request(`${baseUrl}/manager/didano-devices`,{
    method:'GET',
    urlParam: params,
  });
}
export const deviceDetail=(params)=> {
  return request(`${baseUrl}/manager/didano-devices/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const updateDevice=(params)=> {
  return request(`${baseUrl}/manager/didano-devices/update-device`,{
    method:'POST',
    urlParam: params,
  });
}
export const createDevice=(params)=> {
  return request(`${baseUrl}/manager/didano-devices/create-device`,{
    method:'POST',
    urlParam: params,
  });
}
export const deleteDevice=(params)=> {
  return request(`${baseUrl}/manager/didano-devices/delete-device`,{
    method:'POST',
    urlParam: params,
  });
}
export const didanoSyncRecords=(params)=> {
  return request(`${baseUrl}/manager/didano-sync-records`,{
    method:'GET',
    urlParam: params,
  });
}
export const fullSync=(params)=> {
  return request(`${baseUrl}/manager/didano-sync-records/full-sync`,{
    method:'POST',
    urlParam: params,
  });
}
export const didanoDetectionRecords=(params)=> {
  return request(`${baseUrl}/manager/didano-detection-records`,{
    method:'GET',
    urlParam: params,
  });
}
export const studentTakeawayRecords=(params)=> {
  return request(`${baseUrl}/manager/student-take-away-records`,{
    method:'GET',
    urlParam: params,
  });
}

export const cardlist=(params)=> {
  return request(`${baseUrl}/manager/ban-card`,{
    method:'GET',
    urlParam: params,
  });
}

export const getCardInfo=(params)=> {
  return request(`${baseUrl}/manager/ban-card/get-info`,{
    method:'GET',
    urlParam: params,
  });
}

export const setTimeSections=(params)=> {
  return request(`${baseUrl}/manager/ban-card/set-time-sections`,{
    method:'POST',
    urlParam: params,
  });
}

export const getAllClass=(params)=> {
  return request(`${baseUrl}/pub/classes/get-classes`,{
    method:'GET',
    urlParam: params,
  });
}
// 教师评课
export const getEvaluationList=(params)=> {
  return request(`${baseUrl}/manager/course-valuations`,{
  method:'GET',
  urlParam: params,
  });
}
export const getEvaluationTemplate=(params)=> {
  return request(`${baseUrl}/manager/course-valuations/template-list`,{
  method:'GET',
  urlParam: params,
  });
}
export const getTemplateDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course-valuations/${id}`,{
  method:'GET',
  });
}
export const addEvaluation=(params)=> {
  return request(`${baseUrl}/manager/course-valuations`,{
  method:'POST',
  urlParam: params,
  });
}
export const editEvaluation=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course-valuations/${id}`,{
  method:'PUT',
  urlParam: params,
  });
}
export const delEvaluation=(params)=> {
  const id=params.typeId
  return request(`${baseUrl}/manager/course-valuations/${id}`,{
  method:'DELETE',
  urlParam: params,
  });
}
export const getTemplateList=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-templates`,{
  method:'GET',
  urlParam: params,
  });
}
export const addEvaTemplate=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-templates`,{
  method:'POST',
  urlParam: params,
  });
}
export const editEvaTemplate=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course-valuation-templates/${id}`,{
  method:'PUT',
  urlParam: params,
  });
}
export const delEvaTemplate=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course-valuation-templates/${id}`,{
  method:'DELETE',
  urlParam: params,
  });
}
export const getStatisticList=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-records`,{
  method:'GET',
  urlParam: params,
  });
}
export const getDetailList=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-records/valuation-list`,{
  method:'GET',
  urlParam: params,
  });
}
export const templateManage=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-templates/show-template`,{
  method:'GET',
  urlParam: params,
  });
}
export const getQuotasList=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-templates/quotas-list`,{
  method:'GET',
  urlParam: params,
  });
}
export const addIndexs=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-templates/add-quotas`,{
  method:'POST',
  urlParam: params,
  });
}
export const addPoints=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-templates/add-points`,{
  method:'POST',
  urlParam: params,
  });
}
export const delIndexs=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course-valuation-quotas/${id}`,{
  method:'DELETE',
  urlParam: params,
  });
}
export const getPoints=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-templates/get-points`,{
  method:'GET',
  urlParam: params,
  });
}
export const delPoints=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/course-valuation-point/${id}`,{
  method:'DELETE',
  urlParam: params,
  });
}
export const editPoint=(params)=> {
  return request(`${baseUrl}/manager/course-valuation-point/save`,{
  method:'POST',
  urlParam: params,
  });
}

//学生积分
export const getScoreList=(params)=> {
  return request(`${baseUrl}/manager/person-score`,{
    method:'GET',
    urlParam: params,
  });
}

export const getRuleItems=(params)=> {
  return request(`${baseUrl}/manager/person-score/get-rule-items`,{
    method:'GET',
    urlParam: params,
  });
}

export const getRuleList=(params)=> {
  return request(`${baseUrl}/manager/person-score/rule-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const saveRule=(params)=> {
  return request(`${baseUrl}/manager/person-score/save-rule`,{
    method:'POST',
    urlParam: params,
  });
}

export const getLevelList=(params)=> {
  return request(`${baseUrl}/manager/person-score/level-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const saveLevel=(params)=> {
  return request(`${baseUrl}/manager/person-score/save-level`,{
    method:'POST',
    urlParam: params,
  });
}

export const getPersonScoreLog=(params)=> {
  return request(`${baseUrl}/manager/person-score/get-person-score-log`,{
    method:'GET',
    urlParam: params,
  });
}

export const personScoreMedal=(params)=> {
  return request(`${baseUrl}/manager/person-score-medal`,{
    method:'GET',
    urlParam: params,
  });
}

export const medalList=(params)=> {
  return request(`${baseUrl}/manager/person-score-medal/medal-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const saveMedal=(params)=> {
  return request(`${baseUrl}/manager/person-score-medal/save-medal`,{
    method:'POST',
    urlParam: params,
  });
}

export const personScoreGoods=(params)=> {
  return request(`${baseUrl}/manager/person-score-goods`,{
    method:'GET',
    urlParam: params,
  });
}

export const personScoreGoodsDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/person-score-goods/${id}`,{
    method:'GET',
    urlParam: params,
  });
}

export const personScoreGoodsAdd=(params)=> {
  return request(`${baseUrl}/manager/person-score-goods`,{
    method:'POST',
    urlParam: params,
  });
}

export const personScoreGoodsEdit=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/person-score-goods/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}

export const personScoreGoodsDelete=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/person-score-goods/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}

export const exchangeRecord=(params)=> {
  return request(`${baseUrl}/manager/person-score-goods/exchange-record`,{
    method:'GET',
    urlParam: params,
  });
}

//学生荣誉
export const personHonorRecords=(params)=> {
  return request(`${baseUrl}/manager/person-honor-records`,{
    method:'GET',
    urlParam: params,
  });
}

export const getHonorTypes=(params)=> {
  return request(`${baseUrl}/manager/person-honor-level-type/get-types`,{
    method:'GET',
    urlParam: params,
  });
}

export const levelTypList=(params)=> {
  return request(`${baseUrl}/manager/person-honor-level-type/list`,{
    method:'GET',
    urlParam: params,
  });
}

export const saveHonorLevel=(params)=> {
  return request(`${baseUrl}/manager/person-honor-level-type/save`,{
    method:'POST',
    urlParam: params,
  });
}

export const personStatistics=(params)=> {
  return request(`${baseUrl}/manager/person-honor-records/person-statistics`,{
    method:'GET',
    urlParam: params,
  });
}

export const deletePersonHonorRecords=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/person-honor-records/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}

export const getPersonHonorHandler=(params)=> {
  return request(`${baseUrl}/manager/person-honor-handler/show`,{
    method:'GET',
    urlParam: params,
  });
}

export const savePersonHonorHandler=(params)=> {
  return request(`${baseUrl}/manager/person-honor-handler/save`,{
    method:'POST',
    urlParam: params,
  });
}

export const personHonorRecordsDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/person-honor-records/${id}`,{
    method:'GET',
    urlParam: params,
  });
}






//问卷调查
export const getQuestionnaireList=(params)=> {
  return request(`${baseUrl}/manager/questionnaire`,{
    method:'GET',
    urlParam: params,
  });
}

export const createQuestionnaire=(params)=> {
  return request(`${baseUrl}/manager/questionnaire`,{
    method:'POST',
    urlParam: params,
  });
}

export const deleteQuestionnaire=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/questionnaire/${id}`,{
    method:'DELETE',
  });
}

export const getQuestionnaireDetail=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/questionnaire/${id}`,{
    method:'GET',
    urlParam: params,
  });
}

export const updateQuestionnaire=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/questionnaire/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}



//头像管理
export const headPicList=(params)=> {
  return request(`${baseUrl}/manager/persons/head-pic-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const getHeadPic=(params)=> {
  return request(`${baseUrl}/manager/persons/get-head-pic`,{
    method:'GET',
    urlParam: params,
  });
}

export const updateHeadPics=(params)=> {
  return request(`${baseUrl}/manager/persons/update-head-pics`,{
    method:'POST',
    urlParam: params,
  });
}

export const personHeadPicList=(params)=> {
  return request(`${baseUrl}/manager/person-head-pic/list`,{
    method:'GET',
    urlParam: params,
  });
}

export const registerFaces=(params)=> {
  return request(`${baseUrl}/manager/person-head-pic/register-faces`,{
    method:'POST',
    urlParam: params,
  });
}

export const syncRecords=(params)=> {
  return request(`${baseUrl}/manager/yandaojie/sync-records`,{
    method:'GET',
    urlParam: params,
  });
}

export const syncData=(params)=> {
  return request(`${baseUrl}/manager/yandaojie/sync-data`,{
    method:'POST',
    urlParam: params,
  });
}

// 新闻资讯
export const getNewsList=(params)=> {
  return request(`${baseUrl}/manager/school-news`,{
    method:'GET',
    urlParam: params,
  });
}
export const getAllAticle=(params)=> {
  return request(`${baseUrl}/manager/school-news`,{
    method:'GET',
    urlParam: params,
  });
}
export const getNewsDetail=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/school-news/${id}`,{
    method:'GET',
  })
}
export const saveEdit=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/school-news/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}

export const addNews=(params)=> {
  return request(`${baseUrl}/manager/school-news`,{
    method:'POST',
    urlParam: params,
  });
}

export const delNews=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/school-news/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}

export const updateStatus=(params)=> {
  return request(`${baseUrl}/manager/school-news/update-status`,{
    method:'POST',
    urlParam: params,
  });
}
export const getMsgList=(params)=> {
  return request(`${baseUrl}/manager/school-news/comment-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const changeStatus=(params)=> {
  return request(`${baseUrl}/manager/school-news/update-comment-status`,{
    method:'POST',
    urlParam: params,
  });
}
export const replayMsg=(params)=> {
  return request(`${baseUrl}/manager/school-news/comment-reply`,{
    method:'POST',
    urlParam: params,
  });
}
export const delMsg=(params)=> {
  return request(`${baseUrl}/manager/school-news/del-comment`,{
    method:'POST',
    urlParam: params,
  });
}



//新版班级考评
export const getMoralClassScoreList=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/statistics-class-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const getMoralClassScoreBar=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/statistics`,{
    method:'GET',
    urlParam: params,
  });
}

export const getMoralWeek=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/week-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const getMoralEvaluationType=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation-type/get-types`,{
    method:'GET',
    urlParam: params,
  });
}

export const getMoralDayDetail=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/day-detail`,{
    method:'GET',
    urlParam: params,
  });
}

export const getMoralWeekDetail=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/week-detail`,{
    method:'GET',
    urlParam: params,
  });
}

export const getMoralMonthDetail=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/month-detail`,{
    method:'GET',
    urlParam: params,
  });
}

export const getEvaluationType=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation-type`,{
    method:'GET',
    urlParam: params,
  });
}

export const saveEvaluationType=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation-type`,{
    method:'POST',
    urlParam: params,
  });
}

export const deleteEvaluationType=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/moral-education-evaluation-type/${id}`,{
    method:'DELETE',
  });
}

export const getEvaluationDetail=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/moral-education-evaluation-type/${id}`,{
    method:'GET'
  });
}

export const updateEvaluation=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/moral-education-evaluation-type/${id}`,{
    method:'PUT',
    urlParam: params
  });
}

export const flagDetail=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation-type/flag-detail`,{
    method:'GET',
    urlParam: params
  });
}

export const setFlag=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation-type/set-flag`,{
    method:'POST',
    urlParam: params
  });
}

export const showScore=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/show-score`,{
    method:'GET',
    urlParam: params
  });
}

export const getLogs=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/get-logs`,{
    method:'GET',
    urlParam: params
  });
}

export const updateScore=(params)=> {
  return request(`${baseUrl}/manager/moral-education-evaluation/update-score`,{
    method:'POST',
    urlParam: params
  });
}

export const getMoralTypeDetail=(params)=> {
  const id=params.typeId
  return request(`${baseUrl}/manager/moral-education-evaluation-type/${id}`,{
    method:'GET',
  });
}


//人员归档
export const unfiledList=(params)=> {
  return request(`${baseUrl}/manager/file-persons/unfiled-list`,{
    method:'GET',
    urlParam: params
  });
}

export const batchFileByGroup=(params)=> {
  return request(`${baseUrl}/manager/file-persons/batch-file-by-group`,{
    method:'POST',
    urlParam: params
  });
}

export const fileOne=(params)=> {
  return request(`${baseUrl}/manager/file-persons/file-one`,{
    method:'POST',
    urlParam: params
  });
}

export const getFiledPersonGroup=(params)=> {
  return request(`${baseUrl}/manager/file-persons/get-filed-person-group`,{
    method:'GET',
    urlParam: params
  });
}

export const filedList=(params)=> {
  return request(`${baseUrl}/manager/file-persons/filed-list`,{
    method:'GET',
    urlParam: params
  });
}

export const showFiledReason=(params)=> {
  return request(`${baseUrl}/manager/file-persons/show-filed-reason`,{
    method:'GET',
    urlParam: params
  });
}

export const unfileOne=(params)=> {
  return request(`${baseUrl}/manager/file-persons/unfile-one`,{
    method:'POST',
    urlParam: params
  });
}

export const getFiledGroup=(params)=> {
  return request(`${baseUrl}/manager/file-persons/get-filed-group`,{
    method:'GET',
    urlParam: params
  });
}

export const unfileGroup=(params)=> {
  return request(`${baseUrl}/manager/file-persons/unfile-group`,{
    method:'POST',
    urlParam: params
  });
}

//通用OA
export const getOaTemplateList=(params)=> {
  return request(`${baseUrl}/manager/general-oa-template`,{
    method:'GET',
    urlParam: params
  });
}

export const createOaTemplate=(params)=> {
  return request(`${baseUrl}/manager/general-oa-template`,{
    method:'POST',
    urlParam: params
  });
}

export const getOaTemplateDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/general-oa-template/${id}`,{
    method:'GET'
  });
}

export const deleteOaTemplate=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/general-oa-template/${id}`,{
    method:'DELETE',
  });
}

export const updateOaTemplate=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/general-oa-template/${id}`,{
    method:'PUT',
    urlParam: params
  });
}

export const copyOaTemplate=(params)=> {
  return request(`${baseUrl}/manager/general-oa-template/copy`,{
    method:'POST',
    urlParam: params
  });
}

export const getOaRecordList=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/general-oa-records`,{
    method:'GET',
    urlParam: params
  });
}

export const getOaRecordsDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/general-oa-records/${id}`,{
    method:'GET'
  });
}

export const endOaRecord=(params)=> {
  return request(`${baseUrl}/manager/general-oa-records/end`,{
    method:'POST',
    urlParam: params
  });
}

export const deleteOaRecord=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/general-oa-records/${id}`,{
    method:'DELETE'
  });
}


// 外出培训
export const getTrainList=(params)=> {
  return request(`${baseUrl}/manager/out-train`,{
    method:'GET',
    urlParam: params
  });
}
export const getTrainDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/out-train/${id}`,{
    method:'GET',
  });
}
export const getBarData=(params)=> {
  return request(`${baseUrl}/manager/out-train/records-person-statistics`,{
    method:'GET',
    urlParam: params
  });
}
export const getPieData=(params)=> {
  return request(`${baseUrl}/manager/out-train/records-type-statistics`,{
    method:'GET',
    urlParam: params
  });
}

// 意见反馈
export const getFeedbackList=(params)=> {
  return request(`${baseUrl}/manager/opinion`,{
    method:'GET',
    urlParam: params
  });
}
export const delFeedback=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/opinion/${id}`,{
    method:'DELETE',
    urlParam: params
  });
}
export const getFeedbackDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/opinion/${id}`,{
    method:'GET',
  });
}
export const suggestionReply=(params)=> {
  return request(`${baseUrl}/manager/opinion/reply`,{
    method:'POST',
    urlParam: params
  });
}
export const getOpinionType=(params)=> {
  return request(`${baseUrl}/manager/opinion-type`,{
    method:'GET',
    urlParam: params
  });
}
export const opinionTypeDetail=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/opinion-type/${typeId}`,{
    method:'GET',
    urlParam: params
  });
}
export const getAllTeachers=(params)=> {
  return request(`${baseUrl}/pub/persons/get-teacher-staffs`,{
    method:'GET',
    urlParam: params
  });
}
export const addOpinionType=(params)=> {
  return request(`${baseUrl}/manager/opinion-type`,{
    method:'POST',
    urlParam: params
  });
}
export const editOpinionType=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/opinion-type/${typeId}`,{
    method:'PUT',
    urlParam: params
  });
}
export const delOpinionType=(params)=> {
  const typeId=params.typeId
  return request(`${baseUrl}/manager/opinion-type/${typeId}`,{
    method:'DELETE',
    urlParam: params
  });
}
// 客户端绑定
export const getPersonList=(params)=> {
  return request(`${baseUrl}/manager/person-bind`,{
    method:'GET',
    urlParam: params
  });
}
export const bindDetail=(params)=> {
  const id=params.personId
  return request(`${baseUrl}/manager/person-bind/${id}`,{
    method:'GET',
  });
}
export const updateBind=(params)=> {
  return request(`${baseUrl}/manager/person-bind/update-bind`,{
    method:'POST',
    urlParam: params
  });
}
//数字科技馆
export const getDstmList=(params)=> {
  return request(`${baseUrl}/manager/dstm-activity`,{
    method:'GET',
    urlParam: params
  });
}

export const delDstm=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/dstm-activity/${id}`,{
    method:'DELETE'
  });
}

export const addDstm=(params)=> {
  return request(`${baseUrl}/manager/dstm-activity`,{
    method:'POST',
    urlParam: params
  });
}

export const getDstmDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/dstm-activity/${id}`,{
    method:'GET'
  });
}

export const getDstmHandler=(params)=> {
  return request(`${baseUrl}/manager/dstm-handler/show`,{
    method:'GET',
    urlParam: params
  });
}

export const saveDstmHandler=(params)=> {
  return request(`${baseUrl}/manager/dstm-handler/save`,{
    method:'POST',
    urlParam: params
  });
}

export const dstmTypes=(params)=> {
  return request(`${baseUrl}/manager/dstm-types/list`,{
    method:'GET',
    urlParam: params
  });
}

export const dstmRoles=(params)=> {
  return request(`${baseUrl}/manager/dstm-student-roles/list`,{
    method:'GET',
    urlParam: params
  });
}

export const saveDstmRoles=(params)=> {
  return request(`${baseUrl}/manager/dstm-student-roles/save`,{
    method:'POST',
    urlParam: params
  });
}


export const dstmActivityFile=(params)=> {
  return request(`${baseUrl}/manager/dstm-activity/file`,{
    method:'POST',
    urlParam: params
  });
}

export const dstmTypesList=(params)=> {
  return request(`${baseUrl}/manager/dstm-types/list`,{
    method:'GET',
    urlParam: params
  });
}

export const saveDstmTypes=(params)=> {
  return request(`${baseUrl}/manager/dstm-types/save`,{
    method:'POST',
    urlParam: params
  });
}

export const unfileDstmActivity=(params)=> {
  return request(`${baseUrl}/manager/dstm-activity/unfile`,{
    method:'POST',
    urlParam: params
  });
}

export const dstmActivityComment=(params)=> {
  return request(`${baseUrl}/manager/dstm-activity-comment`,{
    method:'GET',
    urlParam: params
  });
}

export const deldstmComment=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/dstm-activity-comment/${id}`,{
    method:'DELETE',
    urlParam: params
  });
}

export const getApplyDetail=(params)=> {
  const id=params.id
  return request(`${baseUrl}/manager/dstm-activity/apply-detail`,{
    method:'GET',
    urlParam: params
  });
}

export const modifyDstmActivity=(params)=> {
  const id=params.activityId
  return request(`${baseUrl}/manager/dstm-activity/${id}`,{
    method:'PUT',
    urlParam: params
  });
}





// 益小币
export const getAllCions=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/total`,{
    method:'GET',
    urlParam: params
  });
}
export const getCions=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/class-list`,{
    method:'GET',
    urlParam: params
  });
}
export const rateDetail=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/rate`,{
    method:'GET',
    urlParam: params
  });
}
export const setRate=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/set-rate`,{
    method:'POST',
    urlParam: params
  });
}
export const classProperty=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/student-list`,{
    method:'GET',
    urlParam: params
  });
}
export const propertyRecord=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/record`,{
    method:'GET',
    urlParam: params
  });
}
export const teacherProperty=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/teacher-list`,{
    method:'GET',
    urlParam: params
  });
}
export const teacherCount=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/teacher-count`,{
    method:'GET',
    urlParam: params
  });
}
export const grantCoin=(params)=> {
  return request(`${baseUrl}/manager/beneficial-coin/grant`,{
    method:'POST',
    urlParam: params
  });
}

// 人脸识别管理
export const faceRegList = (params) => {
  return request(`${baseUrl}/manager/uface-person/list`,{
    method:'GET',
    urlParam: params
  });
}
export const personFaceReg = (params) => {
  return request(`${baseUrl}/manager/uface-person/register-face`,{
    method:'POST',
    urlParam: params
  });
}
export const personFaceCancel = (params) => {
  return request(`${baseUrl}/manager/uface-person/del-person`,{
    method:'POST',
    urlParam: params
  });
}
export const personBatchReg = (params) => {
  return request(`${baseUrl}/manager/uface-person/batch-register`,{
    method:'POST',
    urlParam: params
  });
}
export const personBatchCancel = (params) => {
  return request(`${baseUrl}/manager/uface-person/batch-del-person`,{
    method:'POST',
    urlParam: params
  });
}
export const facilityList = (params) => {
  return request(`${baseUrl}/manager/uface-device/list`,{
    method:'GET',
    urlParam: params
  });
}
export const checkDeviceStatus = (params) => {
  return request(`${baseUrl}/manager/uface-device/detail`,{
    method:'GET',
    urlParam: params
  });
}
export const clearFacility = (params) => {
  return request(`${baseUrl}/manager/uface-device/del-auth`,{
    method:'POST',
    urlParam: params
  });
}
export const getAuthList = (params) => {
  return request(`${baseUrl}/manager/uface-device/auth-list`,{
    method:'GET',
    urlParam: params
  });
}
export const getAllDevice = (params) => {
  return request(`${baseUrl}/manager/uface-device/all-devices`,{
    method:'GET',
    urlParam: params
  });
}
export const copyAuth = (params) => {
  return request(`${baseUrl}/manager/uface-device/copy-auth`,{
    method:'POST',
    urlParam: params
  });
}
export const unauthPerson = (params) => {
  return request(`${baseUrl}/manager/uface-device/un-auth-person-list`,{
    method:'GET',
    urlParam: params
  });
}
export const submitAuth = (params) => {
  return request(`${baseUrl}/manager/uface-device/batch-auth-person`,{
    method:'POST',
    urlParam: params
  });
}

// 宇泛人脸管理-wo平台
export const faceRegList2 = (params) => {
  return request(`${baseUrl}/manager/woface-person/list`,{
    method:'GET',
    urlParam: params
  });
}
export const personFaceReg2 = (params) => {
  return request(`${baseUrl}/manager/woface-person/register-face`,{
    method:'POST',
    urlParam: params
  });
}
export const personFaceCancel2 = (params) => {
  return request(`${baseUrl}/manager/woface-person/del-person`,{
    method:'POST',
    urlParam: params
  });
}
export const personBatchReg2 = (params) => {
  return request(`${baseUrl}/manager/woface-person/batch-register`,{
    method:'POST',
    urlParam: params
  });
}
export const personBatchCancel2 = (params) => {
  return request(`${baseUrl}/manager/woface-person/batch-del-person`,{
    method:'POST',
    urlParam: params
  });
}
export const facilityList2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/list`,{
    method:'GET',
    urlParam: params
  });
}
export const checkDeviceStatus2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/detail`,{
    method:'GET',
    urlParam: params
  });
}
export const clearFacility2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/del-auth`,{
    method:'POST',
    urlParam: params
  });
}
export const getAuthList2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/auth-list`,{
    method:'GET',
    urlParam: params
  });
}
export const getAllDevice2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/all-devices`,{
    method:'GET',
    urlParam: params
  });
}
export const copyAuth2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/copy-auth`,{
    method:'POST',
    urlParam: params
  });
}
export const unauthPerson2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/un-auth-person-list`,{
    method:'GET',
    urlParam: params
  });
}
export const submitAuth2 = (params) => {
  return request(`${baseUrl}/manager/woface-device/batch-auth-person`,{
    method:'POST',
    urlParam: params
  });
}

// 综合素质评价
export const getMessageList = (params) => {
  return request(`${baseUrl}/manager/quality-comments`,{
    method:'GET',
    urlParam: params
  });
}
export const importMessage = (params) => {
  return request(`${baseUrl}/manager/quality-comments/comment-import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const sendWord = (params) => {
  return request(`${baseUrl}/manager/quality-comments/comment`,{
    method:'POST',
    urlParam: params
  });
}
export const teacherMsgDetail = (params) => {
  return request(`${baseUrl}/manager/quality-comments/detail`,{
    method:'GET',
    urlParam: params
  });
}
export const delTeacherMsg = (params) => {
  return request(`${baseUrl}/manager/quality-comments/comment-delete`,{
    method:'POST',
    urlParam: params
  });
}
export const getSubjects = (params) => {
  return request(`${baseUrl}/manager/quality-subject-score/subjects`,{
    method:'GET',
    urlParam: params
  });
}
export const getSubjectScore = (params) => {
  return request(`${baseUrl}/manager/quality-subject-score/index`,{
    method:'GET',
    urlParam: params
  });
}
export const importScore = (params) => {
  return request(`${baseUrl}/manager/quality-subject-score/score-import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const getScore = (params) => {
  return request(`${baseUrl}/manager/quality-subject-score/score-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const editScore = (params) => {
  return request(`${baseUrl}/manager/quality-subject-score/score-edit`,{
    method:'POST',
    urlParam: params,
  });
}
export const getReportList = (params) => {
  return request(`${baseUrl}/manager/quality-student-report`,{
    method:'GET',
    urlParam: params,
  });
}
export const allTemplate = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/list`,{
    method:'GET',
    urlParam: params,
  });
}
export const allTopQuotas = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/top-quotas`,{
    method:'GET',
    urlParam: params,
  });
}
export const importReport = (params) => {
  return request(`${baseUrl}/manager/quality-student-report/add`,{
    method:'POST',
    urlParam: params,
  });
}
export const delFile = (params) => {
  return request(`${baseUrl}/manager/quality-student-report/file-delete`,{
    method:'POST',
    urlParam: params,
  });
}
export const allReport = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-report`,{
    method:'GET',
    urlParam: params,
  });
}
export const progressList = (params) => {
  return request(`${baseUrl}/manager/quality-complete`,{
    method:'GET',
    urlParam: params,
  });
}
export const remind = (params) => {
  return request(`${baseUrl}/manager/quality-complete/send`,{
    method:'POST',
    urlParam: params,
  });
}
export const qualityTemplate = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template`,{
    method:'GET',
    urlParam: params,
  });
}
export const addTemplate = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template`,{
    method:'POST',
    urlParam: params,
  });
}
export const evaTemplateDetail = (params) => {
  const id = params.templateId
  return request(`${baseUrl}/manager/quality-valuations-template/${id}`,{
    method:'GET',
  });
}
export const templateEdit = (params) => {
  const id = params.templateId
  return request(`${baseUrl}/manager/quality-valuations-template/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delTemplate = (params) => {
  const id = params.templateId
  return request(`${baseUrl}/manager/quality-valuations-template/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const switchStatus = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/change-status`,{
    method:'POST',
    urlParam: params,
  });
}
export const scoreLevelList = (params) => {
  return request(`${baseUrl}/manager/quality-level/level-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const saveLevels = (params) => {
  return request(`${baseUrl}/manager/quality-level/level-set`,{
    method:'POST',
    urlParam: params,
  });
}
export const showTemplateList = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/show-template`,{
    method:'GET',
    urlParam: params,
  });
}
export const templateQuotas = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/quotas-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const addTemplateQuotas = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/add-quotas`,{
    method:'POST',
    urlParam: params,
  });
}
export const getRater = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/get-rater`,{
    method:'GET',
    urlParam: params,
  });
}
export const addEvaPoint = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/add-points`,{
    method:'POST',
    urlParam: params,
  });
}
export const pointsList = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/get-points`,{
    method:'GET',
    urlParam: params,
  });
}
export const delEvaPoint = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/point-delete`,{
    method:'POST',
    urlParam: params,
  });
}
export const delTarget = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/quotas-delete`,{
    method:'POST',
    urlParam: params,
  });
}
export const uploadTargetIcon = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/save-top-quota`,{
    method:'POST',
    urlParam: params,
  });
}
export const editTarget = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/edit-temp-content`,{
    method:'POST',
    urlParam: params,
  });
}
export const editRater = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/get-point-rater`,{
    method:'GET',
    urlParam: params,
  });
}
export const changeRater = (params) => {
  return request(`${baseUrl}/manager/quality-valuations-template/set-point-rater`,{
    method:'POST',
    urlParam: params,
  });
}
// 资产管理
export const assetsType = (params) => {
  return request(`${baseUrl}/manager/property-category/list`,{
    method:'GET',
    urlParam: params,
  });
}
export const assetList = (params) => {
  return request(`${baseUrl}/manager/property-product`,{
    method:'GET',
    urlParam: params,
  });
}
export const propertyUnit = (params) => {
  return request(`${baseUrl}/manager/property-unit/get-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const assetsDetail = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-product/${id}`,{
    method:'GET',
  });
}
export const addAssetsInfo = (params) => {
  return request(`${baseUrl}/manager/property-product`,{
    method:'POST',
    urlParam: params,
  });
}
export const editAssetsInfo = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-product/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delAssetsInfo = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-product/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const importAssetsName = (params) => {
  return request(`${baseUrl}/manager/property-product/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const propertyType = (params) => {
  return request(`${baseUrl}/manager/property-category`,{
    method:'GET',
    urlParam: params,
  });
}
export const addPropertyType = (params) => {
  return request(`${baseUrl}/manager/property-category`,{
    method:'POST',
    urlParam: params,
  });
}
export const propertyTypeName = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-category/${id}`,{
    method:'GET',
  });
}
export const editPropertyType = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-category/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delAssetType = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-category/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const importAssetTypes = (params) => {
  return request(`${baseUrl}/manager/property-category/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const getUnitList = (params) => {
  return request(`${baseUrl}/manager/property-unit`,{
    method:'GET',
    urlParam: params,
  });
}
export const addUnit = (params) => {
  return request(`${baseUrl}/manager/property-unit`,{
    method:'POST',
    urlParam: params,
  });
}
export const unitDetail = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-unit/${id}`,{
    method:'GET',
  });
}
export const editUnit = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-unit/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}
export const delUnit = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-unit/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const assetQueryList = (params) => {
  return request(`${baseUrl}/manager/property-distribution`,{
    method:'GET',
    urlParam: params,
  });
}
export const goodsApply = (params) => {
  return request(`${baseUrl}/manager/property-get-apply`,{
    method:'GET',
    urlParam: params,
  });
}
export const batchesDelApply = (params) => {
  return request(`${baseUrl}/manager/property-get-apply/batch-del`,{
    method:'POST',
    urlParam: params,
  });
}
export const delApply = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-get-apply/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getAssetsDetail = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-get-apply/${id}`,{
    method:'GET',
  });
}
export const getHandlerDetail = (params) => {
  return request(`${baseUrl}/manager/property-get-apply/examine-persons`,{
    method:'GET',
    urlParam: params,
  });
}
export const saveHandlerSet = (params) => {
  return request(`${baseUrl}/manager/property-get-apply/person-set`,{
    method:'POST',
    urlParam: params,
  });
}
export const goodsPurchase = (params) => {
  return request(`${baseUrl}/manager/property-buy-apply`,{
    method:'GET',
    urlParam: params,
  });
}
export const delPurchase = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-buy-apply/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const batchesDelPurchase = (params) => {
  return request(`${baseUrl}/manager/property-buy-apply/batch-del`,{
    method:'POST',
    urlParam: params,
  });
}
export const getPurchaseDetail = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-buy-apply/${id}`,{
    method:'GET',
  });
}
export const getAuditorDetail = (params) => {
  return request(`${baseUrl}/manager/property-buy-apply/examine-persons`,{
    method:'GET',
    urlParam: params,
  });
}
export const saveAuditorSet = (params) => {
  return request(`${baseUrl}/manager/property-buy-apply/person-set`,{
    method:'POST',
    urlParam: params,
  });
}
export const assetManageList = (params) => {
  return request(`${baseUrl}/manager/property-info`,{
    method:'GET',
    urlParam: params,
  });
}
export const applyRuleSet = (params) => {
  return request(`${baseUrl}/manager/property-info/apply-rule-set`,{
    method:'POST',
    urlParam: params,
  });
}
export const getStockRecord = (params) => {
  return request(`${baseUrl}/manager/property-storage/show-storage`,{
    method:'GET',
    urlParam: params,
  });
}
export const delStockRecord = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-storage/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const stockDetail = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-storage/${id}`,{
    method:'GET',
  });
}
export const delAllotRecord = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-distribution-records/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const allotRecord = (params) => {
  return request(`${baseUrl}/manager/property-distribution-records/show-distribution`,{
    method:'GET',
    urlParam: params,
  });
}
export const takeStock = (params) => {
  return request(`${baseUrl}/manager/property-storage/inventory`,{
    method:'POST',
    urlParam: params,
  });
}
export const takeStockRecord = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/property-storage/show-inventory?id=${id}`,{
    method:'GET',
  });
}
export const getAssetByTypes = (params) => {
  const id = params.catId
  return request(`${baseUrl}/manager/property-product/get-property?catId=${id}`,{
    method:'GET',
  });
}
export const getAssetUser = (params) => {
  const id = params.propertyId
  return request(`${baseUrl}/manager/property-transfer/property-user?propertyId=${id}`,{
    method:'GET',
  });
}
export const setAssetTransfer = (params) => {
  return request(`${baseUrl}/manager/property-transfer/add`,{
    method:'POST',
    urlParam: params,
  });
}
export const allcatedAsset = (params) => {
  return request(`${baseUrl}/manager/property-distribution-records/add`,{
    method:'POST',
    urlParam: params,
  });
}
export const batchImportAsset = (params) => {
  return request(`${baseUrl}/manager/property-storage/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const getAssetIncrease = (params) => {
  return request(`${baseUrl}/manager/property-storage/index`,{
    method:'GET',
    urlParam: params,
  });
}
export const delAssetsIncrease = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/property-storage/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const saveAddIncrease = (params) => {
  return request(`${baseUrl}/manager/property-storage`,{
    method:'POST',
    urlParam: params,
  });
}
export const editAddIncrease = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/property-storage/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}



//大屏
export const getModules = (params) => {
  return request(`${baseUrl}/manager/board-nav/get-modules`,{
    method:'GET',
    urlParam: params,
  });
}

export const saveNav = (params) => {
  return request(`${baseUrl}/manager/board-nav/save-nav`,{
    method:'POST',
    urlParam: params,
  });
}

export const screenTypelist = (params) => {
  return request(`${baseUrl}/manager/board-nav/list`,{
    method:'GET',
    urlParam: params,
  });
}

export const getNavDetail = (params) => {
  return request(`${baseUrl}/manager/board-nav/get-nav`,{
    method:'GET',
    urlParam: params,
  });
}

// 教职工考勤
export const staffAttendList = (params) => {
  return request(`${baseUrl}/manager/teacher-attend-records/list`,{
    method:'GET',
    urlParam: params,
  });
}
export const attendanceTime = (params) => {
  return request(`${baseUrl}/manager/teacher-attend-records/get-work-time`,{
    method:'GET',
    urlParam: params,
  });
}
export const setAttendance = (params) => {
  return request(`${baseUrl}/manager/teacher-attend-records/set-work-time`,{
    method:'POST',
    urlParam: params,
  });
}
export const attendanceRecord = (params) => {
  return request(`${baseUrl}/manager/teacher-attend-records/get-detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const personAttendance = (params) => {
  return request(`${baseUrl}/manager/teacher-attend-records/person-attends`,{
    method:'GET',
    urlParam: params,
  });
}

// 体温检测
export const temperatureQuery = (params) => {
  return request(`${baseUrl}/manager/person-temperature`,{
    method:'GET',
    urlParam: params,
  });
}

// 放学管理
export const getLeaveSchool = (params) => {
  return request(`${baseUrl}/manager/leave-school/list`,{
    method:'GET',
    urlParam: params,
  });
}
export const leaveSchoolList = (params) => {
  return request(`${baseUrl}/manager/leave-school`,{
    method:'GET',
    urlParam: params,
  });
}
export const setAdmin = (params) => {
  return request(`${baseUrl}/manager/leave-school/set-admin`,{
    method:'POST',
    urlParam: params,
  });
}
export const getAdmins = (params) => {
  return request(`${baseUrl}/manager/leave-school/admin-view`,{
    method:'GET',
    urlParam: params,
  });
}
// export const getChargeOfTeacher = (params) => {
//   return request(`${baseUrl}/manager/leave-school/admin-view`,{
//     method:'GET',
//     urlParam: params,
//   });
// }
export const setResponsibleTeacher = (params) => {
  return request(`${baseUrl}/manager/leave-school`,{
    method:'POST',
    urlParam: params,
  });
}
export const delLeaveSchool = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/leave-school-records/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const importClassFile  = (params) => {
  return request(`${baseUrl}/manager/leave-school/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const importStudentFile  = (params) => {
  return request(`${baseUrl}/manager/leave-school-student/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const getStudentList  = (params) => {
  return request(`${baseUrl}/manager/leave-school-student`,{
    method:'GET',
    urlParam: params,
  });
}
export const delLeaveStudent = (params) => {
  return request(`${baseUrl}/manager/leave-school-student/student-delete`,{
    method:'POST',
    urlParam: params,
  });
}
export const leaveSchoolClasses = (params) => {
  return request(`${baseUrl}/manager/leave-school-records`,{
    method:'GET',
    urlParam: params,
  });
}
export const batchDelRecord = (params) => {
  return request(`${baseUrl}/manager/leave-school-records/batch-del`,{
    method:'POST',
    urlParam: params,
  });
}
export const getTeachersList = (params) => {
  return request(`${baseUrl}/pub/persons/get-person-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getResponsibleTeacher = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/leave-school/${id}`,{
    method:'GET',
    // urlParam: params,
  });
}
export const editResponsibleTeacher = (params) => {
  const id = params.classId
  return request(`${baseUrl}/manager/leave-school/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}

export const getMonitorList = (params) => {
  return request(`${baseUrl}/manager/monitor`,{
    method:'GET',
    urlParam: params,
  });
}

export const createMonitor = (params) => {
  return request(`${baseUrl}/manager/monitor`,{
    method:'POST',
    urlParam: params,
  });
}

export const getMonitorDetail = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/monitor/${id}`,{
    method:'GET',
    // urlParam: params,
  });
}

export const updateMonitor = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/monitor/${id}`,{
    method:'PUT',
    urlParam: params,
  });
}

export const deleteMonitor = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/monitor/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}


export const getMonitorAuth = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/monitor-auth`,{
    method:'GET',
    urlParam: params,
  });
}

export const getUnAuthList = (params) => {
  return request(`${baseUrl}/manager/monitor-auth/un-auth-person-list`,{
    method:'GET',
    urlParam: params,
  });
}

export const batchAddPerson = (params) => {
  return request(`${baseUrl}/manager/monitor-auth/batch-add-person`,{
    method:'POST',
    urlParam: params,
  });
}

export const delAuthPerson = (params) => {
  return request(`${baseUrl}/manager/monitor-auth/del-person`,{
    method:'POST',
    urlParam: params,
  });
}

export const searchDev = (params) => {
  return request(`${baseUrl}//manager/monitor/search-dev`,{
    method:'GET',
    urlParam: params,
  });
}

// 测评报告（幼儿园）
export const getBabys = (params) => {
  return request(`${baseUrl}/manager/evaluation-report/student-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const getTestReportList = (params) => {
  return request(`${baseUrl}/manager/evaluation-report`,{
    method:'GET',
    urlParam: params,
  });
}
export const delTestReport = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/evaluation-report/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const getTestReportDetail = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/evaluation-report/${id}`,{
    method:'GET',
    // urlParam: params,
  });
}

// 手持考勤
export const getHandholdList = (params) => {
  return request(`${baseUrl}/manager/handheld-device-attends`,{
    method:'GET',
    urlParam: params,
  });
}
// 手持考勤统计
export const statisticsPerson = (params) => {
  return request(`${baseUrl}/manager/handheld-device-attends/statistics`,{
    method:'GET',
    urlParam: params,
  });
}
export const handStatistics = (params) => {
  return request(`${baseUrl}/manager/handheld-device-attends/statistics-list`,{
    method:'GET',
    urlParam: params,
  });
}

// 开卡管理（家长）
export const getParentsCardList = (params) => {
  return request(`${baseUrl}/manager/parent-card`,{
    method:'GET',
    urlParam: params,
  });
}
export const importParentsCard = (params) => {
  return request(`${baseUrl}/manager/parent-card/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const openParentsCard = (params) => {
  return request(`${baseUrl}/manager/parent-card/open-card`,{
    method:'POST',
    urlParam: params,
  });
}
// 卡片管理（家长）
export const getParentsCard = (params) => {
  return request(`${baseUrl}/manager/parent-card/get-person-info`,{
    method:'GET',
    urlParam: params,
  });
}
export const getParentsCardData = (params) => {
  return request(`${baseUrl}/manager/parent-card/get-card`,{
    method:'GET',
    urlParam: params,
  });
}
export const operateParentsCard = (params) => {
  return request(`${baseUrl}/manager/parent-card/operate-card`,{
    method:'POST',
    urlParam: params,
  });
}

export const getDirector = (params) => {
  return request(`${baseUrl}/manager/kindergarten-director/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const saveDirector = (params) => {
  return request(`${baseUrl}/manager/kindergarten-director/save`,{
    method:'POST',
    urlParam: params,
  });
}
// 记录类型管理（幼儿园）
export const getRecordTypeList = (params) => {
  return request(`${baseUrl}/manager/baby-record-type`,{
    method:'GET',
    urlParam: params,
  });
}
export const saveRecordTypes = (params) => {
  return request(`${baseUrl}/manager/baby-record-type/save-types`,{
    method:'POST',
    urlParam: params,
  });
}
// 导入预设学生
export const importStudent = (params) => {
  return request(`${baseUrl}/manager/course/pre-student-import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}

// 门禁联动设置
export const getRelateEntry = (params) => {
  return request(`${baseUrl}/manager/student-leave/get-relate-entry`,{
    method:'GET',
    urlParam: params,
  });
}

export const setRelateEntry = (params) => {
  return request(`${baseUrl}/manager/student-leave/set-relate-entry`,{
    method:'POST',
    urlParam: params,
  });
}

export const getDevicesList = (params) => {
  return request(`${baseUrl}/pub/entry-devices/list`,{
    method:'GET',
    urlParam: params,
  });
}
// 学生风采-数据统计列表
export const getStatisticsList = (params) => {
  return request(`${baseUrl}/manager/student-style/statistics`,{
    method:'GET',
    urlParam: params,
  });
}

// 数据大屏
export const aerialViewDetail = (params) => {
  return request(`${baseUrl}/manager/aerial-view/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const getDeviceList = (params) => {
  return request(`${baseUrl}/manager/devices`,{
    method:'GET',
    urlParam: params,
  });
}
export const getDeviceDetail = (params) => {
  return request(`${baseUrl}/manager/devices/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const editDevice = (params) => {
  return request(`${baseUrl}/manager/devices/update-device`,{
    method:'PUT',
    urlParam: params,
  });
}
export const addDevice = (params) => {
  return request(`${baseUrl}/manager/devices/create-device`,{
    method:'POST',
    urlParam: params,
  });
}
export const delDevice = (params) => {
  const devType = params.devType
  const devSn = params.devSn
  return request(`${baseUrl}/manager/devices/delete-device?devType=${devType}&devSn=${devSn}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const importDevice = (params) => {
  return request(`${baseUrl}/manager/devices/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}
export const getAllDevices = (params) => {
  return request(`${baseUrl}/manager/devices/list`,{
    method:'GET',
    urlParam: params,
  });
}
export const pointDel = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/aerial-view/${id}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const aerialViewPoints = (params) => {
  return request(`${baseUrl}/manager/aerial-view/points`,{
    method:'GET',
    urlParam: params,
  });
}
export const savePointPosition = (params) => {
  return request(`${baseUrl}/manager/aerial-view/update-points`,{
    method:'POST',
    urlParam: params,
  });
}
export const getDeviceType = (params) => {
  return request(`${baseUrl}/pub/devices/type-list`,{
    method:'GET',
    urlParam: params,
  });
}
export const aerialViewSet = (params) => {
  return request(`${baseUrl}/manager/aerial-view/set`,{
    method:'POST',
    urlParam: params,
  });
}
export const getParents = (params) => {
  return request(`${baseUrl}/manager/parents`,{
    method:'GET',
    urlParam: params,
  });
}
export const getParentsDetail = (params) => {
  return request(`${baseUrl}/manager/parents/detail`,{
    method:'GET',
    urlParam: params,
  });
}
export const deleteRelation = (params) => {
  const personId=params.personId
  const parentId=params.parentId
  return request(`${baseUrl}/manager/parents/delete-relation?personId=${personId}&parentId=${parentId}`,{
    method:'DELETE',
    urlParam: params,
  });
}
export const parentsAdd = (params) => {
  return request(`${baseUrl}/manager/parents/add`,{
    method:'POST',
    urlParam: params,
  });
}
export const parentsImport = (params) => {
  return request(`${baseUrl}/manager/parents/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}

export const bluetoothStudentRecord = (params) => {
  return request(`${baseUrl}/manager/bluetooth-entry-data/student`,{
    method:'GET',
    urlParam: params,
    formdata: true
  });
}

export const bluetoothTeacherRecord = (params) => {
  return request(`${baseUrl}/manager/bluetooth-entry-data/teacher`,{
    method:'GET',
    urlParam: params,
    formdata: true
  });
}

export const atSchoolStatisticsPerson = (params) => {
  return request(`${baseUrl}/manager/bluetooth-entry-data/in-school-rate`,{
    method:'GET',
    urlParam: params,
    formdata: true
  });
}

export const schoolListData = (params) => {
  return request(`${baseUrl}/manager/bluetooth-entry-data/in-school-list`,{
    method:'GET',
    urlParam: params,
    formdata: true
  });
}

export const getBuildPoints = (params) => {
  return request(`${baseUrl}/manager/build-points/list`,{
    method:'GET',
    urlParam: params
  });
}

export const setBuildPoints = (params) => {
  return request(`${baseUrl}/manager/build-points/set-points`,{
    method:'POST',
    urlParam: params
  });
}

export const getStepInfoByClass = (params) => {
  return request(`${baseUrl}/manager/bracelet/sports/get-step-info-by-class`,{
    method:'GET',
    urlParam: params
  });
}

export const getUnReachPersons = (params) => {
  return request(`${baseUrl}/manager/bracelet/sports/get-step-un-reach-persons`,{
    method:'GET',
    urlParam: params
  });
}

export const getInfoByClass = (params) => {
  return request(`${baseUrl}/manager/bracelet/temperature/get-info-by-class`,{
    method:'GET',
    urlParam: params
  });
}

export const getAbnormalPersons = (params) => {
  return request(`${baseUrl}/manager/bracelet/temperature/get-abnormal-persons`,{
    method:'GET',
    urlParam: params
  });
}

export const getEvaluationRecords = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-records`,{
    method:'GET',
    urlParam: params
  });
}

export const getEvaluationRecordsDetail = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-records/detail`,{
    method:'GET',
    urlParam: params
  });
}

export const updateEvaluationRecords = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-records/update-score`,{
    method:'POST',
    urlParam: params
  });
}

export const getEvaluationLogs = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-records/get-logs`,{
    method:'GET',
    urlParam: params
  });
}

export const getEvaluationGroupList = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-group/list`,{
    method:'GET',
    urlParam: params
  });
}

export const getEvaluationGroup = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-group`,{
    method:'GET',
    urlParam: params
  });
}

export const getEvaluationGroupDetail = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/class-evaluation-group/${id}`,{
    method:'GET',
    urlParam: params
  });
}

export const getUseGrade = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-group/use-grade`,{
    method:'GET',
    urlParam: params
  });
}

export const deleteEvaluationGroup=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/class-evaluation-group/${id}`,{
    method:'DELETE',
  });
}

export const addClassEvaluationGroup = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-group`,{
    method:'POST',
    urlParam: params
  });
}

export const modifyClassEvaluationGroup = (params) => {
  const id=params.id;
  return request(`${baseUrl}/manager/class-evaluation-group/${id}`,{
    method:'PUT',
    urlParam: params
  });
}

export const getSameScoreTypeGroup = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-group/same-score-type-group`,{
    method:'GET',
    urlParam: params
  });
}


// 考评项管理
export const copyClassEvaluationGroup = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-type/copy`,{
    method:'POST',
    urlParam: params
  });
}

export const geAppointSemesterGrade = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-type/appoint-semester-grade`,{
    method:'GET',
    urlParam: params
  });
}

export const getClassEvaluationType = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-type`,{
    method:'GET',
    urlParam: params
  });
}

export const addClassEvaluationType = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-type`,{
    method:'POST',
    urlParam: params
  });
}

export const getApointGroup = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-type/appoint-group`,{
    method:'GET',
    urlParam: params
  });
}

export const getGradeTree = (params) => {
  return request(`${baseUrl}/pub/grades/get-grade-tree`,{
    method:'GET',
    urlParam: params
  });
}

export const getSemestersList = (params) => {
  return request(`${baseUrl}/manager/school-semesters/list`,{
    method:'GET',
    urlParam: params
  });
}

export const deleteClassEvaluationType=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/class-evaluation-type/${id}`,{
    method:'DELETE',
  });
}

export const getClassEvaluationTypeDetail=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/class-evaluation-type/${id}`,{
    method:'GET',
  });
}

export const updateClassEvaluationType=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/class-evaluation-type/${id}`,{
    method:'PUT',
    urlParam:params
  });
}

export const getEvaluationFlagDetail = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-flag/detail`,{
    method:'GET',
    urlParam: params
  });
}

export const setEvaluationFlag = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-flag/set`,{
    method:'POST',
    urlParam: params
  });
}

export const weekObtainList = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/week-obtain`,{
    method:'GET',
    urlParam: params
  });
}

export const flagObtainDetail = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/flag-obtain-detail`,{
    method:'GET',
    urlParam: params
  });
}

export const flagDetailWeek = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/flag-detail`,{
    method:'GET',
    urlParam: params
  });
}


export const obtainFlag = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/obtain`,{
    method:'POST',
    urlParam: params
  });
}

export const getWeekList = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/week-list`,{
    method:'GET',
    urlParam: params
  });
}

export const getMonthList = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/month-list`,{
    method:'GET',
    urlParam: params
  });
}

export const getDailyDetail = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/daily-detail`,{
    method:'GET',
    urlParam: params
  });
}

export const getWeekDetail = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/week-detail`,{
    method:'GET',
    urlParam: params
  });
}

export const getMonthDetail = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-statistics/month-detail`,{
    method:'GET',
    urlParam: params
  });
}

export const getGradeByGroupId = (params) => {
  return request(`${baseUrl}/pub/grades/get-grade-by-group-id`,{
    method:'GET',
    urlParam: params
  });
}



//
export const getApointBySemesterIdAndGradeId = (params) => {
  return request(`${baseUrl}/manager/class-evaluation-type/appoint-semester-grade`,{
    method:'GET',
    urlParam: params
  });
}

//龙江路小学教师数据收集
export const customTypeList = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-items`,{
    method:'GET',
    urlParam: params
  });
}
export const copyCustomType = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-items/copy`,{
    method:'POST',
    urlParam: params
  });
}
export const delCustomType = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/teacher-honor-items/${id}`,{
    method:'DELETE',
    urlParam: params
  });
}
export const addCustomType = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-items`,{
    method:'POST',
    urlParam: params
  });
}
export const customTypeDetail = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/teacher-honor-items/${id}`,{
    method:'GET',
  });
}
export const editCustomType = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/teacher-honor-items/${id}`,{
    method:'PUT',
    urlParam: params
  });
}
export const getListByCate = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-items/get-list-by-cate`,{
    method:'GET',
    urlParam: params
  });
}
export const teacherDataList = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-records`,{
    method:'GET',
    urlParam: params
  });
}
export const dataAuditDetail = (params) => {
  const id = params.id
  return request(`${baseUrl}/manager/teacher-honor-records/${id}`,{
    method:'GET',
  });
}
export const auditSendBack = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-records/reject`,{
    method:'POST',
    urlParam: params
  });
}
export const auditApprove = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-records/approve`,{
    method:'POST',
    urlParam: params
  });
}
//二次导入
export const secondUploadStaff=(params)=> {
  return request(`${baseUrl}/manager/teacher-personnel-info/import`,{
  method: 'POST',
  urlParam: params,
  formdata: true
  });
}

export const getTeacherPersonnelInfo = (params) => {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-personnel-info/${id}`,{
    method: 'GET',
    // urlParam: params
  });
}

export const updateTeacherPersonnelInfo = (params) => {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-personnel-info/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}


export const getTeacherHonorRecords = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-personnel-records`,{
    method: 'GET',
    urlParam: params
  });
}

export const getTeacherHonorRecordsDetail = (params) => {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-honor-records/${id}`,{
    method: 'GET',
    urlParam: params
  });
}

export const getTeacherHonorRecordsApprove = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-records/approve`,{
    method: 'GET',
    urlParam: params
  });
}

export const getItemQuestions = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-items/get-item-questions`,{
    method: 'GET',
    urlParam: params
  });
}

export const addTeacherHonorPersonnelRecords = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-personnel-records/add`,{
    method: 'POST',
    urlParam: params
  });
}

export const changeTeacherHonorPersonnelRecords = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-personnel-records/change`,{
    method: 'POST',
    urlParam: params
  });
}

export const getTeacherHonorPersonnelRecordsDetail=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/teacher-honor-personnel-records/${id}`,{
    method: 'GET',
    urlParam: params
  });
}

export const deleteTeacherHonorPersonnelRecords=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/teacher-honor-personnel-records/${id}`,{
    method:'DELETE',
  });
}

export const getHonorStatistics = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-personnel-records/statistics`,{
    method: 'GET',
  });
}


export const modifyTeacherHonorPersonnelRecords = (params) => {
  return request(`${baseUrl}/manager/teacher-honor-personnel-records/modify`,{
    method: 'POST',
    urlParam: params
  });
}
// 多角色审批流
export const approvalRuleList = (params) => {
  return request(`${baseUrl}/manager/school-approval-rule`,{
    method: 'GET',
    urlParam: params
  });
}
export const delRoleApproval = (params) => {
  const id = params.id;
  return request(`${baseUrl}/manager/school-approval-rule/${id}`,{
    method: 'DELETE',
    urlParam: params
  });
}
export const addApproval = (params) => {
  return request(`${baseUrl}/manager/school-approval-rule`,{
    method: 'POST',
    urlParam: params
  });
}
export const getApprovalDetail = (params) => {
  const id = params.id;
  return request(`${baseUrl}/manager/school-approval-rule/${id}`,{
    method: 'GET',
  });
}
export const editApproval = (params) => {
  const id = params.id;
  return request(`${baseUrl}/manager/school-approval-rule/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}

export const getVoteList=(params)=> {
  return request(`${baseUrl}/manager/voting`,{
    method: 'GET',
    urlParam: params
  });
}

export const deleteVoting=(params)=> {
  const id=params.id;
  return request(`${baseUrl}/manager/voting/${id}`,{
    method:'DELETE',
  });
}

export const votingChange = (params) => {
  return request(`${baseUrl}/manager/voting/change`,{
    method: 'POST',
    urlParam: params
  });
}

export const getVotingDetail=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/voting/${id}`,{
    method: 'GET',
    // urlParam: params
  });
}

export const votingModify = (params) => {
  const id=params.id;
  return request(`${baseUrl}/manager/voting/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}

export const votingAdd=(params)=> {
  return request(`${baseUrl}/manager/voting`,{
    method: 'POST',
    urlParam: params
  });
}

export const getVotingStatistics=(params)=> {
  return request(`${baseUrl}/manager/voting/statistics`,{
    method: 'GET',
    urlParam: params
  });
}

export const getFunctionPlaces=(params)=> {
  return request(`${baseUrl}/manager/function-places`,{
    method: 'GET',
    urlParam: params
  });
}

export const addFunctionPlaces=(params)=> {
  return request(`${baseUrl}/manager/function-places`,{
    method: 'POST',
    urlParam: params
  });
}

export const getFunctionPlaceDetail=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/function-places/${id}`,{
    method: 'GET'
  });
}

export const updateFunctionPlaceDetail=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/function-places/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}

export const deleteFunctionPlace=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/function-places/${id}`,{
    method: 'DELETE'
  });
}

export const getFunctionPlacesApplyList=(params)=> {
  return request(`${baseUrl}/manager/function-places-apply`,{
    method: 'GET',
    urlParam: params
  });
}

export const deleteFunctionPlacesApplyItem=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/function-places-apply/${id}`,{
    method: 'DELETE',
  });
}

export const getFunctionPlacesApplyDetail=(params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/function-places-apply/${id}`,{
    method: 'GET',
  });
}

export const getPlaceStatistics=(params)=> {
  return request(`${baseUrl}/manager/function-places-apply/place-statistics`,{
    method: 'GET',
    urlParam: params
  });
}

export const getApplicantStatistics=(params)=> {
  return request(`${baseUrl}/manager/function-places-apply/applicant-statistics`,{
    method: 'GET',
    urlParam: params
  });
}


export const getFunctionRelateEntry=(params)=> {
  return request(`${baseUrl}/manager/function-places/get-relate-entry`,{
    method: 'GET',
    urlParam: params
  });
}

export const setFunctionRelateEntry=(params)=> {
  return request(`${baseUrl}/manager/function-places/set-relate-entry`,{
    method: 'POST',
    urlParam: params
  });
}

export const getPubApprovalRules=(params)=> {
  return request(`${baseUrl}/pub/school-approval-rules/list`,{
    method: 'GET',
    urlParam: params
  });
}
// 幼儿特殊情况管理
export const getSpecialCase = (params)=> {
  return request(`${baseUrl}/manager/special-matters-types`,{
    method: 'GET',
    urlParam: params
  });
}
export const delSpecialCase = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/special-matters-types/${id}`,{
    method: 'DELETE',
    urlParam: params
  });
}
export const addSpecialCase = (params)=> {
  return request(`${baseUrl}/manager/special-matters-types`,{
    method: 'POST',
    urlParam: params
  });
}
export const getSpecialCaseDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/special-matters-types/${id}`,{
    method: 'GET',
    urlParam: params
  });
}
export const editSpecialCase = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/special-matters-types/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}
export const getTypeList = (params)=> {
  return request(`${baseUrl}/manager/special-matters-types/get-list`,{
    method: 'GET',
    urlParam: params
  });
}
export const specialMasterRecord = (params)=> {
  return request(`${baseUrl}/manager/special-matters-records`,{
    method: 'GET',
    urlParam: params
  });
}
export const getRecordsDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/special-matters-records/${id}`,{
    method: 'GET',
    // urlParam: params
  });
}
// 校外申请管理
export const outsideApplyList = (params)=> {
  return request(`${baseUrl}/manager/outside-matters-types`,{
    method: 'GET',
    urlParam: params
  });
}
export const delOutsideApply = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/outside-matters-types/${id}`,{
    method: 'DELETE',
    urlParam: params
  });
}
export const addOutsideApply = (params)=> {
  return request(`${baseUrl}/manager/outside-matters-types`,{
    method: 'POST',
    urlParam: params
  });
}
export const getOutsideApplyDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/outside-matters-types/${id}`,{
    method: 'GET',
    urlParam: params
  });
}
export const editOutsideApply = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/outside-matters-types/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}
export const outsideTypeList = (params)=> {
  return request(`${baseUrl}/manager/outside-matters-types/get-list`,{
    method: 'GET',
    urlParam: params
  });
}
export const outsideApplyRecord = (params)=> {
  return request(`${baseUrl}/manager/outside-matters-records`,{
    method: 'GET',
    urlParam: params
  });
}
export const outsideApplyDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/outside-matters-records/${id}`,{
    method: 'GET',
  });
}

export const getAchievementTemplateList = (params)=> {
  return request(`${baseUrl}/manager/achievement/template`,{
    method: 'GET',
    urlParam: params
  });
}

export const addAchievementTemplate = (params)=> {
  return request(`${baseUrl}/manager/achievement/template`,{
    method: 'POST',
    urlParam: params
  });
}

export const getBranchList = (params)=> {
  return request(`${baseUrl}/manager/achievement/branch`,{
    method: 'GET',
    urlParam: params
  });
}

export const deleteAchievementTemplate = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/achievement/template/${id}`,{
    method: 'DELETE',
  });
}
export const getAchievementTemplateDetail = (params)=> {
  return request(`${baseUrl}/manager/achievement/template/detail`,{
    method: 'POST',
    urlParam: params
  });
}
export const getBranchPersons = (params)=> {
  return request(`${baseUrl}/manager/achievement/branch/get-persons`,{
    method: 'GET',
    urlParam: params
  });
}
export const addBranch = (params)=> {
  return request(`${baseUrl}/manager/achievement/branch`,{
    method: 'POST',
    urlParam: params
  });
}
export const updateBranch = (params)=> {
  const id = params.branchId;
  return request(`${baseUrl}/manager/achievement/branch/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}
export const deleteBranch = (params)=> {
  const id = params.branchId;
  return request(`${baseUrl}/manager/achievement/branch/${id}`,{
    method: 'DELETE'
  });
}

// 龙江路梦想之门-考核配置
export const assessmentList = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-items`,{
    method: 'GET',
    urlParam: params
  })
}
export const delAssessConfig = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-assessment-items/${id}`,{
    method: 'DELETE',
  });
}
export const assessmentRecords = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-records`,{
    method: 'GET',
    urlParam: params
  })
}
export const delAssessRecord = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-assessment-records/${id}`,{
    method: 'DELETE',
  });
}
export const getAssessmentRecordDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-assessment-records/${id}`,{
    method: 'GET',
  })
}
export const assessmentRecordsApprove=(params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-records/approve`,{
    method:'POST',
    urlParam: params
  });
}
export const assessmentRecordsReject=(params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-records/reject`,{
    method:'POST',
    urlParam: params
  });
}
export const getAssessmentItemList = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-items/get-list`,{
    method: 'GET',
    urlParam: params
  })
}
export const getAssessDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-assessment-items/${id}`,{
    method: 'GET',
  });
}
export const addAssessConfig = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-items`,{
    method: 'POST',
    urlParam: params
  });
}
export const updateAssessConfig = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-assessment-items/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}
export const assessmentQuotas = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-quotas`,{
    method: 'GET',
    urlParam: params
  });
}
export const addAssessTarget = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-quotas`,{
    method: 'POST',
    urlParam: params
  });
}
export const delAssessTarget = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-assessment-quotas/${id}`,{
    method: 'DELETE',
    urlParam: params
  });
}
export const updateAssessTarget = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/teacher-assessment-quotas/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}
export const getFirstTargetScore = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-quotas/get-quota-score`,{
    method: 'GET',
    urlParam: params
  });
}
export const saveFirstTargetScore = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-quotas/save-quota-score`,{
    method: 'POST',
    urlParam: params
  });
}
export const getSecondTargetScore = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-quotas/get-quota-questions`,{
    method: 'GET',
    urlParam: params
  });
}
export const saveSecondTargetScore = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-quotas/save-quota-questions`,{
    method: 'POST',
    urlParam: params
  });
}





export const getMaterial = (params)=> {
  return request(`${baseUrl}/manager/teacher-honor-records/get-material`,{
    method: 'GET',
    urlParam: params
  })
}

export const getAssessmentScoreDetail = (params)=> {
  return request(`${baseUrl}/manager/teacher-assessment-records/get-score`,{
    method: 'GET',
    urlParam: params
  })
}


export const getBranchDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/achievement/template/${id}`,{
    method: 'GET',
    // urlParam: params
  });
}

export const getBranchRelation = (params)=> {
  return request(`${baseUrl}/manager/achievement/branch-relation`,{
    method: 'GET',
    urlParam: params
  });
}

export const importBranchRelation=(params)=> {
  return request(`${baseUrl}/manager/achievement/branch-relation/import`,{
    method:'POST',
    urlParam: params,
    formdata: true
  });
}

export const getAchievementTemplate = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/achievement/template/${id}`,{
    method: 'GET',
  });
}

export const modifyMoney = (params)=> {
  const personId = params.personId;
  return request(`${baseUrl}/manager/achievement/person-item-relation/${personId}`,{
    method: 'PUT',
    urlParam: params
  });
}

export const getBranchRelation1 = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/achievement/branch-relation/${id}`,{
    method: 'GET',
    // urlParam: params
  });
}

export const cancelPublish = (params)=> {
  return request(`${baseUrl}/manager/achievement/template/cancel`,{
    method: 'POST',
    urlParam: params
  });
}

export const publishTemplate = (params)=> {
  return request(`${baseUrl}/manager/achievement/template/publish`,{
    method: 'POST',
    urlParam: params
  });
}

export const consultList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/consult/records`,{
    method: 'GET',
    urlParam: params
  });
}

export const delConsultList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/consult/records/${params.id}`,{
    method: 'DELETE',
  });
}

export const configDetail = (params)=> {
  return request(`${baseUrl}/manager/enrolment/consult/config/detail`,{
    method: 'GET',
    urlParam: params
  });
}

export const saveConfigConfigure = (params)=> {
  return request(`${baseUrl}/manager/enrolment/consult/config/save`,{
    method: 'POST',
    urlParam: params
  });
}


export const redirectSwyd = (params)=> {
  return request(`${baseUrl}/manager/sso/redirect-third-platform/swyd`,{
    method: 'GET',
    urlParam: params
  });
}

export const customTableList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/custom-forms`,{
    method: 'GET',
    urlParam: params
  });
}

export const addCustomTableList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/custom-forms`,{
    method: 'POST',
    urlParam: params
  });
}

export const editCustomTableList = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/enrolment/custom-forms/${id}`,{
    method: 'GET',
  });
}
export const editCustomTableListSave = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/enrolment/custom-forms/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}
export const delCustomTable = (params)=> {
  return request(`${baseUrl}/manager/enrolment/custom-forms/${params.id}`,{
    method: 'DELETE',
  });
}

export const chargeOrderList = (params)=> {
  return request(`${baseUrl}/manager/ic/charge-order`,{
    method: 'GET',
    urlParam: params
  });
}
export const visitList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/visit/records`,{
    method: 'GET',
    urlParam: params
  });
}
export const delVisitList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/visit/records/${params.id}`,{
    method: 'DELETE',
  });
}
export const visitDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/enrolment/visit/records/${id}`,{
    method: 'GET',
  });
}
export const saveVisitFeedback = (params)=> {
  return request(`${baseUrl}/manager/enrolment/visit/records/feedback`,{
    method: 'POST',
    urlParam: params
  });
}
export const configurationList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/custom-forms/get-list`,{
    method: 'GET',
    urlParam: params
  });
}
export const configurationDetail = (params)=> {
  return request(`${baseUrl}/manager/enrolment/config/detail`,{
    method: 'GET',
    urlParam: params
  });
}
export const saveConfigurationDetail = (params)=> {
  return request(`${baseUrl}/manager/enrolment/config/save`,{
    method: 'POST',
    urlParam: params
  });
}
export const entranceApplyList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/admission/records`,{
    method: 'GET',
    urlParam: params
  });
}
export const delApplyList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/admission/records/${params.id}`,{
    method: 'DELETE',
  });
}
export const entranceApplyDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/enrolment/admission/records/${id}`,{
    method: 'GET',
  });
}
export const saveTeacherHandle = (params)=> {
  return request(`${baseUrl}/manager/enrolment/admission/records/examine`,{
    method: 'POST',
    urlParam: params
  });
}
export const healthRegisterList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/health/records`,{
    method: 'GET',
    urlParam: params
  });
}
export const delHealthRegisterList= (params)=> {
  return request(`${baseUrl}/manager/enrolment/health/records/${params.id}`,{
    method: 'DELETE',
  });
}
export const healthRegisterDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/enrolment/health/records/${id}`,{
    method: 'GET',
  });
}
export const getDiseasesList = (params)=> {
  return request(`${baseUrl}/manager/enrolment/health/diseases`,{
    method: 'GET',
    urlParam: params
  });
}
export const diseasesDetail = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/enrolment/health/diseases/${id}`,{
    method: 'GET',
  });
}
export const editDiseasesDetailSave = (params)=> {
  const id = params.id;
  return request(`${baseUrl}/manager/enrolment/health/diseases/${id}`,{
    method: 'PUT',
    urlParam: params
  });
}
export const addDiseases = (params)=> {
  return request(`${baseUrl}/manager/enrolment/health/diseases`,{
    method: 'POST',
    urlParam: params
  });
}
export const delDiseasesList= (params)=> {
  return request(`${baseUrl}/manager/enrolment/health/diseases/${params.id}`,{
    method: 'DELETE',
  });
}


export const getAttendanceFixRuleList = (params) => {
  return request(`${baseUrl}/manager/attendance/fix-rule`,{
    method: 'GET',
    urlParam:params
  });
}

export const getAttendanceAllClass = (params) => {
  return request(`${baseUrl}/manager/attendance/fix-rule/classes`,{
    method: 'GET',
  });
}

export const getFixRuleDetail = (params) => {
  return request(`${baseUrl}/manager/attendance/fix-rule/${params.id}`,{
    method: 'GET',
  });
}

export const addFixRule = (params) => {
  return request(`${baseUrl}/manager/attendance/fix-rule`,{
    method: 'POST',
    urlParam:params
  });
}
export const updateFixRule = (params) => {
  return request(`${baseUrl}/manager/attendance/fix-rule/${params.id}`,{
    method: 'PUT',
    urlParam:params
  });
}
export const deleteFixRule = (params) => {
  return request(`${baseUrl}/manager/attendance/fix-rule/${params.id}`,{
    method: 'DELETE',
  });
}

export const getDepartmentTree = () => {
  return request(`${baseUrl}/manager/attendance/fix-rule/department-tree`,{
    method: 'GET',
  });
}

export const getAttendanceEarlyWarning = () => {
  return request(`${baseUrl}/manager/attendance/early-warning`,{
    method: 'GET',
  });
}

export const setAttendanceEarlyWarning = (params) => {
  return request(`${baseUrl}/manager/attendance/early-warning`,{
    method: 'POST',
    urlParam:params
  });
}
export const getAttendanceScheduleList = (params) => {
  return request(`${baseUrl}/manager/attendance/personal-schedule`,{
    method: 'GET',
    urlParam:params
  });
}
export const getAttendanceScheduleRule = () => {
  return request(`${baseUrl}/manager/attendance/personal-schedule-rule`,{
    method: 'GET',
  });
}
export const setAttendanceScheduleRule = (params) => {
  return request(`${baseUrl}/manager/attendance/personal-schedule-rule`,{
    method: 'POST',
    urlParam:params
  });
}

export const importScheduleRule = (params) => {
  return request(`${baseUrl}/manager/attendance/personal-schedule/import`,{
    method: 'POST',
    urlParam:params,
    formdata: true
  });
}
export const deleteScheduleRuleByPerson = (params) => {
  return request(`${baseUrl}/manager/attendance/personal-schedule/${params.id}`,{
    method: 'DELETE',
    urlParam:params,
  });
}
export const setScheduleRuleByPerson = (params) => {
  return request(`${baseUrl}/manager/attendance/personal-schedule/${params.id}`,{
    method: 'PUT',
    urlParam:params,
  });
}

export const getStudentMonthlyByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record/student-monthly`,{
    method: 'GET',
    urlParam:params,
  });
}
export const getTeachingMonthlyByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record/teaching-staff-monthly`,{
    method: 'GET',
    urlParam:params,
  });
}
export const getClassDailySurveyByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record/class-daily-survey`,{
    method: 'GET',
    urlParam:params,
  });
}

export const getDepartmentDailySurveyByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record/department-daily-survey`,{
    method: 'GET',
    urlParam:params,
  });
}

export const getClassDailyDetailByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record/student-daily`,{
    method: 'GET',
    urlParam:params,
  });
}

export const getDepartmentDailyDetailByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record/teaching-staff-daily`,{
    method: 'GET',
    urlParam:params,
  });
}

export const getGroupDailySurverByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record/group-daily-survey`,{
    method: 'GET',
    urlParam:params,
  });
}


export const getAttendanceRecordByPage = (params) => {
  return request(`${baseUrl}/manager/attendance/record`,{
    method: 'GET',
    urlParam:params,
  });
}

export const getPersonalMonthDaily = (params) => {
  return request(`${baseUrl}/manager/attendance/record/personal-month-daily`,{
    method: 'GET',
    urlParam:params,
  });
}
export const updatePersonalMonthDaily = (params) => {
  return request(`${baseUrl}/manager/attendance/record/update-status?id=${params.id}`,{
    method: 'PUT',
  });
}
export const getTaskList = (params)=> {
  return request(`${baseUrl}/manager/homework`,{
    method: 'GET',
    urlParam: params
  });
}
export const delTaskList = (params) => {
  return request(`${baseUrl}/manager/homework/${params.id}`,{
    method: 'DELETE',
  });
}
export const taskDetail = (params) => {
  return request(`${baseUrl}/manager/homework/${params.id}`,{
    method: 'GET',
  });
}
export const  albumsPublishers= (params) => {
  return request(`${baseUrl}/manager/student-albums/get-publishers`,{
    method: 'GET',
    urlParam: params
  });
}
export const savePublishers = (params) => {
  return request(`${baseUrl}/manager/student-albums/set-publishers`,{
    method: 'POST',
    urlParam:params
  });
}
export const  studentAlbumDetail= (params) => {
  return request(`${baseUrl}/manager/student-albums/list`,{
    method: 'GET',
    urlParam: params
  });
}
export const delStudentAlbum = (params) => {
  return request(`${baseUrl}/manager/student-albums/${params.recordId}`,{
    method: 'DELETE',
  });
}
export const getHealthStatusList = (params)=> {
  return request(`${baseUrl}/manager/health/records/students-list`,{
    method: 'GET',
    urlParam: params
  });
}
export const getHealthStatusDetail = (params)=> {
  return request(`${baseUrl}/manager/health/records/person-detail`,{
    method: 'GET',
    urlParam: params
  });
}
export const saveHealthStatus = (params) => {
  return request(`${baseUrl}/manager/health/records/save`,{
    method: 'POST',
    urlParam:params
  });
}


export const getChildActivityCront = () => {
  return request(`${baseUrl}/manager/child-activity-cront`,{
    method: 'GET',
  });
}
export const getChildActivityCrontDetail = (params) => {
  return request(`${baseUrl}/manager/child-activity-cront/${params.id}`,{
    method: 'GET',
  });
}

export const addChildActivityCront = (params) => {
  return request(`${baseUrl}/manager/child-activity-cront`,{
    method: 'POST',
    urlParam:params,
  });
}
export const modChildActivityCront = (params) => {
  return request(`${baseUrl}/manager/child-activity-cront/${params.id}`,{
    method: 'PUT',
    urlParam:params,
  });
}
export const deleteChildActivityCront = (params) => {
  return request(`${baseUrl}/manager/child-activity-cront/${params.id}`,{
    method: 'DELETE',
  });
}

export const addChildActivityTemplate = (params) => {
  return request(`${baseUrl}/manager/child-activity-template`,{
    method: 'POST',
    urlParam:params,
  });
}
export const modChildActivityTemplate = (params) => {
  return request(`${baseUrl}/manager/child-activity-template/${params.id}`,{
    method: 'PUT',
    urlParam:params,
  });
}
export const deleteChildActivityTemplate = (params) => {
  return request(`${baseUrl}/manager/child-activity-template/${params.id}`,{
    method: 'DELETE',
  });
}
export const getChildActivityTemplate = (params) => {
  return request(`${baseUrl}/manager/child-activity-template`,{
    method: 'GET',
    urlParam:params,
  });
}
export const getChildActivityTemplateDetail = (params) => {
  return request(`${baseUrl}/manager/child-activity-template/${params.id}`,{
    method: 'GET',
  });
}

export const getChildActivityRecordByPage = (params) => {
  return request(`${baseUrl}/manager/child-activity`,{
    method: 'GET',
    urlParam:params,
  });
}

export const getChildActivityRecordDetail = (params) => {
  return request(`${baseUrl}/manager/child-activity/${params.id}`,{
    method: 'GET',
  });
}

export const deleteChildActivityRecord = (params) => {
  return request(`${baseUrl}/manager/child-activity/${params.id}`,{
    method: 'DELETE',
  });
}

export const setChildActivityEnable = (params) => {
  return request(`${baseUrl}/manager/child-activity-template/enable`,{
    method: 'POST',
    urlParam:params,
  });
}

export const getBodyExaminationByPage = (params) => {
  return request(`${baseUrl}/manager/body-examination`,{
    method: 'GET',
    urlParam:params,
  });
}
export const getBodyExaminationConfigData = () => {
  return request(`${baseUrl}/manager/body-examination/standard-read`,{
    method: 'GET',
  });
}
export const setBodyExaminationConfigData = (params) => {
  return request(`${baseUrl}/manager/body-examination/standard-set`,{
    method: 'POST',
    urlParam:params,
  });
}
export const getBodyExaminationPerson = (params) => {
  return request(`${baseUrl}/manager/body-examination/person-info`,{
    method: 'GET',
    urlParam:params,
  });
}
export const getBodyExaminationSurvey = (params) => {
  return request(`${baseUrl}/manager/body-examination/survey`,{
    method: 'GET',
    urlParam:params,
  });
}
export const getBodyExaminationDetail = (params) => {
  return request(`${baseUrl}/manager/body-examination/${params.id}?date=${params.date}`,{
    method: 'GET',
  });
}
export const updateBodyExaminationDetail = (params) => {
  return request(`${baseUrl}/manager/body-examination/${params.personId}?date=${params.date}`,{
    method: 'PUT',
    urlParam:params,
  });
}
export const deleteBodyExaminationDetail = (params) => {
  return request(`${baseUrl}/manager/body-examination/${params.personId}?date=${params.date}`,{
    method: 'DELETE',
  });
}




// 门禁系统

// 获取所有门禁终端
export const pubEntryDevicesList = (params) => {
  return request(`${baseUrl}/pub/entry-devices/list`,{
    method: 'GET',
    urlParam:params,
  });
}

// 远程开门权限列表
export const doorList = (params) => {
  return request(`${baseUrl}/manager/entry/remote-open-door-authority`,{
    method: 'GET',
    urlParam:params,
  });
}

// 门禁详情
export const doorDetail = (params) => {
  const id=params.id
  return request(`${baseUrl}/manager/entry/remote-open-door-authority/${id}`,{
    method: 'GET',
  });
}

// 门禁新建
export const doorNew = (params) => {
  return request(`${baseUrl}/manager/entry/remote-open-door-authority`,{
    method: 'POST',
    urlParam:params,
  });
}

// 门禁更新
export const doorUpdate = (params) => {
  return request(`${baseUrl}/manager/entry/remote-open-door-authority/${params.id}`,{
    method: 'PUT',
    urlParam:params,
  });
}

// 门禁删除
export const doorDelete=(params)=> {
  const applyLeaveId=params.applyLeaveId
  return request(`${baseUrl}/manager/entry/remote-open-door-authority/${applyLeaveId}`,{
    method:'DELETE',
    // urlParam: params,
  });
}


export const getAllAccidentTypes = () => {
  return request(`${baseUrl}/manager/accident/types/get-all-list`,{
    method: 'GET',
  });
}
export const getAccidentListByPage = (params) => {
  return request(`${baseUrl}/manager/accident/records`,{
    method: 'GET',
    urlParam:params,
  });
}

export const getAccidentDetail = (params) => {
  return request(`${baseUrl}/manager/accident/records/${params.id}`,{
    method: 'GET',
  });
}
export const addAccidentRecord = (params) => {
  return request(`${baseUrl}/manager/accident/records`,{
    method: 'GET',
  });
}

export const modAccidentRecord = (params) => {
  return request(`${baseUrl}/manager/accident/records/${params.id}`,{
    method: 'PUT',
    urlParam:params,
  });
}

export const deleteAccidentRecord = (params) => {
  return request(`${baseUrl}/manager/accident/records/${params.id}`,{
    method: 'DELETE',
  });
}

export const addAccidentTypes = (params) => {
  return request(`${baseUrl}/manager/accident/types`,{
    method: 'POST',
    urlParam:params,
  });
}
export const modAccidentTypes = (params) => {
  return request(`${baseUrl}/manager/accident/types/${params.id}`,{
    method: 'PUT',
    urlParam:params,
  });
}
export const deleteAccidentTypes = (params) => {
  return request(`${baseUrl}/manager/accident/types/${params.id}`,{
    method: 'DELETE',
  });
}
export const getAccidentTypesByPage = (params) => {
  return request(`${baseUrl}/manager/accident/types`,{
    method: 'GET',
    urlParam:params,
  });
}
export const getAccidentTypesDetail = (params) => {
  return request(`${baseUrl}/manager/accident/types/${params.id}`,{
    method: 'GET',
  });
}



export const getAllListByCategory = (params) => {
  return request(`${baseUrl}/manager/accident/types/get-all-list-by-category?category=${params.id}`,{
    method: 'GET',
  });
}

export const getMonthlyEvents = (params) => {
  return request(`${baseUrl}/manager/accident/records/month-statistics-by-type?typeId=${params.typeId}`,{
    method: 'GET',
  });
}

export const getEventsBySearch = (params)=> {
  return request(`${baseUrl}/manager/accident/records/statistics-count-by-category`,{
    method: 'GET',
    urlParam: params
  });
}

export const getAllPersonData = (params) => {
  return request(`${baseUrl}/pub/persons/get-person-info?status=${params.status}`,{
    method: 'GET',
  });
}
