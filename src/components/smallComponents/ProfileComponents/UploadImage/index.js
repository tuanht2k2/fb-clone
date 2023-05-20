import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField, ThemeProvider, createTheme } from '@mui/material';
import HeadlessTippy from '@tippyjs/react/headless';

import { handleUpdateUserImage } from '../../../../utils/cloudStorage';
import style from './UploadImage.module.scss';
import ConfirmBox from '../../CommonComponents/ConfirmBox';
import { showAvatarUploadConfirmBox, hideAvatarUploadConfirmBox } from '../../../../actions/tippyState';
import { cancelUpload } from '../../../../actions/uploadImage';

const theme = createTheme({
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '14px',
        },
      },
    },
  },
});

const cx = classNames.bind(style);

function UploadImage({ file, type }) {
  const [titleValue, setTitleValue] = useState('');
  const [filePath, setFilePath] = useState('');
  const [mounted, setMounted] = useState(!!file);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // input
  const handleChangeTitleValue = (value) => {
    setTitleValue(value);
  };

  const handleShowConfirmBox = () => {
    const showConFirmBox = showAvatarUploadConfirmBox();
    dispatch(showConFirmBox);
  };

  const handleHideConfirmBox = () => {
    const hideConFirmBox = hideAvatarUploadConfirmBox();
    dispatch(hideConFirmBox);
  };

  const handleHide = () => {
    const cancelUploadAction = cancelUpload();
    dispatch(cancelUploadAction);
  };

  const handlePreviewFile = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setFilePath(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  useEffect(() => {
    handlePreviewFile(file);
  }, [file]);

  return (
    <HeadlessTippy
      appendTo={document.body}
      interactive
      // moveTransition={'transform 0.2s ease-out'}
      placement="auto-end"
      offset={[-10, 0]}
      visible={mounted}
      onClickOutside={() => {
        handleShowConfirmBox();
      }}
      render={(attrs) =>
        mounted ? (
          <div className={cx('prevent-click-wrapper')}>
            <div className={cx('wrapper')}>
              <header className={cx('header')}>
                <span className={cx('header-title')}>Tải ảnh lên</span>
                <span
                  className={cx('header-icon-wrapper')}
                  onClick={() => {
                    handleShowConfirmBox();
                  }}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </header>
              <div className={cx('main')}>
                <form id="form-title" className={cx('form-title')}>
                  <ThemeProvider theme={theme}>
                    <TextField
                      variant="filled"
                      fullWidth
                      multiline
                      size="Normal"
                      value={titleValue}
                      label="Mô tả"
                      onChange={(e) => {
                        handleChangeTitleValue(e.target.value);
                      }}
                    />
                  </ThemeProvider>
                </form>
                <div className={cx('avt-preview-wrapper')}>
                  <img className={cx('avt-preview')} src={filePath} />
                </div>
              </div>
              <div className={cx('control')}>
                <ConfirmBox header={'Bỏ thay đổi'} title={'Bạn có chắc chắn muốn bỏ các thay đổi không?'} />
                <button
                  className={cx('control-btn', 'standard-btn')}
                  onClick={() => {
                    handleShowConfirmBox();
                  }}
                >
                  Hủy
                </button>
                <button
                  className={cx('control-btn', 'filled-btn')}
                  onClick={() => {
                    handleUpdateUserImage(user.uid, file, type, titleValue, dispatch, handleHide);
                    setIsSubmitLoading(true);
                  }}
                >
                  {!isSubmitLoading && <span className={cx('submit-btn-text')}>Lưu</span>}
                  {isSubmitLoading && (
                    <span className={cx('submit-btn-loading')}>
                      <FontAwesomeIcon icon={faSpinner} />
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : null
      }
    ></HeadlessTippy>
  );
}

export default UploadImage;
