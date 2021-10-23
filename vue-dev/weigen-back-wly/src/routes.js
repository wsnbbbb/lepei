import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'

import devStatus from './views/entryManage/devStatus.vue'
import devConfig from './views/entryManage/devConfig.vue'
import devStatusQuery from './views/entryManage/devStatusQuery.vue'
import entryTimeConfig from './views/entryManage/entryTimeConfig.vue'
import addEntryTime from './views/entryManage/addEntryTime.vue'
import entryRuleConfig from './views/entryManage/entryRuleConfig.vue'
import addEntryRule from './views/entryManage/addEntryRule.vue'
import entryDataList from './views/entryManage/entryDataList.vue'
import editEntryRule from './views/entryManage/editEntryRule.vue'
import editEntryTime from './views/entryManage/editEntryTime.vue'
import personList from './views/personManage/personList'
import accountList from './views/personManage/accountList'
import personImport from './views/personManage/personImport'

import store from './vuex/store'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    }, 
    {
        path: '/',
        component: Home,
        name: '基础管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/personList', component: personList, name: '人员管理' },
            { path: '/accountList', component: accountList, name: '系统账号' , hidden: false },
            { path: '/personImport', component: personImport, name: '人员导入', hidden: true },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '门禁管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/devConfig', component: devConfig, name: '终端配置' },
            { path: '/devStatus', component: devStatus, name: '终端状态查询' },
            { path: '/devStatusQuery/:devSn', component: devStatusQuery, name: '终端历史记录查询', hidden: true },
            // { path: '/cameraStatus', component: cameraStatus, name: '摄像头状态查询' },
            // { path: '/cameraStatusQuery/:devSn', component: cameraStatusQuery, name: '摄像头历史记录查询', hidden: true },
            { path: '/entryTimeConfig', component: entryTimeConfig, name: '门禁时段配置' },
            { path: '/addEntryTime', component: addEntryTime, name: '门禁时段添加' , hidden: true },
            { path: '/editEntryTime/:index', component: editEntryTime, name: '门禁时段编辑' , hidden: true },
            { path: '/entryRuleConfig', component: entryRuleConfig, name: '门禁终端策略配置' },
            { path: '/addEntryRule', component: addEntryRule, name: '门禁终端策略添加' , hidden: true },
            { path: '/editEntryRule/:id', component: editEntryRule, name: '门禁终端策略编辑' , hidden: true },
            // { path: '/emitEntryRule', component: emitEntryRule, name: '下发策略' },
            { path: '/entryDataList', component: entryDataList, name: '门禁记录查询' },
            // { path: '/records', component: records, name: '门禁实时出入' },
        ]
    },
 
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;