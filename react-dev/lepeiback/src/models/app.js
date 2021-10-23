
import { login } from 'services/index';
import { routerRedux } from 'dva/router'
export default {

    namespace: 'user',

    state: {
        current:1
    },

    subscriptions: {
      setup({ dispatch, history }) {  // eslint-disable-line
      },
    },

    effects: {
      * login({ payload }, { call, put }) {  // eslint-disable-line
        const loginData=yield call(login,payload)
        yield put({ type: 'save',payload:loginData.data });
      },
      * redirect ({ payload }, { put }) {
        yield put(routerRedux.push('/products', {name: 'dkvirus'}));
      },
    },

    reducers: {
      save(state, action) {
        return { ...state, ...action.payload };
      },
    },

  };
