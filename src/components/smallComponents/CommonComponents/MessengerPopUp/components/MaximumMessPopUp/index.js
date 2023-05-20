import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import style from './MaximumMessPopUp.module.scss';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faMinus, faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import images from '~/assets/images';
import getRef from '~/utils/databaseTools/dbGetRefMethod';
import { get, limitToLast, onValue, query } from 'firebase/database';
import { pushDb } from '~/utils/databaseTools/dbWriteMethod';
import uploadFile from '~/utils/cloudStorageTools/uploadFile';
import MessageGroup from './components/MessageGroup';
import { minimizeMessenger, removeMessgenger } from '~/actions/messenger';

const cx = classNames.bind(style);

function MaximumMessPopUp({ messKey }) {
  const currentUser = useSelector((state) => state.user);

  const [messengerData, setMessengerData] = useState({});
  const [anotherPersonalMessMember, setAnotherPersonalMessMember] = useState({});
  const [isClickMessenger, setIsClickMessenger] = useState(false);
  const [messengerTextAreaValue, setMessengerTextAreaValue] = useState('');
  const [files, setFiles] = useState([]);
  const [isFriend, setIsFriend] = useState(false);
  const messengerInputRef = useRef();

  const dispatch = useDispatch();

  // minimize and close window

  const handleMinimizeMessenger = (messKey) => {
    const minimizeAction = minimizeMessenger(messKey);
    dispatch(minimizeAction);
  };

  const handleRemoveMessenger = (messKey) => {
    const removeAction = removeMessgenger(messKey);
    dispatch(removeAction);
  };

  // check to render UI

  const handleGetUserData = async (uid) => {
    const userPath = `users/${uid}`;
    const userData = await getDb(userPath);
    return userData;
  };

  const handelGetAnotherMembers = async (currentUid, members) => {
    for (const member in members) {
      if (member !== currentUid) {
        return await handleGetUserData(member);
      }
    }
  };

  const handleCheckRelationship = (otherUserId) => {
    getDb(`users/${currentUser.uid}/friends/${otherUserId}`).then((snapshot) => {
      snapshot.val() !== null && setIsFriend(true);
    });
  };

  const handleClickMessenger = () => {
    setIsClickMessenger(true);
    messengerInputRef.current.focus();
  };

  const handleSelectFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      setFiles((prev) => [...prev, { file: file, url: e.target.result, fileName: file.name }]);
    };

    reader.readAsDataURL(file);
  };

  const handleDeleteImage = (index) => {
    setFiles((prev) => {
      const newState = [...prev];
      newState.splice(index, 1);
      return newState;
    });
  };

  // handle send messages

  const handleClearInput = () => {
    setFiles([]);
    setMessengerTextAreaValue('');
    messengerInputRef.current.focus();
  };

  const handleGetLastMessageGroup = async (messKey) => {
    // Check author of the last message
    const messageRef = getRef(`messengers/${messKey}/messageGroups`);
    const lastMessageGroupQuery = query(messageRef, limitToLast(1));
    const lastMessageGroupSnapshot = await get(lastMessageGroupQuery);

    let lastMessageGroupData = null;

    if (lastMessageGroupSnapshot.val()) {
      const lastMessageGroupObj = lastMessageGroupSnapshot.val();
      const lastMessageGroupKey = Object.keys(lastMessageGroupObj)[0];
      const lastMessageGroup = lastMessageGroupObj[lastMessageGroupKey];

      lastMessageGroupData = { key: lastMessageGroupKey, author: lastMessageGroup.uid };
    }

    return lastMessageGroupData;
  };

  const handleCreateMessage = async (text, files) => {
    if (text) {
      return { type: 'TEXT', text, timeCreate: Date.now() };
    } else {
      const newMessage = Promise.all(
        files.map((file) => {
          return uploadFile(`messengerImages/${file.fileName}`, file.file);
        }),
      ).then((images) => {
        const messageData = { type: 'FILE', files: images, timeCreate: Date.now() };
        return messageData;
      });

      return newMessage;
    }
  };

  const handleSendMessages = async (messKey, author, text, files) => {
    const lastMessageGroupData = await handleGetLastMessageGroup(messKey);

    const newMessage = await handleCreateMessage(text, files);

    const lastMessageAuthor = lastMessageGroupData?.author || null;

    if (lastMessageGroupData && lastMessageAuthor === author) {
      const massagePath = `messengers/${messKey}/messageGroups/${lastMessageGroupData.key}/messages`;

      pushDb(massagePath, newMessage);
    } else {
      const messengersPath = `messengers/${messKey}/messageGroups`;

      pushDb(messengersPath, { uid: author }).then((snapshot) => {
        const newMessageGroupKey = snapshot.key;
        const newMessagePath = `messengers/${messKey}/messageGroups/${newMessageGroupKey}/messages`;
        pushDb(newMessagePath, newMessage);
      });
    }

    handleClearInput();
  };

  const handleMessageInputKeyDown = (e) => {
    if (e.keyCode == 13) {
      if (!e.shiftKey) {
        e.preventDefault();
        if (messengerTextAreaValue.trim()) {
          handleCombineSendMessage();
        }
      }
    }
  };

  const handleCombineSendMessage = () => {
    if (files.length > 0 && messengerTextAreaValue) {
      handleSendMessages(messKey, currentUser.uid, messengerTextAreaValue, null).then(() => {
        handleSendMessages(messKey, currentUser.uid, null, files);
      });
    } else {
      handleSendMessages(messKey, currentUser.uid, messengerTextAreaValue, files);
    }
  };

  // get Messenger Data

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

  useEffect(() => {
    const messengerPath = `messengers/${messKey}`;
    const messengerRef = getRef(messengerPath);
    handleGetMessengerData(messKey);

    onValue(messengerRef, () => {
      handleGetMessengerData(messKey);
    });

    return () => {};
  }, [messKey]);

  useEffect(() => {
    Object.keys(anotherPersonalMessMember).length > 0 && handleCheckRelationship(anotherPersonalMessMember.uid);

    return () => {};
  }, [anotherPersonalMessMember]);

  return (
    <div
      className={cx('mess-wrapper')}
      onClick={() => {
        handleClickMessenger();
      }}
    >
      {/* Header */}
      <div className={cx('mess-header')}>
        <div className={cx('mess-header-left')}>
          {messengerData.type === 'personal' ? (
            <Link className={cx('mess-header-left-user-link')} to={`/users/${anotherPersonalMessMember.uid}/home`}>
              <img
                className={cx('mess-header-left-avatar-img')}
                src={anotherPersonalMessMember.photoURL || images.defaultAvt}
              />
              <div className={cx('mess-header-left-name')}>{anotherPersonalMessMember.displayName}</div>
            </Link>
          ) : (
            <img className={cx('mess-header-left-avatar-img')} />
          )}
        </div>
        <div className={cx('mess-header-right')}>
          <div className={cx('mess-header-right-icon-wrapper')} onClick={() => handleMinimizeMessenger(messKey)}>
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <div className={cx('mess-header-right-icon-wrapper')} onClick={() => handleRemoveMessenger(messKey)}>
            <FontAwesomeIcon icon={faXmark} />
          </div>
        </div>
      </div>

      {/* Render messages  */}
      <div className={cx('mess-content')}>
        {messengerData.type === 'personal' ? (
          <div className={cx('mess-content-intro')}>
            <div className={cx('mess-content-intro-avatar-wrapper')}>
              <img
                className={cx('mess-content-intro-avatar-img')}
                src={anotherPersonalMessMember.photoURL || images.defaultAvt}
              />
            </div>
            <div className={cx('mess-content-intro-user-name')}>{anotherPersonalMessMember.displayName}</div>
            <div className={cx('mess-content-intro-desc')}>Facebook</div>
            <div className={cx('mess-content-intro-desc')}>
              {isFriend ? 'Các bạn là bạn bè trên facebook' : 'Các bạn không phải là bạn bè trên facebook'}
            </div>
          </div>
        ) : (
          <div className={cx('mess-content-intro')}></div>
        )}
        {!!messengerData.messageGroups && (
          <div className={cx('mess-content-messenger-list')}>
            {Object.keys(messengerData.messageGroups).map((groupKey, index) => {
              return (
                <MessageGroup
                  key={`MessageGroup${index}`}
                  messKey={messKey}
                  groupKey={groupKey}
                  messageGroup={messengerData.messageGroups[groupKey]}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Preview Image */}
      {files.length > 0 && (
        <div className={cx('mess-preview-image')}>
          {files.map((file, index) => (
            <div className={cx('mess-preview-image-item')} key={`'mess-preview-image-item${index}`}>
              <img src={file.url} className={cx('mess-preview-image-item-img')} />
              <div
                className={cx('mess-preview-image-item-delete-icon-wrapper')}
                onClick={() => {
                  handleDeleteImage(index);
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Type */}
      <div className={cx('mess-control')}>
        <form className={cx('image-form')}>
          <label
            htmlFor={`image-input-${messKey}`}
            className={cx('mess-control-icon-wrapper', isClickMessenger ? 'active' : null)}
          >
            <FontAwesomeIcon icon={faImage} />
          </label>
          <input
            id={`image-input-${messKey}`}
            type="file"
            accept="image/png, image/jpeg"
            className={cx('image-input')}
            onChange={(e) => {
              handleSelectFile(e.target.files[0]);
            }}
          />
        </form>
        <textarea
          type="text"
          placeholder="Nhập tin nhắn..."
          className={cx('mess-control-text-area')}
          value={messengerTextAreaValue}
          onChange={(e) => {
            setMessengerTextAreaValue(e.target.value);
          }}
          onKeyDown={(e) => {
            handleMessageInputKeyDown(e);
          }}
          ref={messengerInputRef}
        ></textarea>
        <div
          className={cx(
            'mess-control-icon-wrapper',
            (messengerTextAreaValue || files.length > 0) && isClickMessenger ? 'active' : null,
          )}
          onClick={() => {
            handleCombineSendMessage();
          }}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </div>
      </div>
    </div>
  );
}

export default MaximumMessPopUp;
