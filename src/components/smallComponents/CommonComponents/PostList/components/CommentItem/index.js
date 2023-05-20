import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

import { getDb } from '~/utils/databaseTools/dbReadMethod';
import { getPeriod } from '~/utils/Time';
import { setDb } from '~/utils/databaseTools/dbWriteMethod';
import images from '~/assets/images';
import removeDb from '~/utils/databaseTools/dbRemoveMethod';
import style from './CommentItem.module.scss';

const cx = classNames.bind(style);

function CommentItem({ i, postId, commentId, commentData }) {
  const currentUser = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const [isReactedComment, setIsReactedComment] = useState(false);

  const handleReact = () => {
    setIsReactedComment((pre) => !pre);
  };

  const handleReactComment = (reactionType) => {
    handleReact();
    const commentReactionsPath = `comments/${commentId}/reactions/${currentUser.uid}`;
    const postCommentsReactionsPath = `posts/${postId}/comments/${commentId}/reactions/${currentUser.uid}`;
    if (isReactedComment) {
      removeDb(commentReactionsPath);
      removeDb(postCommentsReactionsPath);
    } else {
      const reactionObj = {
        uid: currentUser.uid,
        type: reactionType,
        postId: postId,
      };

      setDb(commentReactionsPath, reactionObj);
      setDb(postCommentsReactionsPath, reactionObj);
    }
  };

  useEffect(() => {
    // get user who comments
    const userPath = `users/${commentData.uid}`;
    getDb(userPath).then((snapshot) => {
      setUser(snapshot.val());
    });

    // check user reacted this comment or not
    const commentReactionsPath = `comments/${commentId}/reactions/${currentUser.uid}`;
    getDb(commentReactionsPath).then((snapshot) => {
      setIsReactedComment(!!snapshot.val());
    });

    // listen for react change
  }, []);

  return (
    <li className={cx('wrapper')}>
      <Link to={`users/${commentData.uid}/home`} className={cx('comment-user-avatar-wrapper')}>
        <img className={cx('comment-user-avatar-img')} src={user.photoURL || images.defaultAvt} />
      </Link>
      <div className={cx('comment-detail-wrapper')}>
        <div className={cx('comment-detail-top')}>
          <div className={cx('comment-detail-top-left')}>
            <Link to={`users/${commentData.uid}/home`} className={cx('commment-detail-user-name')}>
              {user.displayName}
            </Link>
            <span className={cx('commment-detail-text')}>{commentData.text}</span>
            {!!commentData.reactions && (
              <span className={cx('like-icon-wrapper')}>
                <img className={cx('like-icon-img')} src={images.emoLike} />
                <span className={cx('like-icon-quantity')}>{Object.keys(commentData.reactions).length}</span>
              </span>
            )}
          </div>
          <div className={cx('comment-detail-top-right')}>
            <FontAwesomeIcon icon={faEllipsis} />
          </div>
        </div>
        <div className={cx('comment-detail-bottom')}>
          <span
            className={cx('comment-detail-bottom-item', 'like', isReactedComment ? 'active' : null)}
            onClick={() => {
              handleReactComment('like');
            }}
          >
            Thích
          </span>
          <span className={cx('comment-detail-bottom-item', 'time')}>{getPeriod(commentData.timeCreate)}</span>
        </div>
      </div>
    </li>
  );
}

export default CommentItem;
