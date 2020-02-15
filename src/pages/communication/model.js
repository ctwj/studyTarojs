export default {
  namespace: 'communication',
  state: {
    isShow: false
  },

  reducers: {
    toggleShow (state, { payload }) {
      console.log()
      return { ...state, ...payload };
    },
    save (state, { payload }) {
      return { ...state, ...payload };
    },
  },

};
