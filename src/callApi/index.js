import axios from 'axios';

const instance = axios.create({
  baseURL: `https://login-test-app-f4811-default-rtdb.asia-southeast1.firebasedatabase.app/`,
});

export default instance;
