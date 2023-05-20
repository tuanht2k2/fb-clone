import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import style from './MultiLevelMenu.module.scss';
import { useDispatch } from 'react-redux';
import { userSignOut } from '~/actions/user';

const cx = classNames.bind(style);

const TippyUploadImageMenu = ({ menu }) => {
  return (
    <div className={cx('wrapper')}>
      <header className={cx('header')}>{menu.title}</header>
      <ul className={cx('list-wrapper')}>
        {menu.items.map((item, index) => {
          return !item.isSeparator ? (
            <Item key={index} item={item} />
          ) : (
            <div key={index} className={cx('separator')}></div>
          );
        })}
      </ul>
    </div>
  );
};

export default TippyUploadImageMenu;
