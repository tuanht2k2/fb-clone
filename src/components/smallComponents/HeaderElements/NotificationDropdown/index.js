import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';

import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';

import { equalTo, get, onValue, orderByChild, query, ref } from 'firebase/database';
import { database } from '~/firebase';
import getRef from '~/utils/databaseTools/dbGetRefMethod';

import { AncIcon } from '~/assets/Icons';
import FriendRequest from './components/FriendRequest';
import style from './NotificationDropdown.module.scss';

const cx = classNames.bind(style);

function NotificationDropdown() {
  const user = useSelector((state) => state.user);
  const [firendRequests, setFriendsRequest] = useState({});

  const handleGetUserRelationships = (uid) => {
    const userRelationshipsPath = `users/${uid}/relationships`;

    const friendRequestRef = query(
      ref(database, userRelationshipsPath),
      orderByChild('status'),
      equalTo('RECEIVE_REQUEST'),
    );

    get(friendRequestRef).then((snapshot) => {
      setFriendsRequest(snapshot.val() || {});
    });
  };

  useEffect(() => {
    handleGetUserRelationships(user.uid);

    const relationshipRef = getRef(`users/${user.uid}/relationships`);
    onValue(relationshipRef, (snapshot) => {
      handleGetUserRelationships(user.uid);
    });

    return () => {};
  }, [user]);
  return (
    <HeadlessTippy
      interactive
      offset={[0, 8]}
      trigger="click"
      placement="bottom-end"
      render={(attrs) => (
        <div className={cx('wrapper')}>
          {Object.keys(firendRequests).length > 0 ? (
            <Fragment>
              <header className={cx('header')}>Thông báo</header>
              <div className={cx('notification-group')}>
                <div className={cx('notification-group-header')}>
                  <div className={cx('notification-group-header-title')}>Lời mời kết bạn</div>
                </div>
                <div className={cx('notification-group-header-main')}>
                  {Object.keys(firendRequests).map((request) => (
                    <FriendRequest key={`friendRequest${request}`} requestAuthorId={request} />
                  ))}
                </div>
              </div>
            </Fragment>
          ) : (
            <div className={cx('empty-notification')}>Bạn không có không báo nào</div>
          )}
        </div>
      )}
    >
      <li className={cx('notification-icon-wrapper')}>
        <AncIcon width={'21px'} height={'21px'} />
        {Object.keys(firendRequests).length > 0 && (
          <span className={cx('notification-quantity')}>{Object.keys(firendRequests).length}</span>
        )}
      </li>
    </HeadlessTippy>
  );
}

export default NotificationDropdown;
