import { updateUser } from '../actions/user';
import { database } from '../firebase';
import { update, ref } from 'firebase/database';

const updateUserProfile = (uid, data, dispatch) => {
  update(ref(database, `users/${uid}`), data).then((snapshot) => {
    const updateUserAction = updateUser(data);
    dispatch(updateUserAction);
  });
};

export default updateUserProfile;
