import { storage } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const uploadImage = (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return uploadTask;
};

export default uploadImage;
