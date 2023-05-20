import { useState, useEffect } from 'react';

import classNames from 'classnames/bind';

import { getDb } from '~/utils/databaseTools/dbReadMethod';

import style from './MessengerItem.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import images from '~/assets/images';
import getRef from '~/utils/databaseTools/dbGetRefMethod';
import { get, limitToLast, onValue, query } from 'firebase/database';
import { Fragment } from 'react';
import { getPeriod } from '~/utils/Time';
import { addMessgenger } from '~/actions/messenger';

const cx = classNames.bind(style);

function MessengerItem({ messengerKey }) {
  const currentUser = useSelector((state) => state.user);

  const [messengerData, setMessengerData] = useState({});
  const [anotherPersonalMessMember, setAnotherPersonalMessMember] = useState({});
  const [lastMessage, setLastMessage] = useState(null);
  const [hasNewMesaage, setHasNewMessage] = useState(false);

  const dispatch = useDispatch();

  // get User data
  const handleGetUserData = async (uid) => {
    const userPath = `users/${uid}`;
    const userData = await getDb(userPath);
    return userData;
  };

  // get another member of the messenger when messenger's type is Personal
  const handelGetAnotherMembers = async (currentUid, members) => {
    for (const member in members) {
      if (member !== currentUid) {
        return await handleGetUserData(member);
      }
    }
  };

  const handleGetMessengerData = (messKey) => {
    const messPath = `messengers/${messKey}`;

    getDb(messPath).then((snapshot) => {
      const messData = snapshot.val();
      if (messData) {
        setMessengerData(messData);
        if (messData.type === 'personal') {
          handelGetAnotherMembers(currentUser.uid, snapshot.val().members).then((snapshot) => {
            const anotherMember = snapshot.val();
            setAnotherPersonalMessMember(anotherMember);
          });
        }
      }
    });
  };

  // get the last message of the messenger

  // get the last message group
  const handleGetLastGroup = async (messengerKey) => {
    const messageGroupsPath = `messengers/${messengerKey}/messageGroups`;

    const messageGroupsRef = getRef(messageGroupsPath);
    const lastMessageGroupsQuery = query(messageGroupsRef, limitToLast(1));

    const lastMessageGroupData = await get(lastMessageGroupsQuery).then((snapshot) => snapshot.val());

    if (lastMessageGroupData) {
      const lastMessageGroupKey = Object.keys(lastMessageGroupData)[0];
      const lastMessageGroupAuthorId = lastMessageGroupData[lastMessageGroupKey].uid;

      // get author's display name last message's
      const lastMessageGroupAuthor = await handleGetUserData(lastMessageGroupAuthorId).then((snapshot) =>
        snapshot.val(),
      );

      return {
        key: lastMessageGroupKey,
        authorName: lastMessageGroupAuthor.displayName,
        authorId: lastMessageGroupAuthor.uid,
      };
    } else return null;
  };

  // get the last message
  const handleGetLastMassage = async (messengerKey) => {
    const lastMessageGroup = await handleGetLastGroup(messengerKey);

    if (lastMessageGroup) {
      const messagesRef = getRef(`messengers/${messengerKey}/messageGroups/${lastMessageGroup.key}/messages`);
      const lastMessageQuery = query(messagesRef, limitToLast(1));
      const lastMessageObj = await get(lastMessageQuery).then((snapshot) => snapshot.val());
      const lastMessageKey = Object.keys(lastMessageObj)[0];
      const lastMessage = lastMessageObj[lastMessageKey];
      lastMessage &&
        setLastMessage({
          authorId: lastMessageGroup.authorId,
          authorName: lastMessageGroup.authorName,
          data: lastMessage,
        });
    }
  };

  const handleOpenMessenger = (messengerKey) => {
    const addMessengerAction = addMessgenger(messengerKey);
    dispatch(addMessengerAction);
    setHasNewMessage(false);
  };

  useEffect(() => {
    const messengerRef = getRef(`messengers/${messengerKey}`);

    onValue(messengerRef, () => {
      handleGetMessengerData(messengerKey);
      handleGetLastMassage(messengerKey);
      setHasNewMessage(true);
    });

    setHasNewMessage(false);
    return () => {};
  }, [messengerKey]);

  return (
    <Fragment>
      {lastMessage && (
        <div
          className={cx('message-item-wrapper')}
          onClick={() => {
            handleOpenMessenger(messengerKey);
          }}
        >
          <div className={cx('message-item-avatar')}>
            {messengerData?.type === 'personal' && (
              <img
                className={cx('message-item-avatar-img')}
                src={anotherPersonalMessMember.photoURL || images.defaultAvt}
              />
            )}
          </div>
          {/* <div className={cx('message-item-detail')}> */}
          <div className={cx('message-item-detail')}>
            {messengerData?.type === 'personal' && (
              <div className={cx('message-item-detail-left-name')}>{anotherPersonalMessMember.displayName}</div>
            )}
            <div className={cx('message-item-detail-left-content')}>
              <div className={cx('message-item-detail-left-content-item')}>
                {lastMessage.authorId === currentUser.uid ? `Bạn` : `${lastMessage.authorName}`}
              </div>
              <div className={cx('message-item-detail-left-content-item')}>
                {lastMessage.data.type === 'FILE'
                  ? ` đã gửi ${Object.keys(lastMessage.data.files).length} ảnh`
                  : `: ${lastMessage.data.text}`}
              </div>
            </div>
          </div>
          {/* </div> */}
          <div className={cx('message-item-right')}>
            <div className={cx('message-item-detail-right-time')}>{getPeriod(lastMessage.data.timeCreate)}</div>
            {hasNewMesaage && <div className={cx('message-item-detail-right-un-read')}></div>}
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default MessengerItem;
