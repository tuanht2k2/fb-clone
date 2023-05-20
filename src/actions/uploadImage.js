export const uploadImage = (file, type) => ({
  type: type,
  payload: file,
});

export const cancelUpload = () => ({
  type: 'CANCEL',
  payload: { type: '', data: '' },
});
