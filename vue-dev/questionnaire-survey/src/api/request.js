import {post,get} from '../util/http'

export const getSchool = (params) =>{
    return post('/web/visit-records/logo',params)
}
export const getList = (params) =>{
    return post('/web/questionnaires/list',params)
}
export const questDetail = (params) =>{
    return post('/web/questionnaires/detail',params)
}
export const submit = (params) =>{
    return post('/web/questionnaires/answer',params)
}
export const uploadPic = (params) =>{
    return post('/common/qi-niu/upload-picture',params)
}
export const getQiNiuToken = (params) =>{
    return post('/qi-niu/upload-picture',params)
}
