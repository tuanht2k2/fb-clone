import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

import { getDb } from '~/utils/databaseTools/dbReadMethod';
import images from '~/assets/images';

import style from './MessengerImage.module.scss';

const cx = classNames.bind(style);

function MessengerImage() {
  const { messKey, groupKey, messageKey, index } = useParams();

  const [imagePath, setImagePath] = useState('');

  const navigate = useNavigate();

  const [imageScale, setImageScale] = useState(1);

  const handleBack = () => {
    navigate(-1);
  };

  const handleZoom = (action) => {
    if (action === 'ZOOM_IN') {
      setImageScale((prev) => prev + 0.2);
    } else {
      setImageScale((prev) => prev - 0.2);
    }
  };

  useEffect(() => {
    const filePathDb = `messengers/${messKey}/messageGroups/${groupKey}/messages/${messageKey}/files/${index}`;
    getDb(filePathDb).then((imageSnapshot) => {
      imageSnapshot.val() && setImagePath(imageSnapshot.val());
    });

    return () => {};
  }, []);

  return (
    <div className={cx('wrapper')}>
      <div className={cx('image-control')}>
        <div className={cx('image-control-left')}>
          <span
            className={cx('icon-wrapper')}
            onClick={() => {
              handleBack();
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </span>
          <Link to={'/home'} className={cx('image-control-left-home-icon-wrapper')}>
            <img className={cx('logo-img')} src={images.logo} />
          </Link>
        </div>
        <div className={cx('image-control-right')}>
          <span
            className={cx('icon-wrapper', 'image-control-right-zoom-icon-wrapper', imageScale >= 1.9 && 'disabled')}
            onClick={() => {
              imageScale < 1.9 && handleZoom('ZOOM_IN');
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlassPlus} />
          </span>
          <span
            className={cx('icon-wrapper', 'image-control-right-zoom-icon-wrapper', imageScale <= 1 && 'disabled')}
            onClick={() => {
              imageScale > 1 && handleZoom('ZOOM_OUT');
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlassMinus} />
          </span>
        </div>
      </div>
      <img
        className={cx('image-tag')}
        src={imagePath}
        alt="Ảnh này đã bị xóa"
        style={{ transform: `scale(${imageScale})` }}
      />
    </div>
  );
}

export default MessengerImage;
