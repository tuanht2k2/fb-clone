import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faEllipsis,
  faFaceLaugh,
  faFireFlameCurved,
  faMessage,
  faPen,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import images from '../../../../assets/images';
import style from './ProfileTop.module.scss';
import { useSelector } from 'react-redux';
import HeaderMenuActive from '../../CommonComponents/HeaderMenuActive';
import { MultiLevelMenu } from '../../CommonComponents';
import UploadImage from '../UploadImage';
import { Fragment, useEffect, useState } from 'react';
import HandleRelaRequestButton from './components/HandleRelaRequestButton';
import MessageButton from './components/HandleRelaRequestButton/MessageButton';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import FriendList from './components/FriendList';

const cx = classNames.bind(style);

const MENU = [
  { title: 'Bài viết', to: '', icon: '', tippyContent: '' },
  { title: 'Giới thiệu', to: '', icon: '', tippyContent: '' },
  { title: 'Bạn bè', to: '', icon: '', tippyContent: '' },
  { title: 'Ảnh', to: '', icon: '', tippyContent: '' },
  { title: 'Video', to: '', icon: '', tippyContent: '' },
  { title: 'Check in', to: '', icon: '', tippyContent: '' },
];

const MENU_EDIT_COVER_IMAGE = {
  header: 'Chỉnh sửa ảnh bìa',
  isRoot: true,
  items: [
    {
      icon: <span className={cx('edit-item-icon', 'image')}></span>,
      title: 'Chọn ảnh',
      children: '',
      to: '',
      onClick: '',
      parentComponent: UploadImage,
    },
    {
      icon: <span className={cx('edit-item-icon', 'upload')}></span>,
      title: 'Tải ảnh lên',
      children: null,
      to: '',
      isFileInput: true,
      actionType: 'UPLOAD_COVER_IMAGE',
      onClick: '',
    },
    {
      icon: <span className={cx('edit-item-icon', 'position')}></span>,
      title: 'Đặt lại vị trí',
      children: null,
      to: '',
      onClick: '',
    },
    {
      isSeparator: true,
    },
    {
      icon: <span className={cx('edit-item-icon', 'delete')}></span>,
      title: 'Gỡ',
      children: null,
      to: '',
      onClick: '',
    },
  ],
};

const MENU_EDIT_AVT = {
  header: 'Cập nhật ảnh đại diện',
  isRoot: true,
  items: [
    {
      icon: <FontAwesomeIcon icon={faPlus} />,
      title: 'Tải ảnh lên',
      children: '',
      to: '',
      onClick: '',
      isFileInput: true,
      actionType: 'UPLOAD_AVATAR',
      parentComponent: UploadImage,
    },
    {
      icon: <FontAwesomeIcon icon={faFaceLaugh} />,
      title: 'Tạo avatar làm ảnh đại diện',
      children: null,
      to: '',
      onClick: '',
    },
    {
      icon: <FontAwesomeIcon icon={faFireFlameCurved} />,
      title: 'Thêm khung',
      children: null,
      to: '',
      onClick: '',
    },

    {
      icon: <FontAwesomeIcon icon={faPen} />,
      title: 'Chỉnh sửa hình nhỏ',
      children: null,
      to: '',
      onClick: '',
    },
  ],
};

const MENU_IMG = {
  header: null,
  isRoot: true,
  items: [
    {
      icon: <span className={cx('avt-icon')}></span>,
      title: 'Xem ảnh đại dịên',
      children: null,
      to: '',
      onClick: '',
    },
    {
      icon: <span className={cx('img-icon')}></span>,
      title: 'Cập nhật ảnh đại diện',
      children: {
        ...MENU_EDIT_AVT,
        isRoot: false,
      },
      to: '',
      onClick: '',
    },
    {
      icon: <span className={cx('emoji-icon')}></span>,
      title: 'Dùng avatar làm ảnh đại diện',
      children: null,
      to: '',
      onClick: '',
    },
  ],
};

