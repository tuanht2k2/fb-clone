import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'classnames/bind';

import style from './UserInformation.module.scss';
import { getDb } from '~/utils/databaseTools/dbReadMethod';
import images from '~/assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import ModifyTab from '~/components/smallComponents/CommonComponents/ModifyTab';
import { Fragment } from 'react';
import { Grid, TextField } from '@mui/material';

const cx = classNames.bind(style);

function UserInfomation() {
  const currentUser = useSelector((state) => state.user);
  const [userData, setUserData] = useState({});

  const [fieldNameValues, setFieldNameValues] = useState({
    firstName: {
      value: '',
      error: '',
    },
    lastName: { value: '', error: '' },
    fullName: '',
  });

  const [fieldPasswordValues, setFieldPasswordValues] = useState({
    oldPassword: { value: '', error: '' },
    newPassword: { value: '', error: '' },
    reNewPassword: { value: '', error: '' },
  });

  const handleModifyName = () => {};

  const handleModifyPassword = () => {};

  const handleToggleModifyTab = () => {};

  const fields = [
    {
      fieldName: 'Id người dùng',
      value: userData.uid,
      modifiable: false,
    },
    {
      fieldName: 'Tên đầy đủ',
      value: userData.displayName,
      modifiable: true,
      isModifyTabVisible: true,
      modifyTabData: {
        modifyTabName: 'Đổi tên',
        modifyTabSubmitFn: handleModifyName,
        modifyTabRender: (
          <div className={cx('modify-tab-render-wrapper')}>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  label="Họ"
                  value={fieldNameValues.firstName.value}
                  onChange={(e) => {
                    setFieldNameValues((prev) => ({
                      ...prev,
                      firstName: { ...fieldNameValues.firstName, lastName: e.target.value },
                      fullName: e.target.value + ' ' + fieldNameValues.lastName.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Tên"
                  value={fieldNameValues.lastName.value}
                  onChange={(e) => {
                    setFieldNameValues((prev) => ({
                      ...prev,
                      lastName: { ...fieldNameValues.lastName, fullName: e.target.value },
                      fullName: e.target.value + ' ' + fieldNameValues.fullName.value,
                    }));
                  }}
                />
              </Grid>
              <Grid item>
                <TextField label="Tên đầy đủ" value={fieldNameValues.fullName.value} disabled />
              </Grid>
            </Grid>
          </div>
        ),
      },
    },
    {
      fieldName: 'Email',
      value: userData.email,
      modifiable: false,
    },
    {
      fieldName: 'Mật khẩu',
      value: '*********',
      modifiable: true,
      isModifyTabVisible: true,
      modifyTabData: {
        modifyTabName: 'Đổi mật khẩu',
        modifyTabSubmitFn: handleModifyPassword,
        modifyTabRender: (
          <div className={cx('modify-tab-render-wrapper')}>
            <Grid container spacing={2}>
              <Grid item>
                <TextField
                  label="Mật khẩu cũ"
                  value={fieldPasswordValues.oldPassword}
                  onChange={(e) => {
                    setFieldPasswordValues((prev) => ({ ...prev, oldPassword: e.target.value }));
                  }}
                  type="password"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Mật khẩu mới"
                  value={fieldPasswordValues.newPassword}
                  onChange={(e) => {
                    setFieldPasswordValues((prev) => ({ ...prev, newPassword: e.target.value }));
                  }}
                  type="password"
                />
              </Grid>
              <Grid item>
                <TextField
                  label="Nhập lại mật khẩu mới"
                  value={fieldPasswordValues.reNewPassword}
                  onChange={(e) => {
                    setFieldPasswordValues((prev) => ({ ...prev, reNewPassword: e.target.value }));
                  }}
                  type="password"
                />
              </Grid>
            </Grid>
          </div>
        ),
      },
    },
  ];

  const handleGetUserData = (uid) => {
    const userPath = `users/${currentUser.uid}`;
    getDb(userPath).then((snapshot) => snapshot.val() && setUserData(snapshot.val()));
  };

  useEffect(() => {
    handleGetUserData(currentUser.uid);

    return () => {};
  }, [currentUser]);

  return (
    <div className={cx('user-info-wrapper')}>
      <div className={cx('user-info-wrapper-to-set-height')}>
        <div className={cx('user-info-item', 'user-info-left')}>
          <div className={cx('user-info-left-avatar-wrapper')}>
            <img
              className={cx('user-info-left-avatar-img')}
              src={userData.photoURL || images.defaultAvt}
              alt="Ảnh bị lỗi"
            />
          </div>
          <div className={cx('user-info-left-name')}>{userData.displayName}</div>
          {userData.bio && <div className={cx('user-info-left-bio')}>{userData.bio}</div>}
        </div>
        <div className={cx('user-info-item', 'user-info-right')}>
          <div className={cx('user-info-right-title')}>Cài đặt tài khoản</div>
          <div className={cx('user-info-right-content')}>
            {fields.map((field, index) => (
              <div key={`User-Information-${index}`} className={cx('user-info-right-content-item')}>
                <div className={cx('user-info-item-right-content-item-top')}>
                  <div className={cx('user-info-item-right-content-item-top-main')}>
                    <div className={cx('user-info-item-right-content-item-field-name')}>{field.fieldName}</div>
                    <div className={cx('user-info-item-right-content-item-field-value')}>{field.value}</div>
                  </div>
                  {field.modifiable && (
                    <div className={cx('user-info-item-value-right-icon-wrapper')}>
                      <FontAwesomeIcon icon={faPen} />
                    </div>
                  )}
                </div>
                {field.modifiable && field.isModifyTabVisible && (
                  <ModifyTab
                    header={field.modifyTabData.modifyTabName}
                    submitFn={field.modifyTabData.modifyTabSubmitFn}
                    chilren={field.modifyTabData.modifyTabRender}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfomation;
