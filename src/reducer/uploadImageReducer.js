const initialState = {
  type: '',
  data: '',
};

export const uploadImageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPLOAD_AVATAR':
      return { type: action.type, data: action.payload };
    case 'UPLOAD_COVER_IMAGE':
      return { type: action.type, data: action.payload };
    case 'CANCEL':
      return action.payload;
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
};
