import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

// upload and get file download URL

const uploadFile = async (path, file) => {
  const storage = getStorage();
  const fileRef = ref(storage, path);

  const metadata = {
    contentType: 'image/jpeg',
  };

  const downloadURL = await uploadBytesResumable(fileRef, file, metadata).then((snapshot) => {
    return getDownloadURL(snapshot.ref);
  });

  return downloadURL;
};

export default uploadFile;
