import * as Api from './service';

export default {
  namespace: 'index',
  state: {
    my: '',
    test: 'test'
  },

  effects: {
    * effectsDemo (_, { call, put }) {
      const { status, data } = yield call(Api.demo, {});
      if (status === 'ok') {
        yield put({
          type: 'save',
          payload: {
            topData: data,
          }
        });
      }
    },
  },

  reducers: {
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
