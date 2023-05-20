import classNames from 'classnames/bind';
import style from './VideoSettings.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Fragment, useState } from 'react';

const cx = classNames.bind(style);

const SETTINGS = {
  type: 'root',
  hasHeader: false,
  data: [
    {
      title: 'Chất lượng',
      value: 'Tự động 1080p',
      icon: <FontAwesomeIcon className={cx('video-setting-right-arrow')} icon={faChevronRight} />,
      type: 'show',

      children: {
        header: 'Chất lượng',
        hasHeader: true,
        icon: <FontAwesomeIcon className={cx('video-setting-left-arrow')} icon={faChevronLeft} />,
        data: [
          { type: 'checkbox', children: '', set: 'resolution', value: '1080p' },
          { type: 'checkbox', children: '', set: 'resolution', value: '960p' },
          { type: 'checkbox', children: '', set: 'resolution', value: '640p' },
          { type: 'checkbox', children: '', set: 'resolution', value: '540p' },
          { type: 'checkbox', children: '', set: 'resolution', value: '360p' },
          { type: 'checkbox', children: '', set: 'resolution', value: '240p' },
        ],
      },
    },
    {
      title: 'Tốc độ phát lại',
      value: '1',
      icon: <FontAwesomeIcon className={cx('video-setting-right-arrow')} icon={faChevronRight} />,
      type: 'show',

      children: {
        header: 'Tốc độ phát lại',
        hasHeader: true,
        icon: <FontAwesomeIcon className={cx('video-setting-left-arrow')} icon={faChevronLeft} />,
        data: [
          {
            type: 'checkbox',
            children: '',
            set: 'playBackRate',
            value: '0.5',
          },
          {
            type: 'checkbox',
            children: '',
            set: 'playBackRate',
            value: '1',
          },
          {
            type: 'checkbox',
            children: '',
            set: 'playBackRate',
            value: '1.25',
          },
          {
            type: 'checkbox',
            children: '',
            set: 'playBackRate',
            value: '1.5',
          },
          {
            type: 'checkbox',
            children: '',
            set: 'playBackRate',
            value: '1.75',
          },
          {
            type: 'checkbox',
            children: '',
            set: 'playBackRate',
            value: '2',
          },
        ],
      },
    },
  ],
};

function VideoSettings({ video }) {
  const [history, setHistory] = useState([SETTINGS]);
  const [isChecked, setIsChecked] = useState(2);
  // const [playBackRate, setPlayBackRate] = useState(1);
  const current = history[history.length - 1];

  const handleSelect = (sel, index) => {
    if (!sel.children) {
      setIsChecked(index);
    } else setHistory((prev) => [...prev, sel.children]);

    if (sel.set == 'playBackRate') {
      video.playBackRate = sel.value;
    }
  };

  const handleBack = () => {
    setHistory((prev) => {
      return prev.slice(0, prev.length - 1);
    });
  };

  const selectionList = () => (
    <div className={cx('selection-list')}>
      {current.data.map((sel, index) => {
        return (
          <div
            className={cx('selection-item')}
            key={index}
            onClick={() => {
              handleSelect(sel, index);
            }}
          >
            {sel.type == 'checkbox' && (
              <Fragment>
                <div className={cx('selection-item-radio-wrapper')}>
                  {isChecked == index && <div className={cx('selection-item-radio-checked')}></div>}
                </div>
                <div className={cx('selection-item-value-select')}>{sel.value}</div>
              </Fragment>
            )}
            {sel.type == 'show' && (
              <Fragment>
                <div className={cx('selection-item-title')}>{sel.title}</div>
                <div className={cx('selection-item-value-show-wrapper')}>
                  <div className={cx('selection-item-value')}>{sel.value}</div>
                  {sel.children && sel.icon}
                </div>
              </Fragment>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={cx('video-setting-tippy')}>
      {current.hasHeader && (
        <div
          className={cx('selection-header')}
          onClick={() => {
            handleBack();
          }}
        >
          {current.icon}
          <div className={cx('selection-header-text')}>{current.header}</div>
        </div>
      )}
      {selectionList()}
    </div>
  );
}

export default VideoSettings;
