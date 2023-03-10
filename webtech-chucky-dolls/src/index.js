import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import './style/index.css';
import App from './components/App';

import store from './stores/store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
