import {post,get} from '../util/http'
// 获取学校
export const getSchool = (params) =>{
    return post('/web/public/school-detail',params)
}
export const uploadPic = (params) =>{
    return post('/common/qi-niu/upload-picture',params)
}
export const getQiNiuToken = (params) =>{
    return post('/web/public/upload-picture',params)
}
// 获取流程列表
export const getOutsideList = (params) =>{
    return post('/web/outside-matters/item-list',params)
}
// 获取记录列表
export const getApplyList = (params) =>{
    return post('/web/outside-matters/apply-list',params)
}
// 获取问题类型
export const questDetail = (params) =>{
    return post('/web/outside-matters/item-detail',params)
}
// 添加申请
export const submitApply = (params) =>{
    return post('/web/outside-matters/apply',params)
}
// 获取记录详情
export const applyDetail = (params) =>{
    return post('/web/outside-matters/apply-detail',params)
}
// 删除记录
export const delRecord = (params) =>{
    return post('/web/outside-matters/delete-apply',params)
}