function ProfileTop({ self, otherUser }) {
  const currentUser = useSelector((state) => state.user);
  const [friends, setFriends] = useState({});

  const user = self ? (currentUser ? currentUser : {}) : otherUser;
  const rootPath = '/' + user.uid;

  const file = useSelector((state) => state.uploadFile);
  const fileState = self ? file : {};

  // handle get friend list
  useEffect(() => {
    const firendsPath = `users/${currentUser.uid}/friends`;
    getDb(firendsPath).then((snapshot) => {
      snapshot.val() && setFriends(snapshot.val());
    });

    return () => {};
  }, [currentUser]);

  return (
    <div className={cx('wrapper-pd')}>
      <div className={cx('wrapper')}>
        <div className={cx('cover-image-wrapper')}>
          <img className={cx('cover-image')} src={user.coverImageURL} />
          {self && (
            <HeadlessTippy
              interactive
              trigger="click"
              placement="right"
              render={(attrs) => <MultiLevelMenu menu={MENU_EDIT_COVER_IMAGE} />}
            >
              <button className={cx('cover-image-edit-btn')}>
                <div className={cx('cover-image-edit-btn-icon-wrapper')}>
                  <span className={cx('camera')}></span>
                </div>
                <div className={cx('cover-image-edit-btn-text')}>Chỉnh sửa ảnh bìa</div>
              </button>
            </HeadlessTippy>
          )}
        </div>
        <div className={cx('bottom-wrapper')}>
          <div className={cx('main')}>
            <div className={cx('user-avt-wrapper')}>
              <img className={cx('user-avt-img')} src={user.photoURL || images.defaultAvt} />
            </div>
            {self && (
              <Fragment>
                <HeadlessTippy
                  interactive
                  trigger="click"
                  placement="right-start"
                  render={(attrs) => <MultiLevelMenu menu={MENU_EDIT_AVT} />}
                >
                  <div className={cx('camera-icon-wrapper')}>
                    <span className={cx('camera-icon')}></span>
                  </div>
                </HeadlessTippy>
                <HeadlessTippy
                  interactive
                  arrow
                  trigger="click"
                  placement="bottom"
                  render={(attrs) => <MultiLevelMenu menu={MENU_IMG} />}
                >
                  <div className={cx('layer-to-click-avt')}></div>
                </HeadlessTippy>
              </Fragment>
            )}
            {otherUser && (
              <Fragment>
                <Link to={''} className={cx('layer-to-click-avt')}></Link>
              </Fragment>
            )}

            {/* User information  */}
            <div className={cx('user-info')}>
              <div className={cx('user-name')}>{user.displayName}</div>
              <FriendList friendList={friends} />
            </div>
            <div className={cx('profile-action')}>
              {self ? (
                <div className={cx('action-group-btn')}>
                  <Link to={''} className={cx('action-btn', 'link-btn')}>
                    <span className={cx('action-btn-icon', 'light-text')}>
                      <FontAwesomeIcon icon={faPlus} />
                    </span>
                    <span className={cx('action-btn-text', 'light-text')}>Thêm vào tin</span>
                  </Link>
                  <div className={cx('action-btn', 'gray-btn')}>
                    <span className={cx('action-btn-icon')}>
                      <FontAwesomeIcon icon={faPen} />
                    </span>
                    <span className={cx('action-btn-text')}>Chỉnh sửa trang cá nhân</span>
                  </div>
                </div>
              ) : (
                <div className={cx('action-group-btn')}>
                  <HandleRelaRequestButton currentUser={currentUser} otherUser={otherUser} />
                  <MessageButton sender={currentUser} receiver={otherUser} />
                </div>
              )}
            </div>
          </div>
          <div className={cx('menu-wrapper')}>
            <div className={cx('menu-left')}>
              <div className={cx('menu-left-full-menu-wrapper')}>
                <HeaderMenuActive menu={MENU} rootPath={rootPath} />
              </div>
              <div className={cx('menu-left-bars-menu-wrapper')}>
                <FontAwesomeIcon icon={faBars} />
              </div>
            </div>
            <div className={cx('menu-right')}>
              <div className={cx('btn-action-wrapper')}>
                <FontAwesomeIcon icon={faEllipsis} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {fileState.data && <UploadImage file={fileState.data} type={fileState.type} />}
    </div>
  );
}

export default ProfileTop;
