import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { handleUploadImageDb } from './database';

export const handleUpdateUserImage = (uid, file, actionType, caption, dispatch, handleHide) => {
  if (!file) return;

  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    },
    (error) => {
      console.log(error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        handleUploadImageDb(uid, downloadURL, actionType, caption, dispatch, handleHide);
      });
    },
  );
};

// export const handleSetCoverImage = ()
