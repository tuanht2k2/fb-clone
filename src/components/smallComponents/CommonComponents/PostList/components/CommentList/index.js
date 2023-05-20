import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import { onValue } from 'firebase/database';
import { getDb } from '../../../../../../utils/databaseTools/dbReadMethod';
import getRef from '../../../../../../utils/databaseTools/dbGetRefMethod';

import CommentItem from '../CommentItem';
import style from './CommentList.module.scss';
import CreateComment from './components/CreateComment';

const cx = classNames.bind(style);

function CommentList({ postId, postAuthorId }) {
  const [commentList, setCommentList] = useState({});
  const [isFriend, setIsFriend] = useState(false);
  const user = useSelector((state) => state.user);

  const handleGetComments = () => {
    getDb(`posts/${postId}/comments`).then((snapshot) => {
      setCommentList(snapshot.val() || {});
    });
  };

  const handleCheckFriendShip = () => {
    const postAuthorFriendPath = `users/${postAuthorId}/friends/${user.uid}`;
    getDb(postAuthorFriendPath).then((snapshot) => {
      setIsFriend(snapshot.val() === null ? false : true);
    });
  };

  useEffect(() => {
    handleGetComments();

    postAuthorId !== user.uid ? handleCheckFriendShip() : setIsFriend(true);

    const commentListRef = getRef(`posts/${postId}/comments`);
    onValue(commentListRef, (snapshot) => {
      handleGetComments();
    });
  }, [postId, postAuthorId]);
  return (
    <div className={cx('wrapper')}>
      {Object.keys(commentList).length > 0 && (
        <ul className={cx('comment-list-wrapper')}>
          {Object.keys(commentList)
            .reverse()
            .map((comment, index) => {
              const data = commentList[comment];
              return <CommentItem key={comment} i={index} postId={postId} commentId={comment} commentData={data} />;
            })}
        </ul>
      )}
      {isFriend ? (
        <CreateComment user={user} postId={postId} />
      ) : (
        <div className={cx('not-friend-notice')}>Bạn cần phải kết bạn với người này để bình luận</div>
      )}
    </div>
  );
}

export default CommentList;
