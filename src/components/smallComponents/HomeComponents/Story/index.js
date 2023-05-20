import classNames from 'classnames/bind';

import instance from '../../../../callApi';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styles from './Story.module.scss';

import { StoryItem } from './storyItem';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

function Story() {
  const [stories, setStories] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    instance.get(`/stories`).then((res) => {
      setStories(res.data);
    });
  }, []);

  return (
    <div className={cx('wrapper')}>
      <ul className={cx('stories-list')}>
        <li className={cx('story-item')}>
          <Link to={`stories/create`} className={cx('story-item-link')}>
            <div className={cx('story-create-wrapper')}>
              <div className={cx('story-create-img-wrapper')}>
                <img className={cx('story-create-img')} src={user.photoURL} />
                <span className={cx('story-create-icon')}>
                  <FontAwesomeIcon icon={faPlus} className={cx('plus')} />
                </span>
              </div>
              <span className={cx('story-create-title')}>Tạo tin</span>
            </div>
          </Link>
        </li>
        {stories.slice(0, 4).map((story, index) => (
          <StoryItem
            key={index}
            id={story.id}
            img={story.img}
            video={story.video}
            isCreate={false}
            userId={story.userId}
          />
        ))}
      </ul>
    </div>
  );
}

export default Story;
