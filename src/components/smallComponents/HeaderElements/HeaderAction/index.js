import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGrip,
  faCircleExclamation,
  faGear,
  faGlobe,
  faList,
  faLock,
  faMoon,
  faNewspaper,
  faQuestion,
  faArrowRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

import { auth } from '../../../../firebase';

import style from './HeaderAction.module.scss';
import { MessageIcon } from '../../../../assets/Icons';
import images from '../../../../assets/images';
import ActionMenu from '../ActionMenu';
import { MultiLevelMenu } from '../../CommonComponents';
import NotificationDropdown from '../NotificationDropdown';
import Messenger from '../Messenger';

const cx = classNames.bind(style);

const MENU_DATA = {
  header: null,
  items: [
    {
      icon: <FontAwesomeIcon icon={faGear} />,
      title: 'Cài đặt & quyền riêng tư',
      children: {
        header: 'Cài đặt & quyền riêng tư',
        items: [
          {
            icon: <FontAwesomeIcon icon={faGear} />,
            title: 'Cài đặt',
            children: null,
            to: '/settings',
            onClick: '',
          },
          {
            icon: <FontAwesomeIcon icon={faLock} />,
            title: 'Kiểm tra quyền riêng tư',
            children: null,
            to: '',
            onClick: '',
          },
          {
            icon: <FontAwesomeIcon icon={faLock} />,
            title: 'Trung tâm quyền riêng tư',
            children: null,
            to: '',
            onClick: '',
          },
          {
            icon: <FontAwesomeIcon icon={faList} />,
            title: 'Nhật ký hoạt động',
            children: null,
            to: '',
            onClick: '',
          },
          {
            icon: <FontAwesomeIcon icon={faNewspaper} />,
            title: 'Tùy chọn Bảng feed',
            children: null,
            to: '',
            onClick: '',
          },
          {
            icon: <FontAwesomeIcon icon={faGlobe} />,
            title: 'Ngôn ngữ',
            children: null,
            to: '',
            onClick: '',
          },
        ],
      },
      to: '',
      onClick: '',
    },
    {
      icon: <FontAwesomeIcon icon={faQuestion} />,
      title: 'Trợ giúp & hỗ trợ',
      children: null,
      to: '',
      onClick: '',
    },
    {
      icon: <FontAwesomeIcon icon={faMoon} />,
      title: 'Màn hình & trợ năng',
      children: null,
      to: '',
      onClick: '',
    },
    {
      icon: <FontAwesomeIcon icon={faCircleExclamation} />,
      title: 'Đóng góp ý kiến',
      children: null,
      to: '',
      onClick: '',
    },
    {
      isSeparator: true,
    },
    {
      icon: <FontAwesomeIcon icon={faArrowRightFromBracket} />,
      title: 'Đăng xuất',
      children: null,
      to: '',
      onClick: (handleSignOut) => {
        auth
          .signOut()
          .then(() => {
            handleSignOut();
          })
          .catch((error) => {});
      },
    },
  ],
};

function HeaderAction() {
  const user = useSelector((state) => state.user);

  return (
    <div className={cx('action-wrapper')}>
      <ul className={cx('action-list')}>
        {/* Menu */}
        <HeadlessTippy interactive trigger="click" placement="bottom" render={(attrs) => <ActionMenu />}>
          <li className={cx('action-item')}>
            <FontAwesomeIcon width={'21px'} height={'21px'} icon={faGrip} className={cx('action-item-icon')} />
          </li>
        </HeadlessTippy>

        <Messenger />

        <NotificationDropdown />

        <li className={cx('action-item')}>
          <HeadlessTippy
            interactive
            trigger="click"
            placement="bottom-end"
            render={(attrs) => <MultiLevelMenu menu={MENU_DATA} />}
          >
            <img src={user.photoURL || images.defaultAvt} alt="avatar" className={cx('avatar')} />
          </HeadlessTippy>
        </li>
      </ul>
    </div>
  );
}

export default HeaderAction;
