import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';

import style from './index.module.scss';

const cx = classNames.bind(style);

function HeaderMenuActive({ menu, rootPath }) {
  const location = useLocation();

  const getCurrentPath = (path) => {
    const split = path.split('/');
    const currentPath = split[split.length - 1];
    return '/' + currentPath;
  };

  const currentPath = getCurrentPath(location.pathname);

  return (
    <div className={cx('wrapper')}>
      {menu.map((item, index) => {
        const children = (
          <div className={cx('menu-item')}>
            {item.title && <div className={cx('menu-item-text')}>{item.title}</div>}
            {item.icon && <span className={cx('menu-item-icon')}>{item.icon}</span>}
          </div>
        );

        return (
          <Tippy
            key={index}
            content={item.tippyContent}
            visible={!item.tippyContent ? false : undefined}
            offset={[0, -1]}
            arrow={false}
            className={cx('custom-tippy')}
          >
            {item.to ? (
              <Link className={cx('menu-item-wrapper', currentPath == item.to ? 'active' : '')} to={rootPath + item.to}>
                {children}
              </Link>
            ) : (
              <div className={cx('menu-item-wrapper')}>{children}</div>
            )}
          </Tippy>
        );
      })}
    </div>
  );
}

export default HeaderMenuActive;
