const initialState = false;

const uploadAvatarBoxVisibleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW':
      return true;
    case 'HIDE':
      return false;
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

export default uploadAvatarBoxVisibleReducer;
