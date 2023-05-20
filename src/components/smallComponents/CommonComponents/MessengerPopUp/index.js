import classNames from 'classnames/bind';

import HeadlessTippy from '@tippyjs/react/headless';
import style from './MessengerPopUp.module.scss';
import MaximumMessPopUp from './components/MaximumMessPopUp';
import MinimizeMessPopUp from './components/MinimizeMessPopUp';

const cx = classNames.bind(style);

function MessengerPopUp({ messengerPopUpList, children }) {
  const showMessengerList = messengerPopUpList.show;
  const hideMessengerList = messengerPopUpList.hide;

  const combineList = { ...showMessengerList, ...hideMessengerList };

  return (
    <HeadlessTippy
      visible
      interactive
      placement="top"
      zIndex={99}
      offset={[
        Object.keys(showMessengerList).length > 0 && Object.keys(hideMessengerList).length > 0
          ? -200
          : Object.keys(hideMessengerList).length > 0
          ? -60
          : -200,
        -2,
      ]}
      render={() => (
        <div className={cx('messenger-pop-up-wrapper')}>
          <div className={cx('messenger-pop-up-maximum-wrapper')}>
            {Object.keys(showMessengerList).map((mess, index) =>
              index < 2 && showMessengerList[mess] === 'SHOW' ? (
                <MaximumMessPopUp key={`MessPopUp${mess}`} messKey={mess} />
              ) : null,
            )}
          </div>
          <div className={cx('messenger-pop-up-minimize-wrapper')}>
            {Object.keys(combineList).map((mess, index) =>
              index >= 2 || combineList[mess] === 'HIDE' ? (
                <MinimizeMessPopUp key={`MessPopUp${mess}`} messKey={mess} />
              ) : null,
            )}
          </div>
        </div>
      )}
    >
      {children}
    </HeadlessTippy>
  );
}

export default MessengerPopUp;
