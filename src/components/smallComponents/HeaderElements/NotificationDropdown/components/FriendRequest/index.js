import classNames from 'classnames/bind';

import style from './FriendRequest.module.scss';
import { useEffect } from 'react';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import images from '~/assets/images';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import removeDb from '~/utils/databaseTools/dbRemoveMethod';
import { setDb } from '~/utils/databaseTools/dbWriteMethod';

const cx = classNames.bind(style);

function FriendRequest({ requestAuthorId }) {
  const currentUser = useSelector((state) => state.user);
  const [author, setAuthor] = useState({});

  const handleGetAuthorData = (uid) => {
    const userPath = `users/${uid}`;
    getDb(userPath).then((snapshot) => {
      setAuthor(snapshot.val() || {});
    });
  };

  const handleClearRequest = () => {
    const otherUserRelaPath = `users/${requestAuthorId}/relationships/${currentUser.uid}`;
    const currentUserRelaPath = `users/${currentUser.uid}/relationships/${requestAuthorId}`;
    removeDb(otherUserRelaPath);
    removeDb(currentUserRelaPath);
  };

  const handleAcceptRequest = () => {
    const otherUserFriendsPath = `users/${requestAuthorId}/friends/${currentUser.uid}`;
    const currentUserFriendsPath = `users/${currentUser.uid}/friends/${requestAuthorId}`;
    setDb(otherUserFriendsPath, '');
    setDb(currentUserFriendsPath, '');
    handleClearRequest();
  };

  useEffect(() => {
    handleGetAuthorData(requestAuthorId);

    return () => {};
  }, [requestAuthorId]);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('left')}>
        <div className={cx('left-user-avt-wrapper')}>
          <img className={cx('left-user-avt')} src={author.photoURL || images.defaultAvt} />
          <span className={cx('notification-type-img')}></span>
        </div>
      </div>

      <div className={cx('right')}>
        <div className={cx('right-title')}>
          <span className={cx('right-title-user-name')}>{`${author.displayName}`}</span>
          <span className={cx('right-title-desc')}>đã gửi cho bạn lời mời kết bạn</span>
        </div>
        <div className={cx('right-control')}>
          <button
            className={cx('btn', 'right-control-accept-btn')}
            onClick={() => {
              handleAcceptRequest();
            }}
          >
            Xác nhận
          </button>
          <button
            className={cx('btn', 'right-control-reject-btn')}
            onClick={() => {
              handleClearRequest();
            }}
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default FriendRequest;
