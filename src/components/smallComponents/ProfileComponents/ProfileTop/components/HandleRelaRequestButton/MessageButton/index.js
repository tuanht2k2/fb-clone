import { useDispatch } from 'react-redux';

import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage } from '@fortawesome/free-solid-svg-icons';

import { equalTo, get, orderByChild, query } from 'firebase/database';
import getRef from '~/utils/databaseTools/dbGetRefMethod';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import { pushDb, setDb } from '~/utils/databaseTools/dbWriteMethod';

import { addMessgenger } from '~/actions/messenger';

import style from './MessageButton.module.scss';

const cx = classNames.bind(style);

function MessageButton({ sender, receiver }) {
  const dispatch = useDispatch();

  const handlePopUpMessenger = (messKey) => {
    const addMessgengerAction = addMessgenger(messKey);
    dispatch(addMessgengerAction);
  };

  const handleCreateMessenger = async (senderId, receiverId) => {
    const messengersPath = `messengers`;
    const createMessPromise = await pushDb(messengersPath, {
      type: 'personal',
      members: { [senderId]: 'admin', [receiverId]: 'normal_user' },
    })
      .then((snapshot) => {
        const newMessKey = snapshot.key;
        return newMessKey;
      })
      .then((newMessKey) => {
        const senderMessPath = `users/${senderId}/messengers/${newMessKey}`;
        const receiverMessPath = `users/${receiverId}/messengers/${newMessKey}`;
        setDb(senderMessPath, { type: 'personal' });
        setDb(receiverMessPath, { type: 'personal' });

        return newMessKey;
      });
    return createMessPromise;
  };

  const handleCheckMessengerExists = async (uid) => {
    const userMessengerPath = `users/${uid}/messengers`;
    const userMessegerRef = getRef(userMessengerPath);
    const queryRef = query(userMessegerRef, orderByChild('type'), equalTo('personal'));

    const snapshot = await get(queryRef);
    const personalMessengers = snapshot.val();
    if (personalMessengers) {
      const promises = Promise.all(
        Object.keys(personalMessengers).map(async (messKey) => {
          const messPath = `messengers/${messKey}`;

          const messSnapshot = await getDb(messPath);
          const messData = messSnapshot.val();

          if (messData)
            if ([receiver.uid] in messData.members) {
              return { key: messKey, data: messData };
            }
        }),
      );
      return promises;
    }
  };

  const handleOpenMessenger = (id) => {
    handleCheckMessengerExists(sender.uid).then((messDataList) => {
      const messData = messDataList?.find((messData) => !!messData);
      if (messData) {
        handlePopUpMessenger(messData.key);
      } else {
        handleCreateMessenger(sender.uid, receiver.uid).then((messKey) => {
          handlePopUpMessenger(messKey);
        });
      }
    });
  };

  return (
    <div
      className={cx('action-btn', 'gray-btn')}
      onClick={() => {
        handleOpenMessenger();
      }}
    >
      <span className={cx('action-btn-icon')}>
        <FontAwesomeIcon icon={faMessage} />
      </span>
      <span className={cx('action-btn-text')}>Nhắn tin</span>
    </div>
  );
}

export default MessageButton;
