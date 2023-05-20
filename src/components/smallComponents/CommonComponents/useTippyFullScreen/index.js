import { Fragment, useState } from 'react';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';

import style from './useTippyFullScreen.module.scss';

const cx = classNames.bind(style);

function useTippyFullScreen({ header, children, tippyRender, control }) {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleHideFullScreenTippy = () => {
    setVisible((pre) => !pre);
    setIsLoading(false);
  };

  return {
    handleHideFullScreenTippy,
    render: (
      <Fragment>
        <HeadlessTippy
          appendTo={document.body}
          placement="bottom"
          interactive
          visible={visible}
          offset={[-5, 0]}
          render={(attrs) => (
            <div
              className={cx('tippy-wrapper')}
              onMouseDown={() => {
                handleHideFullScreenTippy();
              }}
            >
              <div
                className={cx('tippy-content')}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
              >
                <header className={cx('header')}>
                  <span className={cx('header-name')}>{header}</span>
                  <span
                    className={cx('header-action')}
                    onClick={() => {
                      handleHideFullScreenTippy();
                    }}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </span>
                </header>
                <div className={cx('tippy-content-main')}>{tippyRender}</div>
                {control && (
                  <div className={cx('tippy-control')}>
                    <button
                      className={cx('btn', 'tippy-control-normal-btn')}
                      onClick={() => {
                        handleHideFullScreenTippy();
                      }}
                    >
                      Hủy
                    </button>
                    {!isLoading ? (
                      <button
                        className={cx('btn', 'tippy-control-filled-btn')}
                        onClick={() => {
                          setIsLoading(true);
                          control(handleHideFullScreenTippy);
                        }}
                      >
                        Xác nhận
                      </button>
                    ) : (
                      <span className={cx('loading-icon')}>
                        <FontAwesomeIcon icon={faSpinner} />
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        ></HeadlessTippy>
        {!!children && children}
      </Fragment>
    ),
  };
}

export default useTippyFullScreen;
