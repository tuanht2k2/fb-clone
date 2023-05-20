import classNames from 'classnames/bind';
import style from './TippyFullScreenConfirmBoxBottom.scss';

const cx = classNames.bind(style);

function TippyFullScreenConfirmBoxBottom({ text, handleSubmit }) {
  return (
    <div className={cx('wrapper')}>
      <span className={cx('confirm-box-text')}>{text}</span>
      <span className={cx('confirm-box-control')}>
        {/* <button
          className={cx('control-btn', 'normal')}
          onClick={() => {
            handleCancel();
          }}
        >
          Hủy
        </button> */}
        <button
          className={cx('control-btn', 'filled')}
          onClick={() => {
            handleSubmit();
          }}
        >
          Xác nhận
        </button>
      </span>
    </div>
  );
}

export default TippyFullScreenConfirmBoxBottom;
