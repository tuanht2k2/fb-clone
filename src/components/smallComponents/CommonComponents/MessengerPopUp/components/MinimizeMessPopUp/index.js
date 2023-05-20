import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import classNames from 'classnames/bind';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

import { getDb } from '~/utils/databaseTools/dbReadMethod';

import style from './MinimizeMessPopUp.module.scss';

import { addMessgenger, removeMessgenger } from '~/actions/messenger';
import { onChildAdded, onValue } from 'firebase/database';
import getRef from '~/utils/databaseTools/dbGetRefMethod';

const cx = classNames.bind(style);

function MinimizeMessPopUp({ messKey }) {
  const currentUser = useSelector((state) => state.user);
  const [anotherPersonalMessMember, setAnotherPersonalMessMember] = useState({});
  const [isUnread, setIsUnread] = useState(false);

  const dispatch = useDispatch();

  // get user data by uid
  const handleGetUserData = async (uid) => {
    const userPath = `users/${uid}`;
    const userData = await getDb(userPath);
    return userData;
  };

  // get another user if messenger type is Personal
  const handelGetAnotherMembers = async (currentUid, members) => {
    for (const member in members) {
      if (member !== currentUid) {
        return await handleGetUserData(member);
      }
    }
  };

  const handleGetMessData = (messKey) => {
    const messPath = `messengers/${messKey}`;

    getDb(messPath).then((snapshot) => {
      const messData = snapshot.val();
      if (messData) {
        if (messData.type === 'personal') {
          handelGetAnotherMembers(currentUser.uid, messData.members).then((snapshot) => {
            const anotherMember = snapshot.val();
            setAnotherPersonalMessMember(anotherMember);
          });
        }
      }
    });
  };

  const handleOpenMessenger = () => {
    const addMessengerAction = addMessgenger(messKey);
    dispatch(addMessengerAction);
  };

  const handleCloseMessenger = (e) => {
    e.stopPropagation();
    const removeAction = removeMessgenger(messKey);
    dispatch(removeAction);
  };

  useEffect(() => {
    handleGetMessData(messKey);

    const messengerRef = getRef(`messengers/${messKey}/messageGroups`);
    onValue(messengerRef, () => {
      setIsUnread(true);
    });

    setIsUnread(false);

    return () => {};
  }, [currentUser]);

  return (
    <div
      className={cx('minimize-messenger-wrapper')}
      onClick={() => {
        handleOpenMessenger();
      }}
    >
      <img
        className={cx('minimize-messenger-avatar')}
        alt="Chưa tải được ảnh"
        src={anotherPersonalMessMember.photoURL}
      />
      <div className={cx('minimize-messenger-absolute')}>
        {isUnread && (
          <div
            className={cx('minimize-messenger-absolute-item', 'minimize-messenger-absolute-new-message-quantity')}
          ></div>
        )}
        <div
          className={cx('minimize-messenger-absolute-item', 'minimize-messenger-absolute-close')}
          onClick={(e) => {
            handleCloseMessenger(e);
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
      </div>
    </div>
  );
}

export default MinimizeMessPopUp;
