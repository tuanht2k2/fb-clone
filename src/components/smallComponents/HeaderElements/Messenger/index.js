import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faPeopleGroup, faPeopleLine } from '@fortawesome/free-solid-svg-icons';

import style from './Messenger.module.scss';
import { MessageIcon } from '~/assets/Icons';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import MessengerItem from './components/MessengerItem';
import { onValue } from 'firebase/database';
import getRef from '~/utils/databaseTools/dbGetRefMethod';

const cx = classNames.bind(style);

function Messenger() {
  const currentUser = useSelector((state) => state.user);

  const [messengers, setMessengers] = useState({});

  useEffect(() => {
    const userMessengersPath = `users/${currentUser.uid}/messengers`;
    getDb(userMessengersPath).then((messengersSnapshot) => {
      const messengers = messengersSnapshot.val();
      messengers && setMessengers(messengers);
    });

    return () => {};
  }, [currentUser]);

  return (
    <HeadlessTippy
      interactive
      trigger="click"
      render={() => (
        <div className={cx('messenger-wrapper')}>
          {/* Messenger Top */}
          <div className={cx('messenger-top')}>
            <div className={cx('messenger-top-header')}>
              <div className={cx('messenger-top-header-title')}>Trò chuyện</div>
              <div className={cx('messenger-top-header-control')}>
                <span className={cx('messenger-top-header-control-icon-wrapper')} title="Tạo nhóm mới">
                  <FontAwesomeIcon icon={faPeopleGroup} /> +
                </span>
              </div>
            </div>
            <div className={cx('messenger-top-search')}>
              <span className={cx('messenger-top-search-icon-wrapper')}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
              <input className={cx('messenger-top-search-input')} placeholder="Tìm kiếm bạn bè trên Messenger" />
            </div>
          </div>

          {/* Messenger List  */}
          <div className={cx('messenger-list')}>
            {Object.keys(messengers).map((messenger) => (
              <MessengerItem key={`Messenger-messenger-list${messenger}`} messengerKey={messenger} />
            ))}
          </div>
        </div>
      )}
    >
      <li className={cx('messenger-icon-wrapper')}>
        <MessageIcon width={'21px'} height={'21px'} />
        {/* <span className={cx('messenger-quantity')}></span> */}
      </li>
    </HeadlessTippy>
  );
}

export default Messenger;
