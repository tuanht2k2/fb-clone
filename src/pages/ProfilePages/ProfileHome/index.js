import classNames from 'classnames/bind';

import { ProfileHomeBottomComponent } from '~/components/smallComponents/ProfileComponents/ProfileBottomComponents';
import style from './ProfileHome.module.scss';

const cx = classNames.bind(style);

function ProfileHome() {
  return <ProfileHomeBottomComponent self />;
}

export default ProfileHome;
