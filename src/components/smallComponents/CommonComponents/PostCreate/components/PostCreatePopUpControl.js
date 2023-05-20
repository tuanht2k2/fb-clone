import { useRef, useState } from 'react';
import classNames from 'classnames/bind';

import style from './PostCreatePopUpControl.module.scss';
import { faFolderPlus, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import images from '~/assets/images';

const cx = classNames.bind(style);

function PostCreatePopUpControl({ initPostCaption, initImagePreviewPath, handleSubmit }) {
  const user = useSelector((state) => state.user);

  const [postCaption, setPostCaption] = useState(initPostCaption);
  const [addToPostBoxVisible, setAddToPostBoxVisible] = useState('image');
  const [imageInputValue, setImageInputValue] = useState('');
  const [imagePreviewPath, setImagePreviewPath] = useState(initImagePreviewPath);
  const [isClickedPost, setIsClickedPost] = useState(false);

  const handleSetTypeIsVisible = (type) => {
    setAddToPostBoxVisible((prev) => (type == prev ? '' : type));
  };

  const handleSetPostCaption = (value) => {
    setPostCaption(value);
  };

  const handleSelectImage = (file) => {
    setImageInputValue(file);
    handlePreviewFile(file);
  };

  const handleDeleteImage = () => {
    setImagePreviewPath('');
  };

  const handlePreviewFile = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setImagePreviewPath(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleResetComponent = () => {
    setIsClickedPost(false);

    if (!initPostCaption && !initImagePreviewPath) {
      setPostCaption(initPostCaption);
      setImagePreviewPath(initImagePreviewPath);
    } else {
      setPostCaption(postCaption);
      setImagePreviewPath(imagePreviewPath);
    }
  };

  const addToPostList = useRef([
    {
      type: 'image',
      imgURL: 'https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/a6OjkIIE-R0.png',
    },
    {
      type: 'tag',
      imgURL: 'https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/MqTJr_DM3Jg.png',
    },
    {
      type: 'emoji',
      imgURL: 'https://static.xx.fbcdn.net/rsrc.php/v3/yk/r/yMDS19UDsWe.png',
    },
    {
      type: 'check-in',
      imgURL: 'https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/uywzfiZad5N.png',
    },
    {
      type: 'gif',
      imgURL: 'https://static.xx.fbcdn.net/rsrc.php/v3/yX/r/j0Jp-GpONWx.png',
    },
  ]);

  return (
    <div className={cx('wrapper')}>
      {isClickedPost && (
        <div className={cx('loading-layer')}>
          <span className={cx('loading-icon-wrapper')}>
            <FontAwesomeIcon icon={faSpinner} className={cx('loading-icon')} />
          </span>
        </div>
      )}
      <div className={cx('tippy-render-wrapper')}>
        <div className={cx('user-wrapper')}>
          <Link to={`/profile/${user.uid}/home`} className={cx('post-user-avt-link')}>
            <img src={user.photoURL || images.defaultAvt} className={cx('post-user-avt')} />
          </Link>
          <div className={cx('user-wrapper-right')}>
            <span className={cx('user-wrapper-right-name')}>{user.displayName}</span>
          </div>
        </div>
        <textarea
          className={cx('post-text-area')}
          placeholder={`${user.displayName} ơi, bạn đang nghĩ gì thế ?`}
          value={postCaption}
          onChange={(e) => {
            handleSetPostCaption(e.target.value);
          }}
        ></textarea>

        {addToPostBoxVisible == 'image' && (
          <div className={cx('add-image-box-wrapper')}>
            {imagePreviewPath && (
              <div className={cx('image-preview-wrapper')}>
                <img src={imagePreviewPath} className={cx('image-preview-image')} />
                <div
                  className={cx('add-image-input-close', 'delete-image')}
                  onClick={(e) => {
                    handleDeleteImage();
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
              </div>
            )}
            {!imagePreviewPath && (
              <div className={cx('add-image-input-control-wrapper')}>
                <div
                  className={cx('add-image-input-close')}
                  onClick={(e) => {
                    handleSetTypeIsVisible('');
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </div>
                <label htmlFor="add-image-input" className={cx('add-image-input-label')}>
                  <div className={cx('add-image-input-main')}>
                    <span className={cx('add-image-input-icon-wrapper')}>
                      <FontAwesomeIcon icon={faFolderPlus} />
                    </span>
                    <span className={cx('add-image-input-title-bold')}>Thêm ảnh/video</span>
                    <span className={cx('add-image-input-title-regular')}>hoặc kéo và thả</span>
                  </div>
                </label>
                <input
                  id="add-image-input"
                  type="file"
                  accept="image/*,image/heif,image/heic,video/*,video/mp4,video/x-m4v,video/x-matroska,.mkv"
                  className={cx('add-image-input')}
                  onChange={(e) => {
                    handleSelectImage(e.target.files[0]);
                  }}
                />
              </div>
            )}
          </div>
        )}
        <div className={cx('add-to-post-wrapper')}>
          <span className={cx('add-to-post-title')}>Thêm vào bài viết của bạn</span>
          <div className={cx('add-to-post-list')}>
            {addToPostList.current.map((item, index) => (
              <div
                key={index}
                className={cx('add-to-post-item-icon-wrapper', addToPostBoxVisible == item.type ? 'active' : null)}
                onClick={() => {
                  handleSetTypeIsVisible(item.type);
                }}
              >
                {item.imgURL && <img src={item.imgURL} className={cx('add-to-post-item-img')} />}
              </div>
            ))}
          </div>
        </div>
        <button
          className={cx('submit-btn', postCaption || imageInputValue ? 'enabled' : null)}
          onClick={
            postCaption || imageInputValue
              ? () => {
                  setIsClickedPost(true);
                  handleSubmit(
                    postCaption,
                    imagePreviewPath === initImagePreviewPath
                      ? ''
                      : imageInputValue === ''
                      ? 'DELETE_MEDIA_FILE'
                      : imageInputValue,
                    handleResetComponent,
                  );
                }
              : null
          }
        >
          Đăng
        </button>
      </div>
    </div>
  );
}

export default PostCreatePopUpControl;
