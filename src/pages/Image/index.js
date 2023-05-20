import { useEffect, useState, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';

import { getDb } from '~/utils/databaseTools/dbReadMethod';

import style from './Image.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassMinus, faMagnifyingGlassPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import images from '~/assets/images';

const cx = classNames.bind(style);

function Image() {
  const { imageId } = useParams();
  const navigate = useNavigate();

  const [imagePath, setImagePath] = useState('');
  const [imageScale, setImageScale] = useState(1);

  const handleGetImage = () => {
    const imagePath = `media/images/${imageId}`;
    getDb(imagePath).then((snapshot) => {
      setImagePath(snapshot.val()?.mediaDownloadURL || '');
    });
  };

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
    handleGetImage();

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

export default Image;
