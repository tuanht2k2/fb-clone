import classNames from 'classnames/bind';

import style from './OtherUserIntroduce.module.scss';

const cx = classNames.bind(style);

function OtherUserIntroduce({ user }) {
  return (
    <div className={cx('wrapper')}>
      <header className={cx('header')}>Giới thiệu</header>
      <div className={cx('main')}>{user.bio && <div className={cx('bio-wrapper')}>{user.bio}</div>}</div>
    </div>
  );
}

export default OtherUserIntroduce;
