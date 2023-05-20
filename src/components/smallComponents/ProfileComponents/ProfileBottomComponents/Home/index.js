import classNames from 'classnames/bind';

import style from './Home.module.scss';
import { Introduce } from './components';
import { GridBox } from '../commonComponents';
import { PostCreate } from '../../../../../components/smallComponents/HomeComponents';
import PostList from '~/components/smallComponents/CommonComponents/PostList';
import { useSelector } from 'react-redux';
import OtherUserIntroduce from './components/OtherUserIntroduce';

const cx = classNames.bind(style);

function Home({ self, otherUser }) {
  const currentUser = useSelector((state) => state.user);
  const user = self ? currentUser : otherUser;
  const userPostsPath = `users/${user.uid}/posts`;
  const userImagesPath = `users/${user.uid}/images`;
  const userFriendsPath = `users/${user.uid}/friends`;

  return (
    <div className={cx('wrapper')}>
      <div className={cx('menu-wrapper')}>
        <div className={cx('wrapper-sticky')}>
          {self ? <Introduce /> : <OtherUserIntroduce user={otherUser} />}
          <GridBox
            type={'IMAGES'}
            name={'Ảnh'}
            decs={''}
            to={'/images'}
            linkName={'Xem tất cả ảnh'}
            dataPath={userImagesPath}
            itemQuantity={9}
          />
          <GridBox
            type={'FRIENDS'}
            name={'Bạn bè'}
            decs={'1.222 người bạn'}
            to={'/friends'}
            linkName={self ? 'Xem danh sách bạn bè của bạn' : `Xem danh sách bạn bè của ${otherUser.displayName}`}
            dataPath={userFriendsPath}
            itemQuantity={9}
          />
        </div>
      </div>
      <div className={cx('main-wrapper')}>
        {self && <PostCreate />}
        <PostList path={userPostsPath} />
      </div>
    </div>
  );
}

export default Home;
