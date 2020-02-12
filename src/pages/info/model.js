import * as Api from './service';

export default {
  namespace: 'info',
  state: {
    data: [],
  },

  effects: {
    * getData (_, { call, put }) {
      const { error, data } = yield call(Api.getData);
      console.log('getData', error, data)
      if (error == '0') {
        yield put({
          type: 'save',
          payload: {
            data: data,
          }
        });
      }
    },
  },

  reducers: {
    save (state, { payload }) {
      console.log(payload)
      return { ...state, ...payload };
    },
  },

};
