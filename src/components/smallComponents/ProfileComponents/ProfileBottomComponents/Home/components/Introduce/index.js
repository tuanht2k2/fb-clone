import classNames from 'classnames/bind';

import style from './Introduce.module.scss';
import EditDetail from '../EditDetail';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEarth } from '@fortawesome/free-solid-svg-icons';
import { useRef, useState } from 'react';
import updateUserProfile from '../../../../../../../utils/updateUserProfile';
import { useDispatch, useSelector } from 'react-redux';

const cx = classNames.bind(style);

function Introduce() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const textAreaRef = useRef();
  const [bioInputVisible, setBioInputVisible] = useState(false);
  const [bioValue, setBioValue] = useState(user.bio || '');

  const handleSetBioTextAreaVisible = () => {
    setBioInputVisible((pre) => !pre);
  };

  const handleChangeBioValue = (value) => {
    value.length <= 101 && setBioValue(value);
  };

  const handleSubmitBio = () => {
    updateUserProfile(user.uid, { bio: bioValue }, dispatch);
    handleSetBioTextAreaVisible();
  };

  return (
    <div className={cx('wrapper')}>
      <header className={cx('header')}>Giới thiệu</header>
      <div className={cx('main')}>
        <div className={cx('bio-wrapper')}>
          {user.bio && !bioInputVisible && <span className={cx('bio-value')}>{user.bio}</span>}
          {!bioInputVisible && (
            <button
              className={cx('edit-btn')}
              onClick={() => {
                handleSetBioTextAreaVisible();
              }}
            >
              {user.bio ? 'Chỉnh sửa tiểu sử' : 'Thêm tiểu sử'}
            </button>
          )}
          {bioInputVisible && (
            <div className={cx('edit-bio-wrapper')}>
              <textarea
                id="bio-textarea"
                className={cx('bio-text-area')}
                placeholder="Mô tả"
                value={bioValue}
                ref={textAreaRef}
                onChange={(e) => {
                  handleChangeBioValue(e.target.value);
                }}
              ></textarea>
              <span className={cx('word-remaining')}>{`Còn ${101 - bioValue.length} ký tự`}</span>
              <div className={cx('edit-bio-control')}>
                <div className={cx('edit-bio-control-status')}>
                  <span className={cx('edit-bio-control-status-icon-wrapper')}>
                    <FontAwesomeIcon icon={faEarth} />
                  </span>
                  <span className={cx('edit-bio-control-status-title')}>Công khai</span>
                </div>
                <div className={cx('edit-bio-control-btn-group')}>
                  <button
                    className={cx('edit-btn', 'btn-normal')}
                    onClick={() => {
                      handleSetBioTextAreaVisible();
                      handleChangeBioValue(user.bio || '');
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    className={cx('btn-submit', bioValue ? 'enabled' : 'disabled')}
                    onClick={
                      bioValue
                        ? () => {
                            handleSubmitBio();
                          }
                        : null
                    }
                  >
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <EditDetail />
        <button className={cx('edit-btn')}>Thêm sở thích</button>
        <button className={cx('edit-btn')}>Thêm nội dung đáng chú ý</button>
      </div>
    </div>
  );
}

export default Introduce;
