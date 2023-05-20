import { get, ref, child } from 'firebase/database';
import { database } from '../../firebase';

export const getDb = (path) => {
  const dbRef = ref(database);
  return get(child(dbRef, path));
};
