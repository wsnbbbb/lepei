import Login from "../views/Login.vue";
import NotFound from "../views/404.vue";
import Home from "../views/Home.vue";

import Select from "../views/Select.vue";

import devStatus from "../views/entryManage/devStatus.vue";
import devConfig from "../views/entryManage/devConfig.vue";
import devStatusQuery from "../views/entryManage/devStatusQuery.vue";
import cameraStatus from "../views/entryManage/cameraStatus.vue";
import entryTimeConfig from "../views/entryManage/entryTimeConfig.vue";
import addEntryTime from "../views/entryManage/addEntryTime.vue";
import entryRuleConfig from "../views/entryManage/entryRuleConfig.vue";
import addEntryRule from "../views/entryManage/addEntryRule.vue";
import emitEntryRule from "../views/entryManage/emitEntryRule.vue";
import entryDataList from "../views/entryManage/entryDataList.vue";
import cameraStatusQuery from "../views/entryManage/cameraStatusQuery.vue";
import editEntryRule from "../views/entryManage/editEntryRule.vue";
import editEntryTime from "../views/entryManage/editEntryTime.vue";
import records from "../views/entryManage/records.vue";
import devManage from "../views/entryManage/devManage.vue";
import thermometryStatusQuery from "../views/entryManage/thermometryStatusQuery.vue";
import faceRegistFail from "../views/entryManage/faceRegistFail.vue";
import adjustStrategy from "../views/entryManage/adjustStrategy.vue";

// 度目人脸识别
import duFaceDevice from "../views/dumuFace/duFaceDevice.vue";
import nativeFaceLibrary from "../views/dumuFace/nativeFaceLibrary.vue";
import discernRecord from "../views/dumuFace/discernRecord.vue";
import faceLibrary from "../views/dumuFace/faceLibrary.vue";
import registerDetail from "../views/dumuFace/registerDetail.vue";
import devInit from "../views/dumuFace/devInit.vue";
import onlineRecord from "../views/dumuFace/onlineRecord.vue";
import setScreenSaver from "../views/dumuFace/setScreenSaver.vue";
import itemSetDetail from "../views/dumuFace/itemSetDetail.vue";
import systemSetting from "../views/dumuFace/systemSetting.vue";

// 蓝牙定位
import baseStationManage from "../views/bluetoothLocation/baseStationManage.vue";
import locationIDManage from "../views/bluetoothLocation/locationIDManage.vue";
import stationHistory from "../views/bluetoothLocation/stationHistory.vue";
import braceletManage from "../views/bluetoothLocation/braceletManage.vue";
import healthData from "../views/bluetoothLocation/healthData.vue";
import healthHistory from "../views/bluetoothLocation/healthHistory.vue";
import locationData from "../views/bluetoothLocation/locationData.vue";
import locationDataHistory from "../views/bluetoothLocation/locationDataHistory.vue";
import dailyTrack from "../views/bluetoothLocation/dailyTrack.vue";
import electricData from "../views/bluetoothLocation/electricData.vue";
import braceletSummary from "../views/bluetoothLocation/braceletSummary.vue";

export const routes = [
  {
    path: "/login",
    component: Login,
    name: "login",
    meta: { title: "登录" },
    hidden: true,
  },
  {
    path: "/select",
    component: Select,
    name: "select",
    hidden: true,
  },
  {
    path: "/404",
    component: NotFound,
    name: "404",
    meta: { title: "选择入口" },
    hidden: true,
  },
];

