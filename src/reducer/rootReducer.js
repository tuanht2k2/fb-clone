import appReducer from '.';

const rootReducer = (state, action) => {
  switch (action.type) {
    case 'SIGN_OUT':
      return appReducer(null, action);
    default:
    // return appReducer(state, action);
  }
};

export default rootReducer;
