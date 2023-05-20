import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faBookmark,
  faEllipsis,
  faFlag,
  faPen,
  faRecycle,
  faSquareXmark,
  faThumbsUp,
} from '@fortawesome/free-solid-svg-icons';

import { onValue } from 'firebase/database';
import { getDb } from '../../../../../../utils/databaseTools/dbReadMethod';
import { setDb } from '../../../../../../utils/databaseTools/dbWriteMethod';
import getRef from '~/utils/databaseTools/dbGetRefMethod';
import removeDb from '../../../../../../utils/databaseTools/dbRemoveMethod';

import { getPeriod } from '~/utils/Time';
import images from '../../../../../../assets/images';
import CommentList from '../CommentList';
import style from './PostItem.module.scss';
import ActionPopUp from '../../../ActionPopUp';
import useTippyFullScreen from '../../../useTippyFullScreen';
import PostCreatePopUpControl from '../../../PostCreate/components/PostCreatePopUpControl';
import editPost from '~/utils/databaseTools/postMethods/editPost';
import soundEffect from '~/assets/soundEffects';
import { handleDeletePost } from '~/utils/databaseTools/postMethods';

const cx = classNames.bind(style);

function PostItem({ postId }) {
  const currentUser = useSelector((state) => state.user);
  const [postData, setPostData] = useState({});
  const [user, setUser] = useState({});
  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [postImage, setPostImage] = useState({});
  const userPath = currentUser.uid === user.uid ? `/profile/${user.uid}/home` : `/users/${postData.uid}/home`;

  const handleClickLike = () => {
    if (!isLiked) {
      likeSoundEffect();
      setDb(`posts/${postId}/reactions/${currentUser.uid}`, { uid: currentUser.uid, reactionType: 'like' });
      setDb(`users/${user.uid}/posts/${postId}/reactions/${currentUser.uid}`, {
        uid: currentUser.uid,
        reactionType: 'like',
      });
    } else {
      const postPath = `posts/${postId}/reactions/${currentUser.uid}`;
      const userPostPath = `users/${user.uid}/posts/${postId}/reactions/${currentUser.uid}`;
      removeDb(postPath);
      removeDb(userPostPath);
    }
  };

  const handleClickComment = () => {
    setIsCommentVisible((pre) => !pre);
  };

  const handleCheckUserReact = () => {
    const path = `posts/${postId}/reactions/${currentUser.uid}`;
    getDb(path).then((snapshot) => {
      setIsLiked(!!snapshot.val());
    });
  };

  const handleEditPost = (postCaption, mediaFile, handleResetComponent) => {
    editPost(postId, postData, postCaption, mediaFile, handleResetComponent);
  };

  const handleGetImage = () => {
    const imagePath = `/media/images/${postData.mediaId}`;

    getDb(imagePath).then((snapshot) => {
      setPostImage(snapshot.val() || {});
    });
  };

  const MENU_ACTION_POPUP = [
    {
      icon: <FontAwesomeIcon icon={faBookmark} />,
      title: 'Lưu bài viết',
      desc: 'Thêm vào danh sách mục đã lưu',
      onClick: '',
      isAuthRequired: false,
      popUp: useTippyFullScreen({
        header: 'Thêm vào danh sách mục đã lưu',
        children: null,
        tippyRender: <div></div>,
      }),
    },
    {
      isSeparator: true,
    },
    {
      icon: <FontAwesomeIcon icon={faPen} />,
      title: 'Chỉnh sửa bài viết',
      desc: '',
      onClick: '',
      isAuthRequired: true,
      popUp: useTippyFullScreen({
        header: 'Chỉnh sửa bài viết',
        children: null,
        tippyRender: (
          <PostCreatePopUpControl
            initPostCaption={postData.caption}
            initImagePreviewPath={postData.mediaDownloadURL}
            handleSubmit={handleEditPost}
          />
        ),
      }),
    },
    {
      icon: <FontAwesomeIcon icon={faBookmark} />,
      title: 'Chỉnh sửa đối tượng',
      desc: '',
      onClick: '',
      isAuthRequired: true,
    },
    {
      isSeparator: true,
      isAuthRequired: true,
    },
    {
      icon: <FontAwesomeIcon icon={faBell} />,
      title: 'Bật thông báo về bài viết này',
      desc: '',
      onClick: '',
      isAuthRequired: false,
    },
    {
      isSeparator: true,
    },
    {
      icon: <FontAwesomeIcon icon={faSquareXmark} />,
      title: 'Ẩn bài viết',
      desc: '',
      onClick: '',
      isAuthRequired: false,
    },
    {
      icon: <FontAwesomeIcon icon={faFlag} />,
      title: 'Báo cáo bài viết',
      desc: '',
      onClick: '',
      isAuthRequired: false,
    },
    {
      isSeparator: true,
    },
    {
      icon: <FontAwesomeIcon icon={faRecycle} />,
      title: 'Xóa bài viết',
      desc: '',
      onClick: '',
      isAuthRequired: true,
      popUp: useTippyFullScreen({
        header: 'Xóa bài viết',
        children: null,
        tippyRender: <div className={cx('popup-menu-item-text')}>Bạn có chắc muốn xóa bài viết này không?</div>,
        control: (handleHideFullScreenTippy) => {
          handleDeletePost(postId, postData).then(() => {
            handleHideFullScreenTippy();
          });
        },
      }),
    },
  ];

  const actionsRef = useRef([
    {
      icon: <FontAwesomeIcon icon={faThumbsUp} />,
      actionType: 'like',
      title: 'Thích',
      isActivatable: true,
    },
    {
      iconClassName: 'comment',
      actionType: 'comment',
      title: 'Bình luận',
      onClick: null,
    },
    {
      iconClassName: 'share',
      actionType: 'share',
      title: 'Chia sẻ',
      onClick: null,
    },
  ]);

  useEffect(() => {
    // get post and user data
    getDb(`posts/${postId}`)
      .then((snapshot) => {
        const data = snapshot.val();
        setPostData(data);
        return data;
      })
      .then((data) => {
        getDb(`users/${data.uid}`).then((snapshot) => {
          const userData = snapshot.val();
          setUser(userData);
        });
      });

    // listen for db change
    const postReactionsPath = `posts/${postId}`;
    const postReactionsRef = getRef(postReactionsPath);
    onValue(postReactionsRef, (snapshot) => {
      getDb(`posts/${postId}`).then((snapshot) => {
        const data = snapshot.val();
        setPostData(data);
      });
    });
  }, []);

  useEffect(() => {
    // check current user reacted or not
    handleCheckUserReact();
    handleGetImage();
  }, [currentUser, postData]);

  // sound effect
  const likeSoundEffect = () => {
    const audio = new Audio(soundEffect.like);
    audio.play();
  };

  return (
    <div className={cx('post-item-wrapper')}>
      <div className={cx('post-item-info-wrapper')}>
        <div className={cx('post-item-info-left')}>
          <Link to={userPath} className={cx('post-item-info-left-user-avatar-link')}>
            <img src={user.photoURL || images.defaultAvt} className={cx('post-item-info-left-user-avatar-img')} />
          </Link>
          <div className={cx('post-item-info-left-info')}>
            <div className={cx('post-item-info-left-user')}>
              <Link to={userPath} className={cx('post-item-info-left-info-user-name-link')}>
                {user.displayName}
              </Link>
              {postData.type !== 'regular' && (
                <span className={cx('post-item-info-left-post-type')}>
                  {postData.type === 'UPLOAD_AVATAR'
                    ? 'đã thay đổi ảnh đại diện của họ'
                    : postData.type === 'UPLOAD_COVER_IMAGE'
                    ? 'đã thay đổi ảnh bìa của họ'
                    : ''}
                </span>
              )}
            </div>
            <div className={cx('post-item-info-left-info-post-status')}>{getPeriod(postData.timeCreate)}</div>
          </div>
        </div>
        <ActionPopUp menu={MENU_ACTION_POPUP} isAuthencated={currentUser.uid === user.uid}>
          <div className={cx('post-item-info-right')}>
            <FontAwesomeIcon icon={faEllipsis} />
          </div>
        </ActionPopUp>
      </div>
      {postData.caption && <div className={cx('post-item-caption-wrapper')}>{postData.caption}</div>}
      {postData.mediaDownloadURL && (
        <Link to={`/images/${postData.mediaId}`} className={cx('post-item-media-link')}>
          <img className={cx('post-item-media-img')} src={postImage.mediaDownloadURL} />
        </Link>
      )}
      <div className={cx('post-item-interactive-wrapper')}>
        {(postData.reactions || postData.comments || postData.share) && (
          <div className={cx('post-item-interactive-quantity-wrapper')}>
            {postData.reactions && (
              <div className={cx('post-item-interactive-react-quantity')}>
                <div className={cx('post-item-interactive-react-quantity-icon-wrapper')}>
                  <img className={cx('post-item-interactive-react-quantity-icon')} src={images.emoLike} />
                </div>
                <div className={cx('post-item-interactive-react-quantity-text')}>
                  {!isLiked
                    ? Object.keys(postData.reactions).length
                    : Object.keys(postData.reactions).length > 1
                    ? `Bạn và ${Object.keys(postData.reactions).length - 1} người khác`
                    : 'Bạn'}
                </div>
              </div>
            )}
            {postData.comments && (
              <div className={cx('post-item-interactive-comment-share-quantity')}>{`${
                Object.keys(postData.comments).length
              } bình luận`}</div>
            )}
            {postData.share && (
              <div className={cx('post-item-interactive-comment-share-quantity')}>{`${Object.keys(
                postData.share,
              )} lượt chia sẻ`}</div>
            )}
          </div>
        )}
        <div className={cx('post-item-interactive-action-wrapper')}>
          {actionsRef.current.map((action, index) => (
            <div
              key={index}
              className={cx(
                'post-item-interactive-action-item',
                action.isActivatable && isLiked ? 'action-active' : null,
              )}
              onClick={() => {
                switch (action.actionType) {
                  case 'comment':
                    handleClickComment();
                    break;
                  case 'like':
                    handleClickLike();
                    break;
                  default:
                    return;
                }
              }}
            >
              <span
                className={cx(
                  'post-item-interactive-action-item-icon',
                  action.iconClassName ? action.iconClassName : null,
                )}
              >
                {action.icon && action.icon}
              </span>
              <span className={cx('post-item-interactive-action-item-title')}>{action.title}</span>
            </div>
          ))}
        </div>
      </div>
      {isCommentVisible && <CommentList postId={postId} postAuthorId={postData.uid} />}
    </div>
  );
}

export default PostItem;
