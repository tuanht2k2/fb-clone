import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';

import { getDb } from '../../../../utils/databaseTools/dbReadMethod';
import { Item } from './components';

import style from './index.module.scss';
import { onValue } from 'firebase/database';
import getRef from '~/utils/databaseTools/dbGetRefMethod';

const cx = classNames.bind(style);

function PostList({ path }) {
  const [posts, setPosts] = useState({});

  const handleGetPostsFromDB = () => {
    const getMethod = getDb(path);
    getMethod.then((snapshot) => {
      setPosts(snapshot.val() || {});
    });
  };

  useEffect(() => {
    handleGetPostsFromDB();

    const postsRef = getRef(path);
    onValue(postsRef, (snapshot) => {
      handleGetPostsFromDB();
    });
  }, [path]);

  return (
    <div className={cx('main-wrapper')}>
      <ul className={cx('list-wrapper')}>
        {Object.keys(posts).length > 0 ? (
          Object.keys(posts)
            .reverse()
            .map((key, index) => {
              return <Item key={`postItem${key}`} postId={key} type={'parent'} />;
            })
        ) : (
          <div className={cx('post-empty')}>Không có bài viết</div>
        )}
      </ul>
    </div>
  );
}

export default PostList;
