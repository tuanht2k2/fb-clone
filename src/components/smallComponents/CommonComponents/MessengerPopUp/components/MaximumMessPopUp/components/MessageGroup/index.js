import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';

import style from './MessageGroup.module.scss';
import { Fragment, useEffect, useState } from 'react';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import { useSelector } from 'react-redux';
import images from '~/assets/images';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);

function MessageGroup({ messKey, groupKey, messageGroup }) {
  const [author, setAuthor] = useState({});
  const currentUser = useSelector((state) => state.user);

  const handleGetAuthor = (author) => {
    const authorPath = `users/${author}`;
    getDb(authorPath).then((userSnapshot) => {
      userSnapshot.val() && setAuthor(userSnapshot.val());
    });
  };

  useEffect(() => {
    handleGetAuthor(messageGroup.uid);

    return () => {};
  }, []);

  return (
    <Fragment>
      {messageGroup?.messages ? (
        <div className={cx('message-group-wrapper', messageGroup.uid === currentUser.uid ? 'self' : 'other')}>
          {messageGroup.uid !== currentUser.uid && (
            <div className={cx('message-group-left')}>
              <img className={cx('message-group-author-avatar')} src={author.photoURL || images.defaultAvt} />
            </div>
          )}
          <div className={cx('message-group-right')}>
            {Object.keys(messageGroup.messages).map((messageKey, index) => {
              const timeCreate = messageGroup.messages[messageKey].timeCreate;
              const date = new Date(timeCreate);

              const timeCreateDesc = date.toDateString();

              return (
                <HeadlessTippy
                  key={`message-group-right-item-tippy${index}`}
                  placement="left"
                  render={() => <div className={cx('time-create')}>{timeCreateDesc}</div>}
                >
                  <div className={cx('message-wrapper', messageGroup.uid === currentUser.uid ? 'self' : 'other')}>
                    {index === 0 && (
                      <div
                        className={cx('message-time-create', messageGroup.uid === currentUser.uid ? 'self' : 'other')}
                      >
                        {timeCreateDesc}
                      </div>
                    )}

                    {/* render text if message type is TEXT */}
                    {messageGroup.messages[messageKey].type === 'TEXT' && (
                      <div
                        className={cx('message-text-wrapper', messageGroup.uid === currentUser.uid ? 'self' : 'other')}
                      >
                        <div className={cx('message-item-text')}>{messageGroup.messages[messageKey].text}</div>
                      </div>
                    )}

                    {/* render image if message type is FILE */}
                    {messageGroup.messages[messageKey].type === 'FILE' && messageGroup.messages[messageKey].files && (
                      <div className={cx('message-image-wrapper')}>
                        {messageGroup.messages[messageKey].files.map((file, index) => {
                          return (
                            <Link
                              to={`/messengers/images/${messKey}/${groupKey}/${messageKey}/files/${index}`}
                              key={`message-item-image-item-wrapper${index}`}
                              className={cx('message-item-image-item-wrapper')}
                            >
                              <img className={cx('message-item-image-item-img')} alt="Đã xảy ra lỗi" src={file} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </HeadlessTippy>
              );
            })}
          </div>
        </div>
      ) : null}
      <div></div>
    </Fragment>
  );
}

export default MessageGroup;
