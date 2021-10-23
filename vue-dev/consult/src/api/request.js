import {post,get} from '../util/http'


export const getConfigs = (params) =>{
    return post('/web/enrolment/consult/get-configs',params)
}

export const consultApply = (params) =>{
    return post('/web/enrolment/consult/apply',params)
}
export const getPersonInfo = (params) =>{
    return post('/web/enrolment/visit/get-person-info',params)
}
export const getFromDetail = (params) =>{
    return post('/web/enrolment/public/get-form',params)
}
export const submitDetail = (params) =>{
    return post('/web/enrolment/visit/apply',params)
}
export const login = (params) =>{
    return post('/pads/login',params)
}
export const getQiNiuToken = (params) =>{
    return post('/web/public/upload-picture',params)
}
export const getSchool = (params) =>{
    return post('/web/public/school-detail',params)
}
export const entranceApply = (params) =>{
    return post('web/enrolment/admission/apply',params)
}
export const getDiseases = (params) =>{
    return post('web/enrolment/health/get-diseases',params)
}
export const healthSubmit = (params) =>{
    return post('web/enrolment/health/apply',params)
}
export const getPerson = (params) =>{
    return post('web/enrolment/public/get-persons',params)
}
export const getVisitPerson = (params) =>{
    return post('web/enrolment/visit/get-person-info',params)
}
export const getConsultPerson = (params) =>{
    return post('web/enrolment/consult/get-person-info',params)
}
export const getHealthPerson = (params) =>{
    return post('web/enrolment/health/apply-detail',params)
}
export const healthSubmitTwo = (params) =>{
    return post('web/enrolment/health/edit-apply',params)
}