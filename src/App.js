import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from './routes';
import { auth } from './firebase';

import Default from './components/layouts/Default';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './actions/user';
import { getDb } from './utils/databaseTools/dbReadMethod';

function App() {
  const user = useSelector((state) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const dispatch = useDispatch();

  const handleDispatchUserData = (uid) => {
    getDb(`users/${uid}`).then((snapshot) => {
      const userData = snapshot.val() || {};
      const updateUserAction = loadUser(userData);
      dispatch(updateUserAction);
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        handleDispatchUserData(user.uid);
        setIsLoggedIn(true);
      }
    });
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.component;
            let Layout = Default;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = null;
            }
            const extendablePath = !!route.extendablePath ? `/${user.uid}/${route.extendablePath}` : '';

            return !isLoggedIn && route.type == 'private' ? (
              <Route key={index} path={route.path + extendablePath} element={<Navigate to={'/login'} />} />
            ) : (
              <Route
                key={index}
                path={route.path + extendablePath}
                element={
                  Layout ? (
                    <Layout>
                      <Page />
                    </Layout>
                  ) : (
                    <Page />
                  )
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
