import removeDb from '../dbRemoveMethod';

const deletePost = async (postId, postData) => {
  const handleCheckType = () => {
    switch (postData.type) {
      case 'UPLOAD_AVATAR':
        removeDb(`users/${postData.uid}/photoURL`);
        break;
      case 'UPLOAD_COVER_IMAGE':
        removeDb(`users/${postData.uid}/coverImageURL`);
        break;
      default:
        return;
    }
  };

  const promise = Promise.all(
    removeDb(`media/images/${postData.mediaId}`),
    removeDb(`users/${postData.uid}/images/${postData.mediaId}`),
    removeDb(`posts/${postId}`),
    removeDb(`users/${postData.uid}/posts/${postId}`),
    handleCheckType(),
  );
  return promise;
};

export default deletePost;
