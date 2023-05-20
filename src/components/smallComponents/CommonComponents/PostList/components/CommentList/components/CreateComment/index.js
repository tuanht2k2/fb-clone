import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import { pushDb, setDb } from '~/utils/databaseTools/dbWriteMethod';

import images from '~/assets/images';
import style from './CreateComment.module.scss';

const cx = classNames.bind(style);

function CreateComment({ user, postId }) {
  const [createCommentValue, setCreateCommentValue] = useState('');
  const textAreaRef = useRef();

  const handleTypeComment = (value) => {
    setCreateCommentValue(value);
  };

  const handleSubmitComment = (e) => {
    const commentObj = { uid: user.uid, postId: postId, timeCreate: Date.now(), text: createCommentValue };
    pushDb('comments', commentObj)
      .then((snapshot) => {
        const commentId = snapshot.key;
        setDb(`posts/${postId}/comments/${commentId}`, commentObj);
        // setDb(`users/${postAuthorId}/posts/${postId}/comments/${commentId}`, commentObj);
      })
      .then(() => {
        setCreateCommentValue('');
      });
  };

  const handleCreateCommentKeyDown = (e) => {
    if (e.keyCode == 13) {
      if (!e.shiftKey) {
        e.preventDefault();
        if (createCommentValue.trim()) {
          handleSubmitComment();
        }
      }
    }
  };

  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  return (
    <div className={cx('create-comment-wrapper')}>
      <Link to={`profile/${user.uid}/home`} className={cx('create-comment-user-avatar-wrapper')}>
        <img className={cx('user-avatar-img')} src={user.photoURL || images.defaultAvt} />
      </Link>
      <form
        className={cx('create-comment-form')}
        onSubmit={(e) => {
          handleSubmitComment(e);
        }}
      >
        <textarea
          ref={textAreaRef}
          id="type-comment-input"
          className={cx('type-comment-input')}
          placeholder="Viết bình luận..."
          value={createCommentValue}
          onChange={(e) => {
            handleTypeComment(e.target.value);
          }}
          onKeyDown={(e) => {
            handleCreateCommentKeyDown(e);
          }}
        ></textarea>
        <span
          className={cx('submit-comment-icon-wrapper', !!createCommentValue ? 'enabled' : null)}
          onClick={
            createCommentValue
              ? (e) => {
                  handleSubmitComment(e);
                }
              : null
          }
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </span>
      </form>
    </div>
  );
}

export default CreateComment;
