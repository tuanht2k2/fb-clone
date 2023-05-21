import classNames from 'classnames/bind';

import style from './ModifyTab.module.scss';

const cx = classNames.bind(style);

function ModifyTab({ chilren, header, submitFn, cancelFn }) {
  return (
    <div className={cx('modify-tab-wrapper')}>
      <div className={cx('modify-tab-header')}>{header}</div>
      <div className={cx('modify-tab-main')}>{chilren}</div>
      <div className={cx('modify-tab-control')}>
        <button
          className={cx('control-btn', 'cancel-btn')}
          onClick={() => {
            cancelFn();
          }}
        >
          Hủy
        </button>
        <button
          className={cx('control-btn', 'submit-btn')}
          onClick={() => {
            submitFn();
          }}
        >
          Lưu
        </button>
      </div>
    </div>
  );
}

export default ModifyTab;
