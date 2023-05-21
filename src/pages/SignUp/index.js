import { Link, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';

import { Button, FormControl, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import style from './SignUp.module.scss';
import { loadUser, updateUser } from '~/actions/user';
import { writeUserDataAfterSignUp } from '../../utils/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const cx = classNames.bind(style);

const TF_INPUT = [
  {
    id: 'firstName',
    fullWidth: true,
    _name: 'firstName',
    label: 'Họ',
    type: 'text',
    inputProps: { style: { fontSize: 14 } },
    autoFocus: false,
    mt: { mt: 2 },
    xs: 12,
    sm: 6,
  },
  {
    id: 'lastName',
    fullWidth: true,
    _name: 'lastName',
    label: 'Tên',
    type: 'text',
    inputProps: { style: { fontSize: 14 } },
    autoFocus: false,
    mt: { mt: 2 },
    xs: 12,
    sm: 6,
  },
  {
    id: 'email',
    fullWidth: true,
    _name: 'email',
    label: 'Số điện thoại hoặc email',
    type: 'text',
    inputProps: { style: { fontSize: 14 } },
    autoFocus: false,
    mt: { mt: 2 },
    xs: 12,
    sm: 12,
  },
  {
    id: 'password',
    fullWidth: true,
    _name: 'password',
    label: 'Mật khẩu',
    type: 'password',
    inputProps: { style: { fontSize: 14 } },
    autoFocus: false,
    mt: { mt: 2 },
    xs: 12,
    sm: 12,
  },
  {
    id: 'repassword',
    fullWidth: true,
    _name: 'rePassword',
    label: 'Nhập lại mật khẩu',
    type: 'password',
    inputProps: { style: { fontSize: 14 } },
    autoFocus: false,
    mt: { mt: 2 },
    xs: 12,
    sm: 12,
  },
];

function RegisterBox() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSignedUpSuccess, setisSignedUpSuccess] = useState(false);
  const [isSignUpLoading, setIsSignUpLoading] = useState(false);

  const [inputState, setInputState] = useState({
    firstName: {
      value: '',
      error: false,
      helperText: '',
    },
    lastName: {
      value: '',
      error: false,
      helperText: '',
    },
    email: {
      value: '',
      error: false,
      helperText: '',
    },
    password: {
      value: '',
      error: false,
      helperText: '',
    },
    rePassword: {
      value: '',
      error: false,
      helperText: '',
    },
    birthday: {
      value: null,
      error: false,
      helperText: '',
    },
    gender: {
      value: 'other',
      error: false,
      helperText: '',
    },
  });

  const datePickerRef = useRef();

  // common

  const handleUpdateState = (inputType, key, value) => {
    setInputState((prev) => ({
      ...prev,
      [inputType]: { ...prev[inputType], [key]: value },
    }));
  };

  // handle ui

  const handleChange = (e, inputName) => {
    handleUpdateState(inputName, 'value', e.target.value);
  };

  const handleFocus = (e, inputName) => {
    handleUpdateState(inputName, 'helperText', '');
  };

  const handleBlur = (e, inputName) => {
    const helperText = handleValidateState(e.target.value, inputName);
    handleUpdateState(inputName, 'helperText', helperText);
  };

  const handleChangeDatePicker = (newValue) => {
    handleUpdateState('birthday', 'value', newValue);
  };

  const handleSelectGender = (e, value) => {
    handleUpdateState('gender', 'value', value);
  };

  const handleValidateState = (value, inputName) => {
    if (!String(value).trim()) return 'Trường này là bắt buộc';
    switch (inputName) {
      case 'email':
        return String(value)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          )
          ? ''
          : 'Email không hợp lệ';

      case 'password':
        return value.length >= 6 ? '' : 'Mật khẩu phải dài tối thiểu 6 ký tự';
      case 'rePassword':
        return value.length < 6
          ? 'Mật khẩu phải dài tối thiểu 6 ký tự'
          : value == inputState.password.value
          ? ''
          : 'Mật khẩu không khớp';
      case 'birthday':
        return value ? '' : 'invalid';
      case 'gender':
        return value ? '' : 'invalid';
      default:
        return '';
    }
  };

  const handleDatePickerError = () => {
    handleUpdateState('birthday', 'error', true);
  };

  // handle firebase

  const handleUpdateDisplayName = async (name) => {
    return await updateProfile(auth.currentUser, {
      displayName: name,
    })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAfterSignUp = (registerInfo, user) => {
    const firstName = registerInfo.firstName;
    const lastName = registerInfo.lastName;
    const displayName = firstName + ' ' + lastName;

    handleUpdateDisplayName(displayName);

    const { uid, accessToken, email, phoneNumber, photoURL } = user;
    writeUserDataAfterSignUp({ uid, accessToken, firstName, lastName, displayName, email, phoneNumber, photoURL });
  };

  const handleSubmit = () => {
    let registerInfo = {};
    let isValid = true;
    for (const key in inputState) {
      const validation = handleValidateState(inputState[key]['value'], key);
      if (validation) {
        setInputState((prev) => ({
          ...prev,
          [key]: { ...prev[key], value: '', helperText: validation },
        }));
        isValid = false;
      } else {
        registerInfo = { ...registerInfo, [key]: inputState[key]['value'] };
      }
    }
    isValid && handleSignUp(registerInfo);
  };

  const handleSignUp = async (registerInfo) => {
    setIsSignUpLoading(true);
    await createUserWithEmailAndPassword(auth, registerInfo.email, registerInfo.password)
      .then((userCredential) => {
        const newUser = userCredential.user;
        handleAfterSignUp(registerInfo, newUser);
        auth.signOut();
      })
      .then(() => {
        setisSignedUpSuccess(true);
        setIsSignUpLoading(false);
      })
      .catch((err) => {
        setIsSignUpLoading(false);
        switch (err.code) {
          case 'auth/email-already-in-use':
            handleUpdateState('email', 'helperText', 'Email này đã được sử dụng');

            break;
          default:
            return;
        }
      });
  };

  useEffect(() => {
    document.title = 'Đăng ký';
  }, []);

  return (
    <div className={cx('wrapper')}>
      <h1 className={cx('brand')}>facebook</h1>
      <div className={cx('content-wrapper')}>
        <header className={cx('header')}>
          <span className={cx('header-title-name')}>Tạo tài khoản mới</span>
          <span className={cx('header-title-desc')}>Nhanh chóng và dễ dàng</span>
        </header>
        <div className={cx('main-wrapper')}>
          <FormControl className={'register-form-tag'}>
            <Grid container spacing={2}>
              {TF_INPUT.map((input, index) => {
                return (
                  <Grid item xs={input.xs} sm={input.sm} key={index}>
                    <TextField
                      id={input.id}
                      name={input._name}
                      label={input.label}
                      type={input.type}
                      inputProps={input.inputProps}
                      autoFocus={input.autoFocus}
                      fullWidth={input.fullWidth}
                      error={!!inputState[input._name].helperText}
                      helperText={inputState[input._name].helperText}
                      value={inputState[input._name].value}
                      onChange={(e) => {
                        handleChange(e, input._name);
                      }}
                      onFocus={(e) => {
                        handleFocus(e, input._name);
                      }}
                      onBlur={(e) => {
                        handleBlur(e, input._name);
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <div className={cx('radio-checkbox-input-wrapper')}>
              <span className={cx('radio-checkbox-input-wrapper-name')}>Sinh nhật</span>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disableFuture
                  value={inputState.birthday.value}
                  ref={datePickerRef}
                  onError={(err) => {
                    handleDatePickerError();
                  }}
                  onChange={(newValue) => {
                    handleChangeDatePicker(newValue);
                  }}
                />
              </LocalizationProvider>
            </div>
            <div className={cx('radio-checkbox-input-wrapper')}>
              <span className={cx('radio-checkbox-input-wrapper-name')}>Giới tính</span>
              <div className={cx('radio-checkbox-input-wrapper-input')}>
                <RadioGroup
                  row
                  value={inputState.gender.value}
                  onChange={(e, value) => {
                    handleSelectGender(e, value);
                  }}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label={<span style={{ fontSize: '13px' }}>Nam</span>}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label={<span style={{ fontSize: '13px' }}>Nữ</span>}
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label={<span style={{ fontSize: '13px' }}>Tùy chỉnh</span>}
                  />
                </RadioGroup>
              </div>
            </div>
          </FormControl>
        </div>
        <HeadlessTippy
          visible={isSignedUpSuccess}
          interactive
          moveTransition="300"
          render={(attrs) => (
            <div className={cx('success-sign-up-pop-up')}>
              <span className={cx('success-sign-up-pop-up-content')}>Tạo tài khoản thành công</span>
              <Link to="/login" className={cx('navigate-link-btn')}>
                <Button variant="contained" size="large" color="success">
                  Đăng nhập
                </Button>
              </Link>
            </div>
          )}
        >
          <Button
            fullWidth
            variant="contained"
            size="large"
            color="success"
            style={{ width: '50%', height: '40px' }}
            onClick={() => {
              handleSubmit();
            }}
          >
            {!isSignUpLoading && <span className={cx('btn-sign-up-text')}>Đăng ký</span>}
            {isSignUpLoading && (
              <span className={cx('btn-sign-up-loading-icon')}>{<FontAwesomeIcon icon={faSpinner} />}</span>
            )}
          </Button>
        </HeadlessTippy>

        <Link to="/login" className={cx('navigate-link')}>
          Bạn đã có tài khoản?
        </Link>
      </div>
    </div>
  );
}

export default RegisterBox;
