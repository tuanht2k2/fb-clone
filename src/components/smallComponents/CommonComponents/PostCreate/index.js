import { Fragment, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarth, faFolderPlus, faLock, faSpinner, faUsers, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import style from './PostCreate.module.scss';
import { useSelector } from 'react-redux';
import images from '../../../../assets/images';
import useTippyFullScreen from '../useTippyFullScreen';
import { createPost } from '../../../../utils/databaseTools';
import PostCreatePopUpControl from './components/PostCreatePopUpControl';

const cx = classNames.bind(style);

const AUDIENCES = [
  { value: 'public', title: '', icon: <FontAwesomeIcon icon={faEarth} /> },
  { value: 'private', title: '', icon: <FontAwesomeIcon icon={faLock} /> },
  { value: 'friends', title: '', icon: <FontAwesomeIcon icon={faUsers} /> },
];

function PostCreate() {
  const user = useSelector((state) => state.user);

  const handlePost = (postCaption, mediaFile, handleResetComponent) => {
    createPost(
      user.uid,
      'regular',
      postCaption,
      mediaFile,
      'public',
      Date.now(),
      handleResetComponent,
      handleHideFullScreenTippy,
    );
  };

  const { handleHideFullScreenTippy, render } = useTippyFullScreen({
    header: 'Tạo bài viết',
    children: (
      <div
        className={cx('post-input')}
        onClick={() => {
          handleHideFullScreenTippy();
        }}
      >{`${user.displayName} ơi, bạn đang nghĩ gì thế ?`}</div>
    ),
    tippyRender: <PostCreatePopUpControl initPostCaption={''} initImagePreviewPath={''} handleSubmit={handlePost} />,
  });

  return (
    <div className={cx('post-wrapper')}>
      <div className={cx('post-top')}>
        <Link to={`/profile/${user.uid}/home`} className={cx('post-user-avt-link')}>
          <img src={user.photoURL || images.defaultAvt} className={cx('post-user-avt')} />
        </Link>
        {render}
      </div>
      <div className={cx('post-bottom')}>
        <div className={cx('post-bottom-item', 'post-bottom-live')}>
          <span className={cx('post-bottom-icon-wrapper')}>
            <img
              className={cx('post-bottom-icon')}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yF/r/v1iF2605Cb5.png"
            />
          </span>
          <span className={cx('post-bottom-title')}>Video trực tiếp</span>
        </div>

        <div className={cx('post-bottom-item', 'post-bottom-img')}>
          <span className={cx('post-bottom-icon')}>
            <img
              className={cx('post-bottom-icon')}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png"
            />
          </span>
          <span className={cx('post-bottom-title')}>Ảnh/Video</span>
        </div>

        <div className={cx('post-bottom-item', 'post-bottom-emotion')}>
          <span className={cx('post-bottom-icon')}>
            <img
              className={cx('post-bottom-icon')}
              src="https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/yMDS19UDsWe.png"
            />
          </span>
          <span className={cx('post-bottom-title')}>Cảm xúc/Hoạt động</span>
        </div>
      </div>
    </div>
  );
}

export default PostCreate;
