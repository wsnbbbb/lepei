import {post,get} from '../util/http'

export const login = (params) =>{
    return post('/user/login',params)
}

export const changePassword = (params) =>{
    return post('/api/account/modify-password',params)
}

export const clock = (params) =>{
    return post('/api/sign/quick',params)
}

export const currentData = (params) =>{
    return post('/epidemic/statistics',params)
}

export const getSignList = (params) =>{
    return post('/api/sign/list',params)
}

export const getAppoint = (params) =>{
    return post('/api/sign/get-appoint-date-punch',params)
}

export const punch = (params) =>{
    return post('/api/sign/punch',params)
}

export const getBase = (params) =>{
    return post('/api/account/base',params)
}

export const setBase = (params) =>{
    return post('/api/account/set-base',params)
}

export const getSchoolList = (params) =>{
    return post('/school/list',params)
}

export const getCustodyBase = (params) =>{
    return post('/api/account/custody',params)
}

export const setCustodyBase = (params) =>{
    return post('/api/account/set-custody',params)
}

export const setTraffic = (params) =>{
    return post('/api/account/set-traffic',params)
}
export const getGrade = (params) =>{
    return post('/grade/type',params)
}
export const getGradeList = (params) =>{
    return post('/grade/list',params)
}
export const getClass = (params) =>{
    return post('/classes/list',params)
}
export const refresh = (params) =>{
    return post('/api/account/show',params)
}
export const toWriteInfo = (params) =>{
    return post('/managers/login',params)
}
export const completeCount  = (params) =>{
    return post('/manager/information/complete-count',params)
}
export const getMessPerson  = (params) =>{
    return post('/manager/school-person/detail',params)
}
export const fillPersonInfo  = (params) =>{
    return post('/manager/school-person/apply',params)
}
export const messPersonList  = (params) =>{
    return post('/manager/school-person/list',params)
}
export const dirverList  = (params) =>{
    return post('/manager/school-bus-driver/list',params)
}
export const schoolBusList  = (params) =>{
    return post('/manager/school-car/list',params)
}
export const getDirverInfo  = (params) =>{
    return post('/manager/school-bus-driver/detail',params)
}
export const addDirverInfo  = (params) =>{
    return post('/manager/school-bus-driver/apply',params)
}
export const getSchoolBus  = (params) =>{
    return post('/manager/school-car/detail',params)
}

export const fillSchoolBus  = (params) =>{
    return post('/manager/school-car/apply',params)
}
export const signDel  = (params) =>{
    return post('/api/sign/delete',params)
}
export const alienInfoCount  = (params) =>{
    return post('/manager/information/foreign-national-apply-complete',params)
}
export const alienInfoDetail  = (params) =>{
    return post('/manager/information/contact',params)
}
export const alienInfoAdd  = (params) =>{
    return post('/manager/information/set-contact',params)
}
export const alienPersonDetail  = (params) =>{
    return post('/manager/information/foreign-national-apply-detail',params)
}
export const fillAlienInfo  = (params) =>{
    return post('/manager/information/foreign-national-apply',params)
}
export const getAreaList  = (params) =>{
    return post('/area/list',params)
}
export const getGradeClass  = (params) =>{
    return post('/api/base/grade-class',params)
}
export const bindClass  = (params) =>{
    return post('/api/base/bind-class',params)
}
export const teachClassList  = (params) =>{
    return post('/api/base/teach-class',params)
}
export const deleteBind  = (params) =>{
    return post('/api/base/delete-bind',params)
}

export const getClockList  = (params) =>{
    return post('/api/sign/record',params)
}

