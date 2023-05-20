import HeadlessTippy from '@tippyjs/react/headless';
import classNames from 'classnames/bind';

import style from './ActionPopUp.module.scss';
import ActionPopUpItem from './components/ActionPopUpItem';

const cx = classNames.bind(style);

function ActionPopUp({ menu, children, isAuthencated }) {
  return (
    <HeadlessTippy
      placement="left-start"
      trigger="click"
      interactive
      render={() => (
        <div className={cx('wrapper')}>
          {menu.map((item, index) =>
            item.isAuthRequired && !isAuthencated ? null : item.isSeparator ? (
              <div key={index} className={cx('item-separator')}></div>
            ) : (
              <ActionPopUpItem key={index} item={item} />
            ),
          )}
        </div>
      )}
    >
      {children}
    </HeadlessTippy>
  );
}

export default ActionPopUp;
