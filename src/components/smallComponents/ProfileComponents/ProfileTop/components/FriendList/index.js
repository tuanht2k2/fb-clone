import { useState, useEffect } from 'react';

import classNames from 'classnames/bind';

import style from './FriendList.module.scss';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import { Fragment } from 'react';
import images from '~/assets/images';

const cx = classNames.bind(style);

function FriendList({ friendList }) {
  const [friendListData, setFriendListData] = useState([]);

  const handleGetFriendListData = async (friendList) => {
    const friendListDataPromise = Object.keys(friendList).map(async (friendId) => {
      const friendPath = `users/${friendId}`;
      const friendData = await getDb(friendPath).then((snapshot) => snapshot.val());
      return friendData;
    });

    const friendListData = Promise.all(friendListDataPromise);

    friendListData.then((friendList) => setFriendListData(friendList));
  };

  useEffect(() => {
    handleGetFriendListData(friendList);

    return () => {};
  }, [friendList]);

  return (
    <Fragment>
      {friendListData.length > 0 && (
        <div className={cx('friend-list-wrapper')}>
          <div className={cx('friend-list-quantity')}>{`${friendListData.length} bạn bè`}</div>
          <div className={cx('friend-list-main')}>
            {friendListData.map((user) => (
              <div key={`FriendList-friend-list-main-item${user.uid}`} className={cx('friend-list-main-item')}>
                <img className={cx('friend-list-main-item-img')} src={user.photoURL || images.defaultAvt} />
              </div>
            ))}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default FriendList;
