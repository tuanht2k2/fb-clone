import { useSelector } from 'react-redux';
import { Fragment } from 'react';

import classNames from 'classnames/bind';

import MessengerPopUp from '~/components/smallComponents/CommonComponents/MessengerPopUp';
import { Header } from '../../smallComponents';

import styles from './Default.module.scss';

const cx = classNames.bind(styles);

function Default({ children }) {
  const messengerPopUp = useSelector((state) => state.messengerPopUp);

  return (
    <Fragment>
      <div className={cx('wrapper')}>
        <header className={cx('header')}>
          <Header />
        </header>
        <div className={cx('main')}>{children}</div>
      </div>
      {(Object.keys(messengerPopUp.show).length > 0 || Object.keys(messengerPopUp.hide).length > 0) && (
        <MessengerPopUp messengerPopUpList={messengerPopUp}>
          <div className={cx('messenger-pop-up-parent')}></div>
        </MessengerPopUp>
      )}
    </Fragment>
  );
}

export default Default;
