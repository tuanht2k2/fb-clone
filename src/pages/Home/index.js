import classNames from 'classnames/bind';
import styles from './Home.module.scss';

import { Sidebar, Complementary, Story, PostCreate } from '../../components/smallComponents/HomeComponents';
import Postlist from '../../components/smallComponents/CommonComponents/PostList';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

function Home() {
  useEffect(() => {
    document.title = 'Trang chủ';
  }, []);

  return (
    <div className={cx('wrapper')}>
      <aside className={cx('sidebar')}>
        <Sidebar />
      </aside>
      <div className={cx('content')}>
        <div className={cx('post-wrapper')}>
          <PostCreate />
          <Postlist path={`posts`} />
        </div>
      </div>
      {/* <aside className={cx('complementary')}>
        <Complementary />
      </aside> */}
    </div>
  );
}

export default Home;
