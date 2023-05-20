import { push, ref, set, update } from 'firebase/database';
import { database } from '../../firebase';

export const pushDb = (path, data) => {
  return push(ref(database, path), data);
};

export const setDb = (path, data) => {
  return set(ref(database, path), data);
};

export const updateDb = (path, data) => {
  return update(ref(database, path), data);
};
