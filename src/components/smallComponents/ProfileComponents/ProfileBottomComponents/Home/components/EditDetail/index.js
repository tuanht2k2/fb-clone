import classNames from 'classnames/bind';

import HeadlessTippy from '@tippyjs/react/headless';
import { Fragment, useState } from 'react';
import style from './EditDetail.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faPlusCircle, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);

const INFO = [
  {
    header: 'Công việc',
    edit: [
      {
        title: 'Thêm nơi làm việc',
        value: '',
      },
    ],
  },
  {
    header: 'Học vấn',
    edit: [
      {
        title: 'Thêm trường trung học',
        value: '',
      },
      {
        title: 'Thêm trường cao đẳng/đại học',
        value: '',
      },
    ],
  },
  {
    header: 'Tỉnh/Thành phố hiện tại',
    edit: [
      {
        title: 'Thêm tỉnh/thành phố hiện tại',
        value: '',
      },
    ],
  },
  {
    header: 'Quê quán',
    edit: [
      {
        title: 'Thêm quê quán',
        value: '',
      },
    ],
  },
  {
    header: 'Mối quan hệ',
    edit: [
      {
        title: 'Thêm tình trạng mối quan hệ',
        value: 'Độc thân',
      },
    ],
  },
];

function EditDetail() {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible((pre) => !pre);
  };

  return (
    <Fragment>
      <HeadlessTippy
        appendTo={document.body}
        placement="bottom"
        interactive
        visible={visible}
        render={(attrs) => (
          <div
            className={cx('tippy-wrapper')}
            onClick={() => {
              handleClick();
            }}
          >
            <div className={cx('tippy-content')}>
              <header className={cx('header')}>
                <span className={cx('header-name')}>Chỉnh sửa chi tiết</span>
                <span className={cx('header-action')}>
                  <FontAwesomeIcon icon={faXmark} />
                </span>
              </header>
              <div className={cx('tippy-content-main')}>
                <div className={cx('main-desc')}>
                  <span className={cx('main-desc-top')}>Chỉnh sửa phần giới thiệu</span>
                  <span className={cx('main-desc-bottom')}>Chi tiết bạn chọn sẽ hiển thị công khai</span>
                </div>
                <div className={cx('main-list')}>
                  {INFO.map((item, index) => (
                    <div key={index} className={cx('main-list-item')}>
                      <header className={cx('main-list-item-header')}>{item.header}</header>
                      <div className={cx('main-list-item-content')}>
                        {item.edit.map((info, index) => (
                          <div key={index} className={cx('info-item-wrapper')}>
                            {info.value && (
                              <Fragment>
                                <div className={cx('info-left')}>
                                  <span className={cx('toggle-btn')}>toggle</span>
                                  <span className={cx('info-title')}>{info.value}</span>
                                </div>
                                <span className={cx('info-right-pen-icon-wrapper')}>
                                  <FontAwesomeIcon icon={faPen} />
                                </span>
                              </Fragment>
                            )}
                            {!info.value && (
                              <Link to={'/about'} className={cx('edit-link')}>
                                <span className={cx('detail-add-icon-wrapper')}>
                                  <FontAwesomeIcon icon={faPlusCircle} />
                                </span>
                                <span className={cx('detail-title')}>{info.title}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      ></HeadlessTippy>
      <button
        className={cx('edit-btn')}
        onClick={() => {
          handleClick();
        }}
      >
        Chỉnh sửa chi tiết
      </button>
    </Fragment>
  );
}

export default EditDetail;
