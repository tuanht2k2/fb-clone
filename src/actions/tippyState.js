export const hideTippy = () => ({
  type: 'HIDE',
  payload: false,
});

export const showTippy = () => ({
  type: 'SHOW',
  payload: true,
});

export const showAvatarUploadConfirmBox = () => ({
  type: 'SHOW_AVATAR_UP_LOAD_CONFIRM_BOX',
  payload: true,
});

export const hideAvatarUploadConfirmBox = () => ({
  type: 'HIDE_AVATAR_UP_LOAD_CONFIRM_BOX',
  payload: true,
});
