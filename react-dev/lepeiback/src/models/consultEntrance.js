import { consultList, delConsultList, saveConfigConfigure, configDetail,customTableList,
	addCustomTableList,editCustomTableList,editCustomTableListSave,delCustomTable,visitList,delVisitList,
	visitDetail,saveVisitFeedback,configurationList,entranceApplyList,delApplyList,saveTeacherHandle,
    configurationDetail,saveConfigurationDetail, entranceApplyDetail,healthRegisterList,delHealthRegisterList,
    healthRegisterDetail,getDiseasesList,diseasesDetail,editDiseasesDetailSave,addDiseases,delDiseasesList} from 'services/index';
export default {
	namespace: 'consultEntrance',

	state: {
		current: 1
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// eslint-disable-line
		}
	},

	effects: {
		*getConsultList({ payload, callback }, { call, put }) {
			// 获取咨询登记列表
			let res = yield call(consultList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

		*delConsultList({ payload, callback }, { call, put }) {
			// 咨询登记列表删除
			let res = yield call(delConsultList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

		*configDetail({ payload, callback }, { call, put }) {
			// 配置详情
			let res = yield call(configDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

		*saveConfigConfigure({ payload, callback }, { call, put }) {
			// 保存咨询登记配置
			let res = yield call(saveConfigConfigure, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

		*getCustomTableList({ payload, callback }, { call, put }) {
			// 获取自定义表格列表
			let res = yield call(customTableList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

		*addCustomTableList({ payload, callback }, { call, put }) {
			// 新增自定义表格
			let res = yield call(addCustomTableList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

		*editCustomTableList({ payload, callback }, { call, put }) {
			// 自定义表格详情
			let res = yield call(editCustomTableList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*editCustomTableListSave({ payload, callback }, { call, put }) {
			// 自定义表格编辑
			let res = yield call(editCustomTableListSave, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*delCustomTable({ payload, callback }, { call, put }) {
			// 自定义表格编辑
			let res = yield call(delCustomTable, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*getVisitList({ payload, callback }, { call, put }) {
			// 获取参观登记列表
			let res = yield call(visitList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*delVisitList({ payload, callback }, { call, put }) {
			// 咨询登记列表删除
			let res = yield call(delVisitList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*visitDetail({ payload, callback }, { call, put }) {
			// 参观登记详情
			let res = yield call(visitDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*saveVisitFeedback({ payload, callback }, { call, put }) {
			// 保存参观反馈
			let res = yield call(saveVisitFeedback, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*configurationList({ payload, callback }, { call, put }) {
			// 配置项列表
			let res = yield call(configurationList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*configurationDetail({ payload, callback }, { call, put }) {
			// 配置项详情
			let res = yield call(configurationDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*saveConfigurationDetail({ payload, callback }, { call, put }) {
			// 保存参观、入学、健康登记配置
			let res = yield call(saveConfigurationDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*entranceApplyList({ payload, callback }, { call, put }) {
			// 入学申请列表
			let res = yield call(entranceApplyList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*delApplyList({ payload, callback }, { call, put }) {
			// 入学申请列表删除
			let res = yield call(delApplyList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*entranceApplyDetail({ payload, callback }, { call, put }) {
			// 入学申请详情
			let res = yield call(entranceApplyDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*saveTeacherHandle({ payload, callback }, { call, put }) {
			// 保存入学申请教师操作
			let res = yield call(saveTeacherHandle, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*healthRegisterList({ payload, callback }, { call, put }) {
			// 健康登记列表
			let res = yield call(healthRegisterList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*delHealthRegisterList({ payload, callback }, { call, put }) {
			// 健康登记表删除
			let res = yield call(delHealthRegisterList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*healthRegisterDetail({ payload, callback }, { call, put }) {
			// 健康登记详情
			let res = yield call(healthRegisterDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*getDiseasesList({ payload, callback }, { call, put }) {
			// 既往病史列表
			let res = yield call(getDiseasesList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*diseasesDetail({ payload, callback }, { call, put }) {
			// 疾病详情
			let res = yield call(diseasesDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*editDiseasesDetailSave({ payload, callback }, { call, put }) {
			// 疾病详情编辑保存
			let res = yield call(editDiseasesDetailSave, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*addDiseases({ payload, callback }, { call, put }) {
			// 疾病添加
			let res = yield call(addDiseases, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*delDiseasesList({ payload, callback }, { call, put }) {
			// 疾病删除
			let res = yield call(delDiseasesList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

	},

	reducers: {}
};
