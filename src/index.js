import React from 'react';
import ReactDOM from 'react-dom';
import App from './jsx/containers/App.jsx';
import { Provider } from "react-redux";
import store from "./store";

import { library } from '@fortawesome/fontawesome-svg-core';

import { fal } from '@fortawesome/pro-light-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';

library.add(fal, far);

const app = document.getElementById('root');
ReactDOM.render(<Provider store={store}>
  <App />
</Provider>, app);
