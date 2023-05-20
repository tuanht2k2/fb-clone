import { ref } from 'firebase/database';
import { database } from '../../firebase';

const getRef = (path) => {
  const nodeRef = ref(database, path);
  return nodeRef;
};

export default getRef;
