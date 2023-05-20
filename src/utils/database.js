import { get, onValue, push, ref, set, child, update } from 'firebase/database';
import { database } from '../firebase';
import { updateUser } from '../actions/user';
import { setDb } from './databaseTools/dbWriteMethod';

const camelToSnake = (str) =>
  str.replace(/[A-Z]/g, (c) => {
    return '_' + c.toLowerCase();
  });

// user
export const writeUserDataAfterSignUp = (user) => {
  setDb(`users/${user.uid}`, user);
};

export const handleUploadUserImage = (type, uid, img, dispatch, handleHide) => {
  let key;
  switch (type) {
    case 'UPLOAD_AVATAR':
      key = 'photoURL';
      break;
    case 'UPLOAD_COVER_IMAGE':
      key = 'coverImageURL';
      break;
  }

  update(ref(database, `users/${uid}`), { [key]: img }).then(() => {
    const updateUserAction = updateUser({ [key]: img });
    dispatch(updateUserAction);
    handleHide();
  });
};

export const handleUploadImageForUser = (uid, imgId, mediaDownloadURL) => {
  const data = {
    uid: uid,
    imgId: imgId,
    mediaDownloadURL: mediaDownloadURL,
  };
  set(ref(database, `users/${uid}/images/${imgId}`), data);
};

export const handleUploadPostForUser = (uid, postId) => {
  set(ref(database, `users/${uid}/posts/${postId}`), '');
};

export const handleUploadPost = (
  uid,
  via,
  type,
  caption,
  mediaType,
  mediaId,
  mediaUrl,
  timeCreate,
  dispatch,
  handleHide,
) => {
  const data = {
    uid: uid,
    via: via,
    type: type,
    caption: caption,
    mediaType: mediaType,
    mediaId: mediaId,
    mediaDownloadURL: mediaUrl,
    timeCreate: timeCreate,
  };

  push(ref(database, `posts/`), data).then((snapshot) => {
    const key = snapshot.key;
    handleUploadPostForUser(uid, key);
  });

  handleUploadUserImage(type, uid, mediaUrl, dispatch, handleHide);
};

export const handleUploadImageDb = (authorUid, mediaDownloadURL, type, caption, dispatch, handleHide) => {
  const image = {
    authorUid: authorUid,
    mediaDownloadURL: mediaDownloadURL,
  };
  push(ref(database, `media/images`), image).then((snapshot) => {
    const key = snapshot.key;
    handleUploadImageForUser(authorUid, key, mediaDownloadURL);
    handleUploadPost(authorUid, 'user', type, caption, 'img', key, mediaDownloadURL, Date.now(), dispatch, handleHide);
  });
};
