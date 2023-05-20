import { faEllipsis, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';

import { VideoPlusIcon } from '../../../../assets/Icons';
import style from './Complementary.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(style);

const INTERFACE = [
  {
    header: {
      title: 'Trang và trang cá nhân của bạn',
      actions: [{ tippy: 'Tùy chọn', icon: <FontAwesomeIcon icon={faEllipsis} /> }],
    },
    contents: [
      {
        type: 'parent',
        to: '/page/realmadridcf',
        iconClassName: '',
        className: cx('content-item-parent'),
        img: 'https://t.ex-cdn.com/doanhnhanphaply.vn/resize/534x280/files/news/2022/10/17/real-madrid-thang-barcelona-3-1-doc-chiem-ngoi-dau-la-liga-134117.jpg',
        content: 'Real Madrid C.F',
      },
      {
        type: 'child',
        to: '/page/annoucements',
        iconClassName: cx('bell'),
        className: cx('content-item-child'),
        img: '',
        content: '1 Thông báo',
      },
      {
        type: 'child',
        to: '/switch',
        iconClassName: cx('switch'),
        className: cx('content-item-child'),
        img: '',
        content: 'Chuyển sang trang',
      },
      {
        type: 'child',
        to: '/page/createads',
        iconClassName: cx('speaker'),
        className: cx('content-item-child'),
        img: '',
        content: 'Tạo quảng cáo',
      },
    ],
  },
  {
    header: {
      title: 'Sinh nhật',
      actions: [],
    },
    contents: [
      {
        type: 'parent',
        to: 'birthday',
        iconClassName: cx('birthday'),
        className: cx('content-item-parent'),
        img: '',
        content: 'Hôm nay là sinh nhật của Lê Mạnh',
      },
    ],
  },
  {
    header: {
      title: 'Người liên hệ',
      actions: [
        { tippy: 'Cuộc gọi mói', icon: <VideoPlusIcon className={cx('font-awesome-icon')} height={25} width={25} /> },
        {
          tippy: 'Tìm kiếm theo tên hoặc nhóm',
          icon: <FontAwesomeIcon className={cx('font-awesome-icon')} icon={faMagnifyingGlass} />,
        },
        { tippy: 'Tùy chọn', icon: <FontAwesomeIcon className={cx('font-awesome-icon')} icon={faEllipsis} /> },
      ],
    },
    contents: [
      {
        type: 'parent',
        to: '/users/2',
        iconClassName: '',
        className: cx('content-item-parent'),
        img: 'https://t.ex-cdn.com/doanhnhanphaply.vn/resize/534x280/files/news/2022/10/17/real-madrid-thang-barcelona-3-1-doc-chiem-ngoi-dau-la-liga-134117.jpg',
        content: 'Trần Văn Hiệp',
      },
      {
        type: 'parent',
        to: '/users/2',
        iconClassName: '',
        className: cx('content-item-parent'),
        img: 'https://t.ex-cdn.com/doanhnhanphaply.vn/resize/534x280/files/news/2022/10/17/real-madrid-thang-barcelona-3-1-doc-chiem-ngoi-dau-la-liga-134117.jpg',
        content: 'Đoàn Thị Ngọc Thảo',
      },
      {
        type: 'parent',
        to: '/users/2',
        iconClassName: '',
        className: cx('content-item-parent'),
        img: 'https://t.ex-cdn.com/doanhnhanphaply.vn/resize/534x280/files/news/2022/10/17/real-madrid-thang-barcelona-3-1-doc-chiem-ngoi-dau-la-liga-134117.jpg',
        content: 'Phương Nam',
      },
    ],
  },
  {
    header: {
      title: 'Cuộc trò chuyện nhóm',
      actions: [],
    },
    contents: [
      {
        type: 'parent',
        to: '/users/2',
        iconClassName: '',
        className: cx('content-item-parent'),
        img: 'https://play.google.com/store/apps/details?id=com.football.soccer.league&hl=en_US&gl=US',
        content: 'Đội bóng đủ Lâm',
      },
      {
        type: 'child',
        to: '/users/2',
        iconClassName: '',
        className: cx('content-item-parent'),
        img: 'http://english.doanthanhnien.vn/Uploads/image/News/Thumbnails/2017/12/Thumbnails14202017042037.jpg',
        content: 'Nhóm đoàn xóm 10',
      },
      {
        type: 'child',
        to: '/users/2',
        iconClassName: '',
        className: cx('content-item-parent'),
        img: 'https://icdn.dantri.com.vn/thumb_w/640/2021/02/27/diem-danh-7-guong-mat-hot-girl-xinh-dep-noi-bat-trong-thang-2-docx-1614441451966.jpeg',
        content: 'All Stars giúp đỡ nhau học tập',
      },
      {
        type: 'child',
        to: '/users/2',
        iconClassName: cx('add'),
        className: cx('content-item-parent', 'hover1'),
        img: '',
        content: 'Tạo nhóm mới',
      },
    ],
  },
];

function Complementary() {
  return (
    <ul className={cx('wrapper')}>
      {INTERFACE.map((item, index) => (
        <li key={index} className={cx('item-wrapper')}>
          <div className={cx('item-header')}>
            <div className={cx('item-header-title')}>{item.header.title}</div>
            <ul className={cx('item-header-action-wrapper')}>
              {item.header.actions.map((action, index) =>
                action.tippy ? (
                  <Tippy interactive arrow={false} placement="top" content={action.tippy} key={index}>
                    <li key={index} className={cx('item-header-action-item')}>
                      {action.icon}
                    </li>
                  </Tippy>
                ) : (
                  <li key={index} className={cx('item-header-action-item')}>
                    {action.icon}
                  </li>
                ),
              )}
            </ul>
          </div>
          <ul className={cx('content-wrapper')}>
            {item.contents.map((content, index) => (
              <li key={index} className={content.className}>
                <Link className={cx('content-link')} to={content.to}>
                  <div className={cx('content-icon-wrapper')}>
                    {content.iconClassName && <span className={content.iconClassName}></span>}
                    {!content.iconClassName && <img className={cx('content-icon-img')} src={content.img} />}
                  </div>
                  <div className={cx('content-item-title')}>{content.content}</div>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default Complementary;
