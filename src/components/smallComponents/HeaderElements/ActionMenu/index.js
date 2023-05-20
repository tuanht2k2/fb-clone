import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import style from './ActionMenu.module.scss';
import images from '../../../../assets/images';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBagShopping,
  faBookOpen,
  faCalendar,
  faCalendarTimes,
  faFlag,
  faNewspaper,
  faPager,
  faPenToSquare,
  faRectangleAd,
  faStar,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

const MENULEFT = [
  {
    name: 'Xã hội',
    item: [
      {
        path: '/event',
        img: images.event,
        itemName: 'Sự kiện',
        desc: 'Tổ chức hoặc tìm sự kiện cùng những hoạt động khác trên mạng và ở quanh đây',
      },
      {
        path: '/friends',
        img: images.friends,
        itemName: 'Bạn bè',
        desc: 'Tìm kiếm bạn bè hoặc những người bạn có thể biêt',
      },
      {
        path: '/group',
        img: images.group,
        itemName: 'Nhóm',
        desc: 'Kết nối chung với những người chung sở thích',
      },
      {
        path: '/newfeeds',
        img: images.newfeeds,
        itemName: 'Bảng tin',
        desc: 'Xem bài viết của những người và trang bạn theo dõi',
      },
      {
        path: '/favourite',
        img: images.love,
        itemName: 'Yêu thích',
        desc: 'Xem những bài viết yêu thích của bạn',
      },
      {
        path: '/recent',
        img: images.recent,
        itemName: 'Gần đây nhất',
        desc: 'Xem bài viết gần đây nhất từ bạn bè, nhóm, Trang và hơn thế nữa',
      },
      {
        path: '/page',
        img: images.page,
        itemName: 'Trang',
        desc: 'Khám phá và kết nối với các doanh nghiệp trên Facebook',
      },
    ],
  },
  {
    name: 'Giải trí',
    item: [
      {
        path: '/videogame',
        img: images.videogame,
        itemName: 'Video chơi game',
        desc: 'Xem, kết nối với những game và người phát trực tiếp bạn yêu thích',
      },
      {
        path: '/playinggame',
        img: images.playinggame,
        itemName: 'Chơi game',
        desc: 'Chơi game bạn yêu thích',
      },
      {
        path: '/watch',
        img: images.watch,
        itemName: 'Watch',
        desc: 'Đích đến của video phù hợp với sở thích và quan hệ kết nối của bạn',
      },
      {
        path: '/live',
        img: images.live,
        itemName: 'Video trực tiếp',
        desc: 'Xem video trực tiếp phổ biến từ khắp thế giới',
      },
    ],
  },
  {
    name: 'Mua sắm',
    item: [
      {
        path: '/facebookpay',
        img: images.facebookpay,
        itemName: 'Facebook Pay',
        desc: 'Một cách dễ dàng, bảo mật để thanh toán trên các ứng dụng bạn đang dùng',
      },
      {
        path: '/marketplace',
        img: images.marketplace,
        itemName: 'Marketplace',
        desc: 'Mua bán trong cộng đồng của bạn',
      },
    ],
  },
];

const MENUCREATE = [
  {
    type: 'individual',
    items: [
      {
        path: '/post',
        img: <FontAwesomeIcon icon={faNewspaper} />,
        name: 'Đăng',
      },
      {
        path: '/story',
        img: <FontAwesomeIcon icon={faBookOpen} />,
        name: 'Tin',
      },
      {
        path: '/eventinlife',
        img: <FontAwesomeIcon icon={faCalendar} />,
        name: 'Sự kiện trong đời',
      },
    ],
  },
  {
    type: 'social',
    items: [
      {
        path: '/page',
        img: <FontAwesomeIcon icon={faPager} />,
        name: 'Trang',
      },
      {
        path: '/advertisemen',
        img: <FontAwesomeIcon icon={faRectangleAd} />,
        name: 'Quảng cáo',
      },
      {
        path: '/group',
        img: <FontAwesomeIcon icon={faUserGroup} />,
        name: 'Nhóm',
      },
      ,
      {
        path: '/marketplace/createitem',
        img: <FontAwesomeIcon icon={faBagShopping} />,
        name: 'Bài niêm yết trên Marketplace',
      },
      {
        path: '/event',
        img: <FontAwesomeIcon icon={faCalendarTimes} />,
        name: 'Sự kiện',
      },
    ],
  },
];

function ActionMenu() {
  return (
    <div className={cx('menu-wrapper')}>
      <div className={cx('header')}>Menu</div>
      <div className={cx('content')}>
        <div className={cx('menu-list', 'menu-left')}>
          {MENULEFT.map((mainItem, index) => (
            <div className={cx('list-left-wrapper')} key={index}>
              <span className={cx('list-name')}>{mainItem.name}</span>
              <ul className={cx('list-item-wrapper')}>
                {mainItem.item.map((detailItem, detailIndex) => (
                  <li className={cx('menu-item')} key={detailIndex}>
                    <Link className={cx('menu-item-link')} to={detailItem.path}>
                      <img className={cx('menu-item-img')} alt="Image" src={detailItem.img} />
                      <div className={cx('menu-item-info')}>
                        <span className={cx('menu-item-name')}>{detailItem.itemName}</span>
                        <span className={cx('menu-item-desc')}>{detailItem.desc}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={cx('menu-list', 'menu-list-create')}>
          <span className={cx('menu-create-header')}>Tạo</span>
          <ul className={cx('create-list-wrapper')}>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faPenToSquare} />
                </div>
                <div className={cx('create-item-detail-name')}>Đăng</div>
              </Link>
            </li>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faBookOpen} />
                </div>
                <div className={cx('create-item-detail-name')}>Tin</div>
              </Link>
            </li>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faCalendar} />
                </div>
                <div className={cx('create-item-detail-name')}>Sự kiện trong đời</div>
              </Link>
            </li>
            <div className={cx('separator')}></div>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faFlag} />
                </div>
                <div className={cx('create-item-detail-name')}>Trang</div>
              </Link>
            </li>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faRectangleAd} />
                </div>
                <div className={cx('create-item-detail-name')}>Quảng cáo</div>
              </Link>
            </li>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faUserGroup} />
                </div>
                <div className={cx('create-item-detail-name')}>Nhóm</div>
              </Link>
            </li>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faStar} />
                </div>
                <div className={cx('create-item-detail-name')}>Sự kiện</div>
              </Link>
            </li>
            <li className={cx('menu-item')}>
              <Link className={cx('menu-item-link')} to={'/hehe'}>
                <div className={cx('create-item-detail-img')}>
                  <FontAwesomeIcon icon={faBagShopping} />
                </div>
                <div className={cx('create-item-detail-name')}>Bài niêm yết trên Marketplace</div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ActionMenu;
