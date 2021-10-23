import { personList,albumsPublishers,savePublishers,studentAlbumDetail,delStudentAlbum} from 'services/index';
export default {
	namespace: 'studentAlbum',

	state: {
		current: 1
	},

	subscriptions: {
		setup({ dispatch, history }) {
			// eslint-disable-line
		}
	},

	effects: {
		*personList({ payload, callback }, { call, put }) {
			// 获取学生列表
			let res = yield call(personList, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
        *albumsPublishers({ payload, callback }, { call, put }) {
			// 获取发布人配置详情
			let res = yield call(albumsPublishers, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
        *savePublishers({ payload, callback }, { call, put }) {
			// 保存发布人配置
			let res = yield call(savePublishers, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
        *studentAlbumDetail({ payload, callback }, { call, put }) {
			// 学生相册详情
			let res = yield call(studentAlbumDetail, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},
		*delStudentAlbum({ payload, callback }, { call, put }) {
			// 学生相册删除
			let res = yield call(delStudentAlbum, payload);
			if (callback && typeof callback === 'function') {
				callback(res);
			}
		},

	},

	reducers: {}
};
