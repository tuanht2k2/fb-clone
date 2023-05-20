import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

// const app = initializeApp({
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   databaseURL: process.env.DATA_BASE_URL,
//   projectId: process.env.PROJECT_ID,
//   storageBucket: process.env.STORAGE_BUCKET,
//   messagingSenderId: process.env.MESSAGING_SENDER_ID,
//   appId: process.env.APP_ID,
//   measurementId: process.env.MESUREMENT_ID,
// });

const app = initializeApp({
  apiKey: 'AIzaSyA5QU6oPBqFzfIPP1uJqSSgdiLFb4bY6r0',
  authDomain: 'login-test-app-f4811.firebaseapp.com',
  databaseURL: 'https://login-test-app-f4811-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'login-test-app-f4811',
  storageBucket: 'login-test-app-f4811.appspot.com',
  messagingSenderId: '993834593404',
  appId: '1:993834593404:web:9433825cab4fd2be3badf9',
  measurementId: 'G-N581T7PZCX',
});

export const auth = getAuth(app);
export const database = getDatabase(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);

export default app;
