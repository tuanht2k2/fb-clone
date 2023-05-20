import { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';

import { onValue } from 'firebase/database';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import removeDb from '~/utils/databaseTools/dbRemoveMethod';
import { setDb } from '~/utils/databaseTools/dbWriteMethod';

import style from './HandleRelaRequestButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMinus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import getRef from '~/utils/databaseTools/dbGetRefMethod';

const cx = classNames.bind(style);

function HandleRelaRequestButton({ currentUser, otherUser }) {
  const [relationship, setRelationship] = useState('NONE');

  // handle relationship

  const handleGetRelationShip = (uid) => {
    const relaPath = `users/${uid}/relationships/${currentUser.uid}`;
    const friendsPath = `users/${uid}/friends/${currentUser.uid}`;
    getDb(friendsPath).then((snapshot) => {
      if (snapshot.val() !== null) {
        setRelationship('FRIEND');
      } else {
        getDb(relaPath).then((snapshot) => {
          setRelationship(snapshot.val()?.status || 'NONE');
        });
      }
    });
  };

  const handleSendRequest = () => {
    const otherUserRelaPath = `users/${otherUser.uid}/relationships/${currentUser.uid}`;
    const currentUserRelaPath = `users/${currentUser.uid}/relationships/${otherUser.uid}`;
    setDb(otherUserRelaPath, { status: 'RECEIVE_REQUEST' });
    setDb(currentUserRelaPath, { status: 'REQUEST' });
    setRelationship('RECEIVE_REQUEST');
  };

  const handleClearRequest = () => {
    const otherUserRelaPath = `users/${otherUser.uid}/relationships/${currentUser.uid}`;
    const currentUserRelaPath = `users/${currentUser.uid}/relationships/${otherUser.uid}`;
    removeDb(otherUserRelaPath);
    removeDb(currentUserRelaPath);
  };

  const handleAcceptRequest = () => {
    const otherUserFriendsPath = `users/${otherUser.uid}/friends/${currentUser.uid}`;
    const currentUserFriendsPath = `users/${currentUser.uid}/friends/${otherUser.uid}`;
    setDb(otherUserFriendsPath, '');
    setDb(currentUserFriendsPath, '');
    handleClearRequest();
    setRelationship('FRIEND');
  };

  const handleCancelRequest = () => {
    handleClearRequest();
    setRelationship('NONE');
  };

  const handleRejectRequest = () => {
    handleClearRequest();
    setRelationship('NONE');
  };

  const handleUnFriend = () => {
    const otherUserFriendsPath = `users/${otherUser.uid}/friends/${currentUser.uid}`;
    const currentUserFriendsPath = `users/${currentUser.uid}/friends/${otherUser.uid}`;
    removeDb(otherUserFriendsPath);
    removeDb(currentUserFriendsPath);
    setRelationship('NONE');
    handleClearRequest();
  };

  useEffect(() => {
    handleGetRelationShip(otherUser.uid);

    // const otherUserRelaPath = `users/${otherUser.uid}/relationships/${currentUser.uid}`;
    // const otherUserRelaRef = getRef(otherUserRelaPath);

    // onValue(otherUserRelaRef, () => {
    //   handleGetRelationShip(otherUser.uid);
    // });
  }, [otherUser]);

  return (
    <Fragment>
      {relationship === 'NONE' ? (
        <div
          className={cx('action-btn', 'link-btn')}
          onClick={() => {
            handleSendRequest();
          }}
        >
          <span className={cx('action-btn-icon', 'light-text')}>
            <FontAwesomeIcon icon={faUserPlus} />
          </span>
          <span className={cx('action-btn-text', 'light-text')}>Thêm bạn bè</span>
        </div>
      ) : relationship === 'RECEIVE_REQUEST' ? (
        <div
          className={cx('action-btn', 'link-btn')}
          onClick={() => {
            handleCancelRequest();
          }}
        >
          <span className={cx('action-btn-icon', 'light-text')}>
            <FontAwesomeIcon icon={faUserMinus} />
          </span>
          <span className={cx('action-btn-text', 'light-text')}>Hủy lời mời</span>
        </div>
      ) : relationship === 'REQUEST' ? (
        <HeadlessTippy
          trigger="click"
          interactive
          placement="right-start"
          render={() => (
            <div className={cx('handle-rela-request-btn-wrapper')}>
              <button
                className={cx('handle-rela-request-btn')}
                onClick={() => {
                  handleAcceptRequest();
                }}
              >
                Chấp nhận
              </button>
              <button
                className={cx('handle-rela-request-btn')}
                onClick={() => {
                  handleRejectRequest();
                }}
              >
                Từ chối
              </button>
            </div>
          )}
        >
          <div className={cx('action-btn', 'link-btn')}>
            <span className={cx('action-btn-icon', 'light-text')}>
              <FontAwesomeIcon icon={faUserPlus} />
            </span>
            <span className={cx('action-btn-text', 'light-text')}>Đã gửi cho bạn lời mời kết bạn</span>
          </div>
        </HeadlessTippy>
      ) : relationship === 'FRIEND' ? (
        <div
          className={cx('action-btn', 'link-btn')}
          onClick={() => {
            handleUnFriend();
          }}
        >
          <span className={cx('action-btn-icon', 'light-text')}>
            <FontAwesomeIcon icon={faUserMinus} />
          </span>
          <span className={cx('action-btn-text', 'light-text')}>Hủy kết bạn</span>
        </div>
      ) : null}
    </Fragment>
  );
}

export default HandleRelaRequestButton;
