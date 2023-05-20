import { getDownloadURL } from 'firebase/storage';
import { uploadImage } from '../../cloudStorageTools';
import { pushDb, setDb } from '../dbWriteMethod';

const createPost = (uid, type, caption, file, audience, timeCreate, handleResetComponent, handleHideComponent) => {
  if (file) {
    const uploadTask = uploadImage(file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {},
      (err) => {
        console.log(err);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            const imageObj = { uid, mediaDownloadURL: downloadURL };

            pushDb(`media/images`, imageObj).then((snapshot) => {
              const imageKey = snapshot.key;
              const postPath = `posts`;
              const postObj = {
                uid,
                type,
                caption,
                mediaId: imageKey,
                mediaDownloadURL: downloadURL,
                audience,
                timeCreate,
              };

              pushDb(postPath, postObj).then((snapshot) => {
                const postKey = snapshot.key;
                const userPath = `users/${uid}`;
                setDb(`${userPath}/images/${imageKey}`, { ...imageObj, parentPost: postKey });
                setDb(`${userPath}/posts/${postKey}`, '');
              });
            });
          })
          .then(handleResetComponent())
          .then(() => {
            handleHideComponent();
          });
      },
    );
  } else {
    const postObj = { uid, type, caption, media: '', audience, timeCreate };
    pushDb('posts', postObj)
      .then((snapshot) => {
        const postKey = snapshot.key;
        const userPath = `users/${uid}`;
        setDb(`${userPath}/posts/${postKey}`, postObj);
      })
      .then(() => {
        handleResetComponent();
      })
      .then(() => {
        handleHideComponent();
      });
  }
};

export default createPost;
