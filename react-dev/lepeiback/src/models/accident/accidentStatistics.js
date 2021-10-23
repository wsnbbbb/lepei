/**
 * 意外事件统计-models
 */
import { getMonthlyEvents, getAllListByCategory, getEventsBySearch } from 'services/index';
export default {
	namespace: 'accidentStatistics',

	state: {},

	subscriptions: {
		setup({ dispatch, history }) {
			// eslint-disable-line
		}
	},

	effects: {
		*getMonthlyEvents({ payload, callback }, { call, put }) {
			let res = yield call(getMonthlyEvents, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*getAllListByCategory({ payload, callback }, { call, put }) {
			let res = yield call(getAllListByCategory, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
    *getEventsBySearch({ payload, callback }, { call, put }) {
			let res = yield call(getEventsBySearch, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		}
	},

	reducers: {
		save(state, action) {
			return { ...state, ...action.payload };
		}
	}
};
