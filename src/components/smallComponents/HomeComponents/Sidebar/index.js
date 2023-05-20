import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import Styles from './Sidebar.module.scss';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import images from '../../../../assets/images';

const dataTab = [
  // {
  //   img: 'https://vcdn1-thethao.vnecdn.net/2022/11/30/Untitled-8697-1669804562.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=3Qi2v17m7Fy_udZMXg_RPg',
  //   title: 'Đinh Công Tuấn',
  //   to: '/user/dinhcongtuan',
  // },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/P3LEV6Y0FCf.png',
    title: 'Bạn bè',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/ob1CgXwDORG.png',
    title: 'Watch',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yN/r/P3LEV6Y0FCf.png',
    title: 'Nhóm',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yD/r/0cF-NVaaM2z.png',
    title: 'Sự kiện',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yQ/r/3YkGLxHO24x.png',
    title: 'Gần đây nhất',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yM/r/hZ_wPvPD4VY.png',
    title: 'Chiến dịch gây quỹ',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yT/r/Rwoc8jeB73K.png',
    title: 'Chơi game',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yI/r/qirqv2EkNyF.png',
    title: 'Đã lưu',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yi/r/hwvo7RvTzNz.png',
    title: 'Facebook Pay',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yZ/r/CpdWrf1nzR2.png',
    title: 'Hiến máu',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/y3/r/Jr0q8qKF2-Y.png',
    title: 'Trung tâm khoa học khí hậu',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yq/r/fNPcDZC-2PD.png',
    title: 'Ứng phó khẩn cấp',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/vxMUnHhu6Do.png',
    title: 'Sức khỏe cảm xúc',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yu/r/1Xvrz50fHMF.png',
    title: 'Messenger Nhí',
    to: '',
  },
  {
    img: 'https://static.xx.fbcdn.net/rsrc.php/v3/yb/r/Yd7d7vTJ0VE.png',
    title: 'Vật phẩm kĩ thuật số',
    to: '',
  },
];

const cx = classNames.bind(Styles);

function Sidebar() {
  const [elementsRender, setElementsRender] = useState(8);
  const [isLoadMore, setIsLoadMore] = useState(false);

  const user = useSelector((state) => state.user);

  const handleLoadMore = () => {
    if (!isLoadMore) {
      setIsLoadMore(true);
      setElementsRender(dataTab.length - 1);
    } else {
      setIsLoadMore(false);
      setElementsRender(8);
    }
  };

  return (
    <div className={cx('wrapper')}>
      <ul className={cx('list-wrapper')}>
        <li className={cx('list-item')} key={user.uid}>
          <Link className={cx('item-link')} to={`/profile/${user.uid}/home`}>
            <img className={cx('item-img')} src={user.photoURL || images.defaultAvt} />
            <span className={cx('item-title')}>{user.displayName || 'Người dùng Facebook'}</span>
          </Link>
        </li>
        {dataTab.slice(0, elementsRender + 1).map((data, index) => (
          <li className={cx('list-item')} key={index}>
            <Link className={cx('item-link')} to={data.to}>
              <img className={cx('item-img')} src={data.img} />
              <span className={cx('item-title')}>{data.title}</span>
            </Link>
          </li>
        ))}
        <li className={cx('item-link', 'btn-load-more-wrapper')} onClick={handleLoadMore}>
          {!isLoadMore && (
            <div className={cx('btn-load-more', 'item-link')}>
              <span className={cx('item-wrapper')}>
                <FontAwesomeIcon icon={faCaretDown} className={cx('item-icon')} />
              </span>
              <span className={cx('item-title')}>Xem thêm</span>
            </div>
          )}
          {isLoadMore && (
            <div className={cx('btn-load-more', 'item-link')}>
              <span className={cx('item-wrapper')}>
                <FontAwesomeIcon icon={faCaretUp} className={cx('item-icon')} />
              </span>
              <span className={cx('item-title')}>Ẩn bớt</span>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
