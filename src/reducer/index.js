import { combineReducers } from 'redux';
import userReducer from './userReducer';
import uploadAvatarBoxVisibleReducer from './uploadAvatarBoxVisibleReducer';
import { uploadImageReducer } from './uploadImageReducer';
import avatarUploadConfirmBoxVisibleReducer from './avatarUploadConfirmBoxVisibleReducer';
import rootReducer from './rootReducer';
import messengerReducer from './messengerReducer';

const appReducer = combineReducers({
  user: userReducer,
  tippyState: uploadAvatarBoxVisibleReducer,
  uploadFile: uploadImageReducer,
  avatarUploadConfirmBoxState: avatarUploadConfirmBoxVisibleReducer,
  messengerPopUp: messengerReducer,
});

export default appReducer;
