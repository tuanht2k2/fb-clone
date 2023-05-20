import { cloneElement, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import classNames from 'classnames/bind';

import { getDb } from '~/utils/databaseTools/dbReadMethod';

import { Header } from '~/components/smallComponents';
import ProfileTop from '~/components/smallComponents/ProfileComponents/ProfileTop';
import MessengerPopUp from '~/components/smallComponents/CommonComponents/MessengerPopUp';
import style from './Account.module.scss';

const cx = classNames.bind(style);

function Account({ children }) {
  let { uid } = useParams();
  const messengerPopUp = useSelector((state) => state.messengerPopUp);

  const [user, setUser] = useState({});

  const childrenWithProps = cloneElement(children, { otherUser: user });

  useEffect(() => {
    getDb(`users/${uid}`).then((snapshot) => {
      setUser(snapshot.val() || {});
    });

    return () => {};
  }, []);

  return (
    <Fragment>
      <div className={cx('wrapper')}>
        <header className={cx('header')}>
          <Header />
        </header>
        <div className={cx('main')}>
          <ProfileTop otherUser={user} />
          <div className={cx('bottom')}>{childrenWithProps}</div>
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

export default Account;
