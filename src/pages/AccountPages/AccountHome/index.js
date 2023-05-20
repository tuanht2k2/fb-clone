import classNames from 'classnames/bind';

import style from './AccountHome.module.scss';
import { ProfileHomeBottomComponent } from '~/components/smallComponents/ProfileComponents/ProfileBottomComponents';

const cx = classNames.bind(style);

function AccountHome({ otherUser }) {
  return <ProfileHomeBottomComponent otherUser={otherUser} />;
}

export default AccountHome;
