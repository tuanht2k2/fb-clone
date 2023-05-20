import classNames from 'classnames/bind';
import style from './OnlyHeader.module.scss';

import Header from '../../smallComponents/Header';

const cx = classNames.bind(style);

function OnlyHeader({ children }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <Header />
      </div>
      <div className={cx('main')}>{children}</div>
    </div>
  );
}

export default OnlyHeader;