export const weigenRoutes = [
  {
    path: "/",
    component: Home,
    name: "Home",
    iconCls: "el-icon-setting", //图标样式class
    meta: { title: "校园门禁" },
    children: [
      { path: "/devConfig", name: "devConfig", component: devConfig, meta: { keepAlive: true, title: "门禁终端配置" } },
      {
        path: "/devStatus",
        name: "devStatus",
        component: devStatus,
        meta: { keepAlive: true, title: "门禁终端状态查询" },
      },
      {
        path: "/devStatusQuery/:devSn",
        name: "devStatusQuery",
        component: devStatusQuery,
        hidden: true,
        meta: { title: "门禁终端历史记录查询" },
      },
      {
        path: "/cameraStatus",
        name: "cameraStatus",
        component: cameraStatus,
        meta: { keepAlive: true, title: "摄像头状态查询" },
      },
      {
        path: "/cameraStatusQuery/:devSn",
        name: "cameraStatusQuery",
        component: cameraStatusQuery,
        hidden: true,
        meta: { title: "摄像头历史记录查询" },
      },
      {
        path: "/entryTimeConfig",
        name: "entryTimeConfig",
        component: entryTimeConfig,
        meta: { keepAlive: true, title: "门禁时段配置" },
      },
      {
        path: "/addEntryTime",
        name: "addEntryTime",
        component: addEntryTime,
        hidden: true,
        meta: { title: "门禁时段添加" },
      },
      {
        path: "/editEntryTime/:index",
        name: "editEntryTime",
        component: editEntryTime,
        hidden: true,
        meta: { title: "门禁时段编辑" },
      },
      {
        path: "/entryRuleConfig",
        name: "entryRuleConfig",
        component: entryRuleConfig,
        meta: { title: "门禁终端策略配置" },
      },
      { path: "/adjustStrategy", name: "adjustStrategy", component: adjustStrategy, meta: { title: "调整人员策略" } },
      {
        path: "/addEntryRule",
        name: "addEntryRule",
        component: addEntryRule,
        hidden: true,
        meta: { title: "门禁终端策略添加" },
      },
      {
        path: "/editEntryRule/:id",
        name: "editEntryRule",
        component: editEntryRule,
        hidden: true,
        meta: { title: "门禁终端策略编辑" },
      },
      { path: "/emitEntryRule", name: "emitEntryRule", component: emitEntryRule, meta: { title: "下发策略" } },
      { path: "/entryDataList", name: "entryDataList", component: entryDataList, meta: { title: "门禁记录查询" } },
      { path: "/records", name: "records", component: records, meta: { title: "门禁实时出入" } },
      // { path: '/devManage',name: 'devManage', component: devManage, meta: { title: "设备状态查询" } },
      {
        path: "/thermometryStatusQuery/:devSn",
        name: "thermometryStatusQuery",
        component: thermometryStatusQuery,
        hidden: true,
        meta: { title: "终端历史在线状态" },
      },
      // { path: '/faceRegistFail',name: 'faceRegistFail', component: faceRegistFail, meta: { title: "人脸注册失败结果" }},
    ],
  },
  {
    path: "*",
    hidden: true,
    redirect: { path: "/404" },
  },
];

// 度目人脸识别
export const duFaceRoutes = [
  {
    path: "/",
    component: Home,
    name: "Home",
    meta: { title: "人脸识别管理" },
    iconCls: "el-icon-setting", //图标样式class
    children: [
      { path: "/du-face-device", component: duFaceDevice, meta: { title: "设备管理" } },
      {
        path: "/native-face-library/:devSn",
        component: nativeFaceLibrary,
        meta: { title: "本机人脸库" },
        hidden: true,
      },
      { path: "/online-record/:devSn", component: onlineRecord, meta: { title: "在线记录" }, hidden: true },
      { path: "/device-init", component: devInit, meta: { title: "初始化" }, hidden: true },
      { path: "/face-library", component: faceLibrary, meta: { title: "人脸库" } },
      { path: "/register-detail/:personId", component: registerDetail, meta: { title: "注册详情" }, hidden: true },
      { path: "/discern-record", component: discernRecord, meta: { title: "识别记录" } },
      { path: "/system-setting", component: systemSetting, meta: { title: "系统设置" } },
      { path: "/set-screen-saver", component: setScreenSaver, meta: { title: "设置屏保" }, hidden: true },
      { path: "/item-set-detail", component: itemSetDetail, meta: { title: "修改结果" }, hidden: true },
    ],
  },
  {
    path: "*",
    hidden: true,
    redirect: { path: "/404" },
  },
];

// 蓝牙定位
export const bluetoothLocationRoutes = [
  {
    path: "/",
    component: Home,
    name: "Home",
    meta: { title: "蓝牙定位" },
    iconCls: "el-icon-setting", //图标样式class
    children: [
      { path: "/base-station-manage", component: baseStationManage, meta: { title: "基站管理" } },
      { path: "/locationID-manage", component: locationIDManage, meta: { title: "位置ID管理" } },
      { path: "/station-history/:devSn", component: stationHistory, meta: { title: "历史记录" }, hidden: true },
      { path: "/bracelet-manage", component: braceletManage, meta: { title: "手环管理" },keepAlive:true },
      { path: "/health-data", name:"healthData", component: healthData, meta: { title: "健康数据查询",keepAlive:true } },
      { path: "/health-history/:personId", component: healthHistory, meta: { title: "历史记录" }, hidden: true },
      { path: "/location-data", name:"locationData", component: locationData, meta: { title: "定位数据查询",keepAlive:true } },
      {
        path: "/locationData-history/:personId",
        component: locationDataHistory,
        meta: { title: "历史记录" },
        hidden: true,
      },
      { path: "/daily-track/:personId", component: dailyTrack, meta: { title: "每日轨迹" }, hidden: true },
      { path: "/electric-data", component: electricData, meta: { title: "手环电量查询" } },
      { path: "/bracelet-summary", component: braceletSummary, meta: { title: "数据概览" } },
    ],
  },

  {
    path: "*",
    hidden: true,
    redirect: { path: "/404" },
  },
];
