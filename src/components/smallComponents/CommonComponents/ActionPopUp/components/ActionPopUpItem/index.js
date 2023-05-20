import classNames from 'classnames/bind';

import style from './ActionPopUpItem.module.scss';
import { Fragment } from 'react';

const cx = classNames.bind(style);

function ActionPopUpItem({ item }) {
  return (
    <Fragment>
      <div className={cx('item-wrapper')} onClick={item.popUp?.handleHideFullScreenTippy || null}>
        <div className={cx('item-icon-wrapper')}>{item.icon}</div>
        <div className={cx('item-detail')}>
          <div className={cx('item-title')}>{item.title}</div>
          {item.desc && <div className={cx('item-desc')}>{item.desc}</div>}
        </div>
      </div>
      {item.popUp?.render}
    </Fragment>
  );
}

export default ActionPopUpItem;
