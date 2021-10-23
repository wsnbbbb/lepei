import { getHealthStatusList,getHealthStatusDetail,saveHealthStatus} from 'services/index';
export default {
	namespace: 'dailyHealthStatus',

	state: {
		current: 1
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// eslint-disable-line
		}
	},

	effects: {
		*getHealthStatusList({ payload, callback }, { call, put }) {
			// 获取健康状态列表
			let res = yield call(getHealthStatusList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
        *getHealthStatusDetail({ payload, callback }, { call, put }) {
			// 获取健康状态详情
			let res = yield call(getHealthStatusDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
        *saveHealthStatus({ payload, callback }, { call, put }) {
			// 保存健康状态详情
			let res = yield call(saveHealthStatus, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

	},

	reducers: {}
};
