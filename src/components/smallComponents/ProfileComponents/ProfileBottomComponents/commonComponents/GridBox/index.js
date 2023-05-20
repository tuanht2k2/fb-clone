import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import { get, limitToLast, onValue, query, ref } from 'firebase/database';
import { database } from '~/firebase';
import getRef from '~/utils/databaseTools/dbGetRefMethod';
import { getDb } from '~/utils/databaseTools/dbReadMethod';

import images from '~/assets/images';
import style from './GridBox.module.scss';

const cx = classNames.bind(style);

function GridBox({ type, name, desc, to, linkName, dataPath, itemQuantity }) {
  const [renderData, setRenderData] = useState('');

  const handleGetUser = (uid) => {
    const userPath = `users/${uid}`;
    return getDb(userPath);
  };

  const handleGetDataFromDB = (path) => {
    const recentDataRef = query(ref(database, path), limitToLast(itemQuantity));
    get(recentDataRef).then((snapshot) => {
      if (snapshot.val()) {
        const data = snapshot.val();
        switch (type) {
          case 'IMAGES':
            const imagesObj = Object.keys(data)
              .reverse()
              .map((key) => ({ key, img: data[key].mediaDownloadURL, to: `/images/${key}` }));
            setRenderData(imagesObj);
            break;
          case 'FRIENDS':
            const res = Promise.all(
              Object.keys(data)
                .reverse()
                .map((key) => handleGetUser(key)),
            );
            res.then((snapshots) => {
              let results = [];
              snapshots.map((snapshot) => {
                const user = snapshot.val();
                results.push({ key: user.uid, img: user.photoURL || images.defaultAvt, to: `/users/${user.uid}/home` });
              });
              setRenderData(results);
            });

            break;
          default:
            return;
        }
      }
    });
  };

  useEffect(() => {
    handleGetDataFromDB(dataPath);

    const dataRef = getRef(dataPath);
    onValue(dataRef, (snapshot) => {
      handleGetDataFromDB(dataPath);
    });
  }, [dataPath]);

  return (
    <div className={cx('wrapper')}>
      <header className={cx('header')}>
        <div className={cx('info')}>
          <span className={cx('header-name')}>{name}</span>
          {desc && <span className={'header-desc'}></span>}
        </div>
        <Link className={cx('action-link')} to={to}>
          {linkName}
        </Link>
      </header>
      <div className={cx('grid', 'grid-wrapper')}>
        {renderData && (
          <div className={cx('row')}>
            {renderData.map((data) => (
              <div key={`gridbox${data.key}`} className={cx('col', 'c-4', 'l-4', 'm-4', 's-4')}>
                <div className={cx('grid-item-wrapper')}>
                  <img className={cx('grid-item-img')} src={data.img} />
                  <Link className={cx('grid-item-link')} to={data.to}></Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GridBox;
