import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { default as Action } from '../HeaderElements/HeaderAction';
import { default as Search } from '../HeaderElements/HeaderSearch';
import styles from './Header.module.scss';
import images from '../../../assets/images';
import { GroupIcon, HomeIcon, WatchIcon, UserIcon, GameIcon } from '../../../assets/Icons';
import HeaderMenuActive from '../CommonComponents/HeaderMenuActive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const MENU = [
  { title: '', to: '/home', icon: <HomeIcon width={'28px'} height={'28px'} />, tippyContent: 'Trang chủ' },
  { title: '', to: '', icon: <WatchIcon width={'28px'} height={'28px'} />, tippyContent: 'Watch' },
  { title: '', to: '', icon: <UserIcon width={'28px'} height={'28px'} />, tippyContent: 'Bạn bè' },
  { title: '', to: '', icon: <GroupIcon width={'28px'} height={'28px'} />, tippyContent: 'Nhóm' },
  { title: '', to: '', icon: <GameIcon width={'28px'} height={'28px'} />, tippyContent: 'Trò chơi' },
];

const cx = classNames.bind(styles);

function Header() {
  return (
    <header className={cx('wrapper')}>
      {/* Brand */}
      <div className={cx('brand')}>
        <Link className={cx('logo-wrapper')} to="/home">
          <img className={cx('logo')} src={images.logo} alt="Facebook" />
        </Link>
        <div className={cx('search')}>
          <Search />
        </div>
      </div>

      {/* Header Menu */}

      <nav className={cx('tab')}>
        <div className={cx('btn-menu-toggle')}>
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className={cx('menu-wrapper')}>
          <HeaderMenuActive menu={MENU} rootPath={''} />
        </div>
      </nav>

      {/* Action */}
      <div className={cx('action')}>
        <Action />
      </div>
    </header>
  );
}

export default Header;
