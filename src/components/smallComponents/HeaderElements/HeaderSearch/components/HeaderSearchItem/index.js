import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './HeaderSearchItem.module.scss';
import images from '~/assets/images';
import { setDb } from '~/utils/databaseTools/dbWriteMethod';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import removeDb from '~/utils/databaseTools/dbRemoveMethod';
const cx = classNames.bind(styles);

function HeaderSearchItem({ userId, history }) {
  const currentUser = useSelector((state) => state.user);
  const [user, setUser] = useState({});
  const navigateUser = useNavigate();

  const handleSearch = (e) => {
    setDb(`users/${currentUser.uid}/searchHistory/${userId}`, '').then(() => {
      navigateUser(`/users/${userId}/home`);
    });
  };

  const handleDeleteHistory = (e, userId) => {
    e.stopPropagation();
    removeDb(`users/${currentUser.uid}/searchHistory/${userId}`);
  };

  useEffect(() => {
    getDb(`users/${userId}`).then((snapshot) => {
      setUser(snapshot.val() || {});
    });
  }, []);

  return (
    <li className={cx('search-item')}>
      <div
        className={cx('search-item-link')}
        onClick={(e) => {
          handleSearch();
        }}
      >
        <img className={cx('search-item-img')} src={user.photoURL || images.defaultAvt} />
        <div className={cx('search-item-info')}>
          <span className={cx('info-name')}>{user.displayName}</span>
        </div>
        {history && (
          <div
            className={cx('delete-icon-wrapper')}
            id="history-delete"
            onClick={(e) => {
              handleDeleteHistory(e, userId);
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </div>
        )}
      </div>
    </li>
  );
}

export default HeaderSearchItem;
