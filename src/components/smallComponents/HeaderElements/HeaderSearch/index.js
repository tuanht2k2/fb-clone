import { Link } from 'react-router-dom';
import { useState, useRef, Fragment, useEffect } from 'react';
import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import styles from './HeaderSearch.module.scss';
import { useSelector } from 'react-redux';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import HeaderSearchItem from './components/HeaderSearchItem';
import { onValue } from 'firebase/database';
import getRef from '~/utils/databaseTools/dbGetRefMethod';

const cx = classNames.bind(styles);

function HeaderSearch() {
  const user = useSelector((state) => state.user);
  const [userSearchHistory, setUserSearchHistory] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const inputRef = useRef();

  const handleType = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  const handleSetVisibleTrue = () => {
    setIsVisible(true);
  };

  const handleSetVisibleFalse = () => {
    setIsVisible(false);
  };

  const handleGetUserSearchHistory = () => {
    getDb(`users/${user.uid}/searchHistory`).then((snapshot) => {
      setUserSearchHistory(snapshot.val() || {});
    });
  };

  useEffect(() => {
    const searchHistoryRef = getRef(`users/${user.uid}/searchHistory`);

    onValue(searchHistoryRef, (snapshot) => {
      handleGetUserSearchHistory();
    });
  }, [user]);

  useEffect(() => {
    handleGetUserSearchHistory();
  }, [user]);

  useEffect(() => {
    getDb('users').then((snapshot) => {
      const userList = snapshot.val();
      const searchResultArr = [];

      Object.keys(userList).map((userId) => {
        const userName = userList[userId].displayName.toLowerCase();
        if (userName.indexOf(inputValue.toLowerCase()) !== -1) {
          searchResultArr.push(userId);
        }
      });

      setSearchResult(searchResultArr);
    });
  }, [inputValue]);

  return (
    <Fragment>
      <HeadlessTippy
        trigger="click"
        interactive
        placement="right-end"
        visible={isVisible}
        appendTo={document.body}
        onClickOutside={() => {
          handleSetVisibleFalse();
        }}
        render={(attrs) => (
          <div className={cx('search-wrapper')}>
            <div className={cx('tippy-input-wrapper')}>
              <div
                onClick={() => {
                  handleSetVisibleFalse();
                }}
                className={cx('back-icon-wrapper')}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </div>
              <input
                ref={inputRef}
                className={cx('search-input')}
                placeholder="Tìm kiếm trên Facebook"
                value={inputValue}
                onChange={(e) => {
                  handleType(e);
                }}
              />
            </div>
            <div className={cx('search-dropdown-bottom-wrapper')}>
              {Object.keys(userSearchHistory).length > 0 && !inputValue ? (
                <div className={cx('search-dropdown-bottom-main')}>
                  <div className={cx('header')}>
                    <span className={cx('desc', 'header-item')}>Tìm kiếm gần đây</span>
                  </div>
                  <ul className={cx('search-dropdown-bottom-list')}>
                    <ul className={cx('search-list')}>
                      {Object.keys(userSearchHistory).map((userId) => (
                        <HeaderSearchItem key={`searchHistory${userId}`} userId={userId} history />
                      ))}
                    </ul>
                  </ul>
                </div>
              ) : inputValue ? (
                <ul className={cx('search-list')}>
                  {searchResult.map((userId) => (
                    <HeaderSearchItem key={`searchResult${userId}`} userId={userId} />
                  ))}
                </ul>
              ) : (
                <span className={cx('search-empty-title')}>Không có tìm kiếm nào gần đây</span>
              )}
            </div>
          </div>
        )}
      ></HeadlessTippy>
      <div
        className={cx('search-btn-wrapper')}
        onClick={() => {
          handleSetVisibleTrue();
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className={cx('search-icon')} />
        <span className={cx('search-text')}>Tìm kiếm trên Facebook</span>
      </div>
    </Fragment>
  );
}

export default HeaderSearch;
