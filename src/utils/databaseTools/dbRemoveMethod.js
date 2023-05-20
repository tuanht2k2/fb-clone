import { remove, ref } from 'firebase/database';
import { database } from '../../firebase';

const removeDb = (path) => {
  const dataRef = ref(database, path);
  return remove(dataRef);
};

export default removeDb;
