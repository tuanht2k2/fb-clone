import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import classNames from 'classnames/bind';

import { uploadImage } from '../../../../actions/uploadImage';
import { showTippy } from '../../../../actions/tippyState';

import style from './MultiLevelMenu.module.scss';

const cx = classNames.bind(style);

const Item = (props) => {
  const dispatch = useDispatch();
  const fileState = useSelector((state) => state.uploadFile);
  const [file, setFile] = useState('');

  // upload files
  const handleSelectFile = (file, type) => {
    const fileUpload = uploadImage(file, type);
    dispatch(fileUpload);

    const showTippyAction = showTippy();
    dispatch(showTippyAction);
  };

  return !props.item.to ? (
    <li
      itemRef={props.itemRef}
      className={cx('item-wrapper')}
      onClick={
        (props.item.onClick &&
          (() => {
            props.item.onClick(props.handleClickSignOut);
          })) ||
        (() => {
          props.handleClickItem(props.item);
        })
      }
    >
      {props.item.icon ? (
        <span className={cx('item-icon-wrapper')}>{props.item.icon}</span>
      ) : (
        <img className={cx('item-img')} src={props.item.imgURL} />
      )}
      {props.item.isFileInput ? (
        <label htmlFor="select-avt-input" className={cx('item-title', 'label-avt-input')}>
          {props.item.title}
          <input
            className={cx('select-avt-input')}
            id="select-avt-input"
            type="file"
            accept="image/png, image/jpeg"
            value={file}
            onChange={(e) => {
              handleSelectFile(e.target.files[0], props.item.actionType);
            }}
          />
        </label>
      ) : (
        <span className={cx('item-title')}>{props.item.title}</span>
      )}
    </li>
  ) : (
    <Link to={props.item.to} itemRef={props.itemRef} className={cx('item-wrapper')}>
      {props.item.icon ? (
        <span className={cx('item-icon-wrapper')}>{props.item.icon}</span>
      ) : (
        <img className={cx('item-img')} src={props.item.imgURL} />
      )}
      <span className={cx('item-title')}>{props.item.title}</span>
    </Link>
  );
};

export default Item;
