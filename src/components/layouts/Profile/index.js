import { useSelector } from 'react-redux';
import { Fragment } from 'react';

import classNames from 'classnames/bind';

import ProfileTop from '../../smallComponents/ProfileComponents/ProfileTop';
import { Header } from '../../smallComponents';
import MessengerPopUp from '~/components/smallComponents/CommonComponents/MessengerPopUp';

import style from './Profile.module.scss';

const cx = classNames.bind(style);

function Profile({ children }) {
  const messengerPopUp = useSelector((state) => state.messengerPopUp);

  return (
    <Fragment>
      <div className={cx('wrapper')}>
        <header className={cx('header')}>
          <Header />
        </header>
        <div className={cx('main')}>
          <ProfileTop self />
          <div className={cx('bottom')}>{children}</div>
        </div>
      </div>
      {(Object.keys(messengerPopUp.show).length > 0 || Object.keys(messengerPopUp.hide).length > 0) && (
        <MessengerPopUp messengerPopUpList={messengerPopUp}>
          <div className={cx('messenger-pop-up-parent')}></div>
        </MessengerPopUp>
      )}
    </Fragment>
  );
}

export default Profile;
