import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import SmartTable from "./App";
import * as serviceWorker from './serviceWorker';
ReactDOM.render( /*#__PURE__*/React.createElement(React.StrictMode, null, /*#__PURE__*/React.createElement(SmartTable, null)), document.getElementById('root')); // If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

serviceWorker.unregister();