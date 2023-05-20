import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import style from './MultiLevelMenu.module.scss';
import Item from './Item';
import { useDispatch } from 'react-redux';
import resetState from '~/actions/resetState';

const cx = classNames.bind(style);

const MultiLevelMenu = ({ menu }) => {
  const [menuList, setMenuList] = useState([menu]);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleClickItem = (item) => {
    if (item.children) {
      setMenuList((prev) => [...prev, item.children]);
    }
  };

  const handleClickSignOut = () => {
    const signOutAction = resetState();
    dispatch(signOutAction);
    navigate('/login');
  };

  const handleBackMenu = () => {
    setMenuList((prev) => prev.slice(0, prev.length - 1));
  };

  return (
    <div className={cx('wrapper')}>
      {menuList[menuList.length - 1].header && (
        <header className={cx('header')}>
          {!menuList[menuList.length - 1].isRoot && (
            <span
              className={cx('header-icon-wrapper')}
              onClick={() => {
                handleBackMenu();
              }}
            >
              <FontAwesomeIcon className={'icon'} icon={faArrowLeft} />
            </span>
          )}
          <span className={cx('header-title')}>{menuList[menuList.length - 1].header}</span>
        </header>
      )}
      <ul className={cx('list-wrapper')}>
        {menuList[menuList.length - 1].items.map((item, index) => {
          return !item.isSeparator ? (
            <Item
              key={index}
              item={item}
              header={menu.header}
              handleClickSignOut={handleClickSignOut}
              handleClickItem={handleClickItem}
            />
          ) : (
            <div key={index} className={cx('separator')}></div>
          );
        })}
      </ul>
    </div>
  );
};

export default MultiLevelMenu;
