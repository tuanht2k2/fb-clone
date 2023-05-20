const initialState = {};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD':
      return action.payload;
    case 'UPDATE':
      const newData = { ...state, ...action.payload };
      return newData;
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
