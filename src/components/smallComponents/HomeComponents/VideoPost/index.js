import { Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import Tippy from '@tippyjs/react';
import { followCursor } from 'tippy.js';
import 'tippy.js/themes/light.css';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import VideoSettings from './VideoSettings';
import style from './VideoPost.module.scss';

const cx = classNames.bind(style);

function VideoPost({ postId, source }) {
  const [isPlayed, setIsPlayed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [timeOnHover, setTimeOnHover] = useState(0);
  const [actionTitle, setActionTitle] = useState('Tạm dừng');
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [volumeValue, setVolumeValue] = useState(0.6);

  const videoRef = useRef();
  const videoMainPlayBtn = useRef();
  const videoPlayPauseBtn = useRef();
  const timeLineElement = useRef();
  const currentTimeLineElement = useRef();
  const wrapperRef = useRef();
  const inputVolumeRangeElement = useRef();

  // varibles of handleSeek
  const cursorPosition = useRef(0);
  const left = useRef(0);
  const distanceOnHover = useRef(0);
  const timeLineWidth = useRef(0);
  const distanceOnHoverPercent = useRef(0);

  // static varibles

  const handleRedirect = (e) => {
    if ((!isPlayed || !isPlaying) && !e.target.closest(`.${cx('video-controls')}`)) {
      setIsPlaying(true);
      setIsPlayed(true);
      videoRef.current.play();
      e.preventDefault();
    } else if (e.target.closest(`.${cx('video-controls')}`)) {
      e.preventDefault();
    }
  };

  const handlePlayPause = () => {
    if (isEnded) {
      setIsEnded(false);
      videoRef.current.play();
      setActionTitle('Tạm dừng');
      setIsPlaying((isPlaying) => !isPlaying);
    } else if (isPlaying) {
      videoRef.current.pause();
      setActionTitle('Phát');
      setIsPlaying((isPlaying) => !isPlaying);
    } else {
      videoRef.current.play();
      setActionTitle('Tạm dừng');
      setIsPlaying((isPlaying) => !isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsEnded(true);
    setIsPlaying(false);
    setActionTitle('Phát lại');
  };

  const TimeFormat = (time) => {
    let seconds = Math.floor(time % 60),
      minutes = Math.floor(time / 60) % 60,
      hours = Math.floor(time / 3600);

    seconds = seconds >= 10 ? seconds : `0${seconds}`;
    minutes = minutes >= 10 ? minutes : `0${minutes}`;
    hours = hours >= 10 ? hours : `0${hours}`;

    if (hours == 0) {
      return `${minutes}:${seconds}`;
    } else {
      return `${hours}:${minutes}:${seconds}`;
    }
  };

  const handleVideoPlaying = () => {
    const timeLineProcess = videoRef.current.currentTime / videoRef.current.duration;
    const timeLineProcessWidth = timeLineElement.current.offsetWidth * timeLineProcess;
    currentTimeLineElement.current.style.width = timeLineProcessWidth > 5 ? `${timeLineProcessWidth}px` : '5px';
    setVideoCurrentTime(videoRef.current.currentTime);
  };

  const handleTimeLineMouseMove = (e) => {
    // calculate time on mouseover
    cursorPosition.current = e.clientX;
    left.current = timeLineElement.current.getBoundingClientRect().left;
    distanceOnHover.current = cursorPosition.current - left.current < 0 ? 0 : cursorPosition.current - left.current;
    timeLineWidth.current = timeLineElement.current.offsetWidth;
    distanceOnHoverPercent.current = distanceOnHover.current / timeLineWidth.current;
    setTimeOnHover(distanceOnHoverPercent.current * videoRef.current.duration);
  };

  const handleSeek = () => {
    videoRef.current.currentTime = timeOnHover;
  };

  const handleRequestFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      wrapperRef.current.requestFullscreen();
    }
  };

  const handleRequestPictureInPicture = () => {
    videoRef.current.requestPictureInPicture();
  };

  const handleChangeVolume = () => {
    setVolumeValue(inputVolumeRangeElement.current.value);
    videoRef.current.volume = inputVolumeRangeElement.current.value;
  };

  const handleOnOffSpeaker = () => {
    if (volumeValue > 0) {
      setVolumeValue(0);
    } else {
      setVolumeValue(0.6);
    }
  };

  return (
    <Link
      className={cx('video-wrapper')}
      to={`/watch/${postId}`}
      onClick={(e) => {
        handleRedirect(e);
      }}
      ref={wrapperRef}
      draggable={false}
    >
      <video
        className={cx('item-video')}
        preload="metadata"
        ref={videoRef}
        onTimeUpdate={() => {
          handleVideoPlaying();
        }}
        onEnded={() => {
          handleVideoEnded();
        }}
      >
        <source src={source} type="video/mp4" />
        <source src={source} type="video/ogg" />
      </video>
      {!isPlayed && (
        <div className={cx('video-main-play-button-wrapper')} ref={videoMainPlayBtn}>
          <FontAwesomeIcon icon={faPlay} className={cx('video-main-play-button')} />
        </div>
      )}
      {isPlayed && (
        <div className={cx('video-controls')}>
          <Tippy content={actionTitle} placement="top-start" arrow={false} hideOnClick={true}>
            <div
              className={cx('video-controls-item', 'video-controls-item-play')}
              ref={videoPlayPauseBtn}
              onClick={() => {
                handlePlayPause();
              }}
            >
              {!isPlaying && !isEnded && <span className={cx('icon-bgr-img', 'icon-bgr-img-play', 'visible')}></span>}
              {isPlaying && !isEnded && <span className={cx('icon-bgr-img', 'icon-bgr-img-pause')}></span>}
              {isEnded && <span className={cx('icon-bgr-img', 'icon-bgr-img-replay')}></span>}
            </div>
          </Tippy>

          <div className={cx('video-controls-item', 'time-line-wrapper')}>
            <div className={cx('time-line-text')}>
              <span className={cx('time-current')}>{TimeFormat(videoCurrentTime)}</span>
              <span className={cx('time-separator')}>/</span>
              <span className={cx('time-total')}>{TimeFormat(videoRef.current.duration)}</span>
            </div>
            <Tippy
              arrow={false}
              content={TimeFormat(timeOnHover)}
              theme="material"
              offset={[0, 0]}
              animation="fade"
              followCursor={'horizontal'}
              plugins={[followCursor]}
              hideOnClick={false}
              moveTransition={5000}
            >
              <div
                className={cx('seek-time-line-wrapper')}
                onMouseMove={(e) => {
                  handleTimeLineMouseMove(e);
                }}
                onClick={(e) => {
                  handleSeek();
                }}
              >
                <div className={cx('time-line')} ref={timeLineElement}>
                  <div className={cx('time-line-main')} ref={currentTimeLineElement}>
                    <div className={cx('time-line-item', 'current-time')}>
                      <div className={cx('time-line-item', 'seek-circle')}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Tippy>
          </div>
          <div className={cx('video-controls-item-right')}>
            <HeadlessTippy
              trigger="click"
              hideOnClick={true}
              placement="top-end"
              interactive
              render={(attrs) => <VideoSettings key={postId} {...attrs} video={videoRef.current} />}
            >
              <Tippy content="Cài đặt" hideOnClick={true}>
                <div className={cx('video-controls-item', 'icon-bgr-img', 'icon-bgr-img-setting')}></div>
              </Tippy>
            </HeadlessTippy>
            <Tippy content="Mở rộng">
              <div
                className={cx('video-controls-item', 'icon-bgr-img', 'icon-bgr-img-expand')}
                onClick={() => {
                  handleRequestFullScreen();
                }}
              ></div>
            </Tippy>
            <Tippy content="Xem tiếp khi lướt Facebook">
              <div
                className={cx('video-controls-item', 'icon-bgr-img', 'icon-bgr-img-miniwatch')}
                onClick={() => {
                  handleRequestPictureInPicture();
                }}
              ></div>
            </Tippy>
            <HeadlessTippy
              interactive
              placement="top"
              zIndex={100}
              offset={[10, 30]}
              render={(attrs) => (
                <div className={cx('volume-range-wrapper')}>
                  <input
                    type="range"
                    className={cx('volume-range')}
                    ref={inputVolumeRangeElement}
                    value={volumeValue}
                    min={0}
                    max={1}
                    step={0.1}
                    onChange={() => {
                      handleChangeVolume();
                    }}
                  />
                </div>
              )}
            >
              <div
                className={cx('video-controls-item')}
                onClick={() => {
                  handleOnOffSpeaker();
                }}
              >
                {volumeValue > 0 && <div className={cx('icon-bgr-img', 'icon-bgr-img-speaker-on')}></div>}
                {volumeValue == 0 && <div className={cx('icon-bgr-img', 'icon-bgr-img-speaker-off')}></div>}
              </div>
            </HeadlessTippy>
          </div>
        </div>
      )}
    </Link>
  );
}

export default VideoPost;
