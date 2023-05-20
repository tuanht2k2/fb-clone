import { getDownloadURL } from 'firebase/storage';
import { uploadImage } from '../../cloudStorageTools';
import removeDb from '../dbRemoveMethod';
import { pushDb, setDb } from '../dbWriteMethod';

const editPost = (postKey, postData, postCaption, mediaFile, cleanUpFunc) => {
  const mediaKey = postData.media;
  const userKey = postData.uid;

  const handleRemoveMediaFile = () => {
    removeDb(`media/images/${mediaKey}`).then(() => {
      removeDb(`users/${userKey}/images/${mediaKey}`);
      removeDb(`posts/${postKey}/media`);
      removeDb(`posts/${postKey}/mediaDownloadURL`);
    });
  };

  const handleUploadMediaDb = (mediaDownloadURL) => {
    pushDb(`media/images`, { uid: userKey, mediaDownloadURL: mediaDownloadURL }).then((snapshot) => {
      const imageKey = snapshot.key;
      setDb(`posts/${postKey}/media`, '');
      setDb(`posts/${postKey}/mediaDownloadURL`, mediaDownloadURL);
      setDb(`users/${userKey}/images/${imageKey}`, { imgId: imageKey, mediaDownloadURL: mediaDownloadURL });
    });
  };

  const handleUploadMediaFile = () => {
    const uploadTask = uploadImage(mediaFile);

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
          handleUploadMediaDb(downloadURL);
        });
      },
    );
  };

  setDb(`posts/${postKey}/caption`, postCaption)
    .then(() => {
      if (mediaFile === 'DELETE_MEDIA_FILE') {
        handleRemoveMediaFile();
      } else if (mediaFile) {
        handleRemoveMediaFile();
        handleUploadMediaFile();
      }
    })
    .then(() => {
      cleanUpFunc();
    });
};

export default editPost;
