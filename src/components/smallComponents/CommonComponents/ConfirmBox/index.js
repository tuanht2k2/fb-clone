import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import style from './ConfirmBox.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { hideAvatarUploadConfirmBox } from '../../../../actions/tippyState';
import { cancelUpload } from '../../../../actions/uploadImage';

const cx = classNames.bind(style);

function ConfirmBox({ header, title, children }) {
  const dispatch = useDispatch();
  const visible = useSelector((state) => state.avatarUploadConfirmBoxState);

  const handleHide = () => {
    const hideAction = hideAvatarUploadConfirmBox();
    dispatch(hideAction);
  };

  const handleConfirm = () => {
    handleHide();
    const cancelUploadAction = cancelUpload();
    dispatch(cancelUploadAction);
  };

  return (
    <HeadlessTippy
      interactive
      appendTo={document.body}
      placement="auto"
      offset={[-15, 0]}
      visible={visible}
      ansition={'transition 0.2s'}
      onClickOutside={() => {
        handleHide();
      }}
      render={(attrs) => (
        <div className={cx('prevent-click-wrapper')}>
          <div className={cx('wrapper')}>
            <header className={cx('header')}>
              <span className={cx('header-title')}>{header}</span>
              <span
                className={cx('header-icon-wrapper')}
                onClick={() => {
                  handleHide();
                }}
              >
                <FontAwesomeIcon icon={faXmark} />
              </span>
            </header>
            <div className={cx('main')}>{title}</div>
            <div className={cx('control')}>
              <button
                className={cx('control-btn', 'standard-btn')}
                onClick={() => {
                  handleHide();
                }}
              >
                Hủy
              </button>
              <button
                className={cx('control-btn', 'filled-btn')}
                onClick={() => {
                  handleConfirm();
                }}
              >
                Bỏ
              </button>
            </div>
          </div>
        </div>
      )}
    ></HeadlessTippy>
  );
}

export default ConfirmBox;
