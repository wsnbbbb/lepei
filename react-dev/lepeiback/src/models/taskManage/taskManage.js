import { getAllSubject,getTaskList,delTaskList,taskDetail} from 'services/index';
export default {
	namespace: 'jobManage',

	state: {
		current: 1
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// eslint-disable-line
		}
	},

	effects: {
		*getAllSubject({ payload, callback }, { call, put }) {
			// 获取学科列表
			let res = yield call(getAllSubject, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*getTaskList({ payload, callback }, { call, put }) {
			// 获取作业列表
			let res = yield call(getTaskList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*delTaskList({ payload, callback }, { call, put }) {
			// 删除作业列表
			let res = yield call(delTaskList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*taskDetail({ payload, callback }, { call, put }) {
			// 作业详情
			let res = yield call(taskDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

	},

	reducers: {}
};
