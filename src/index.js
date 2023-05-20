import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';

import './index.css';
import App from './App';
import GlobalStyles from './components/GlobalStyles';
import { Provider } from 'react-redux';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <GlobalStyles>
      <App />
    </GlobalStyles>
  </Provider>,
  // </React.StrictMode>,
);

reportWebVitals();
