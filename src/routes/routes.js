import { Home, SignIn, SignUp, AccountHome, Image, MessengerImage, UserInformation } from '../pages';
import { ProfileHome } from '../pages/ProfilePages';
import { OnlyHeader, Profile } from '../components/layouts';
import Account from '~/components/layouts/Account';

const routes = [
  { path: '/login', extendablePath: false, type: 'public', component: SignIn, layout: null },
  { path: '/register', extendablePath: false, type: 'public', component: SignUp, layout: null },
  { path: '/home', extendablePath: false, type: 'private', component: Home },
  { path: '/', extendablePath: false, type: 'private', component: Home },
  { path: '/users/:uid/home', extendablePath: false, type: 'private', component: AccountHome, layout: Account },
  { path: '/profile', extendablePath: 'home', type: 'private', component: ProfileHome, layout: Profile },
  { path: '/images/:imageId', extendablePath: false, type: 'public', component: Image, layout: null },
  {
    path: '/messengers/images/:messKey/:groupKey/:messageKey/files/:index',
    extendablePath: false,
    type: 'public',
    component: MessengerImage,
    layout: null,
  },
  { path: '/settings', extendablePath: false, type: 'private', component: UserInformation, layout: OnlyHeader },
];

export default routes;
