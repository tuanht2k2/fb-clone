const initialState = false;

const avatarUploadConfirmBoxVisibleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_AVATAR_UP_LOAD_CONFIRM_BOX':
      return true;
    case 'HIDE_AVATAR_UP_LOAD_CONFIRM_BOX':
      return false;
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};

export default avatarUploadConfirmBoxVisibleReducer;
