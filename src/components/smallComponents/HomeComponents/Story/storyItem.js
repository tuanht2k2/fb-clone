import classNames from 'classnames/bind';
import { Link } from 'react-router-dom';

import { useState, useEffect } from 'react';

import instance from '../../../../callApi';
import styles from './Story.module.scss';

const cx = classNames.bind(styles);

export function StoryItem({ id, img, video, isCreate, userId }) {
  const [userData, setUserData] = useState({});
  // useEffect(() => {
  //   instance.get(`/users/${userId}`).then((res) => {
  //     setUserData(res.data);
  //   });
  // }, []);

  return (
    <li className={cx('story-item')}>
      <Link to={`stories/${id}`} className={cx('story-item-link')}>
        <div className={cx('story-img-wrapper')}>
          {img ? (
            <img className={cx('story-img')} src={img} />
          ) : (
            <video className={cx('story-video')} controls>
              <source src={video} type="video/mp4"></source>
            </video>
          )}
        </div>
        {
          <div className={cx('story-details')}>
            <div className={cx('user-avt-wrapper')}>
              <img
                src={
                  userData.avt ||
                  'https://ik.imagekit.io/tuanht2k2/useravt/defaultavt.jpg?ik-sdk-version=javascript-1.4.3&updatedAt=1676101710322'
                }
                className={cx('user-avt')}
              />
            </div>
            <span className={cx('user-name')}>{userData.name}</span>
          </div>
        }
      </Link>
    </li>
  );
}
