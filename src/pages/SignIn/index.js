// Import FirebaseAuth and firebase.
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'firebase/compat/auth';

import classNames from 'classnames/bind';

import style from './SignIn.module.scss';
import { auth } from '../../firebase';
import { onAuthStateChanged, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { Grid, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const INPUTS = [
  {
    id: 'email',
    fullWidth: true,
    _name: 'email',
    label: 'Số điện thoại hoặc email',
    type: 'text',
    inputProps: { style: { fontSize: 14 } },
    autoFocus: false,
    autoComplete: '',
  },
  {
    id: 'password',
    fullWidth: true,
    _name: 'password',
    label: 'Mật khẩu',
    type: 'password',
    inputProps: { style: { fontSize: 14 } },
    autoFocus: false,
    autoComplete: 'current-password',
  },
];

const cx = classNames.bind(style);

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'redirect',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
};

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [inputState, setInputState] = useState({
    email: {
      value: '',
      helperText: '',
    },
    password: {
      value: '',
      helperText: '',
    },
  });

  const handleRedirect = () => {
    navigate('/home');
  };

  // UI

  const handleFocus = (e, inputName) => {
    handleUpdateState(inputName, 'helperText', '');
  };

  const handleBlur = (e, inputName) => {
    const helperText = handleValidateData(e.target.value, inputName);
    handleUpdateState(inputName, 'helperText', helperText);
  };

  const handleInputOnChange = (e, type) => {
    const value = e.target.value;
    handleUpdateState(type, 'value', value);
  };

  const handleUpdateState = (inputType, key, value) => {
    setInputState((prev) => ({
      ...prev,
      [inputType]: { ...prev[inputType], [key]: value },
    }));
  };

  // API

  const handleValidateData = (value, type) => {
    if (!String(value).trim()) return 'Hãy nhập trường này';
    switch (type) {
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
      default:
        return '';
    }
  };

  const handleLogin = () => {
    let isValid = true;
    for (const key in inputState) {
      const validationState = handleValidateData(inputState[key].value, key);
      if (validationState) {
        isValid = false;
        handleUpdateState(key, 'helperText', validationState);
      }
    }
    if (isValid) {
      setIsLoginLoading(true);
      // handle login
      const email = inputState.email.value;
      const password = inputState.password.value;
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(user);
          setIsSignedIn(true);
        })
        .catch((err) => {
          setIsLoginLoading(false);
          switch (err.code) {
            case 'auth/wrong-password':
              handleUpdateState('email', 'helperText', 'Tài khoản hoặc mật khẩu không chính xác');
              handleUpdateState('password', 'helperText', 'Tài khoản hoặc mật khẩu không chính xác');
              break;
            default:
              return;
          }
        });
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      handleRedirect();
    }
  }, [isSignedIn]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsSignedIn(true);
      }
    });

    document.title = 'Đăng nhập';
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('wrapper-align')}>
        <div className={cx('introduction')}>
          <span className={cx('name')}>facebook</span>
          <span className={cx('content')}>
            Facebook giúp bạn kết nối và chia sẻ với mọi người trong cuộc sống của bạn.
          </span>
        </div>
        <div className={cx('main')}>
          <div className={cx('main-login')}>
            <div className={cx('login-wrapper')}>
              <form className={cx('form-tag')}>
                <Grid container spacing={2}>
                  {INPUTS.map((input, index) => (
                    <Grid item key={index} xs={12}>
                      <TextField
                        id={input.id}
                        name={input._name}
                        label={input.label}
                        type={input.type}
                        inputProps={input.inputProps}
                        autoFocus={input.autoFocus}
                        autoComplete={input.autoComplete}
                        fullWidth={input.fullWidth}
                        error={!!inputState[input._name].helperText}
                        helperText={inputState[input._name].helperText}
                        value={inputState[input._name].value}
                        onChange={(e) => {
                          handleInputOnChange(e, input._name);
                        }}
                        onFocus={(e) => {
                          handleFocus(e, input._name);
                        }}
                        onBlur={(e) => {
                          handleBlur(e, input._name);
                        }}
                      />
                    </Grid>
                  ))}
                  {/* </Box> */}
                </Grid>
              </form>
              <button
                className={cx('login-btn')}
                onClick={() => {
                  handleLogin();
                }}
              >
                {!isLoginLoading && <span className={cx('login-btn-text')}>Đăng nhập</span>}
                {isLoginLoading && (
                  <span className={cx('login-btn-loading-wrapper')}>
                    <FontAwesomeIcon icon={faSpinner} />
                  </span>
                )}
              </button>
              <div className={cx('login-with-social-network')}>
                {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} /> */}
              </div>
              <a className={cx('forget-password')} href="/forgetpasswd">
                Quên mật khẩu?
              </a>
            </div>
            <Link to={'/register'} className={cx('btn-link')}>
              <button className={cx('create-account-btn')}>Tạo tài khoản mới</button>
            </Link>
          </div>
          <div className={cx('main-page-create')}>
            Tạo trang dành cho người nổi tiếng, thương hiệu hoặc doanh nghiệp
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
