/**
 * @file
 * 
 * @copyright 2018 {@link https://limin.github.io Min Li}
 * 
 * @license Licensed under {@link https://www.apache.org/licenses/LICENSE-2.0.html Apache License 2.0}
 * 
 */


import React from 'react';
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'     
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import {applyMiddleware,compose } from 'redux'
import * as redux from 'redux'
import reducer from './reducers'                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
import App from './components/App'
import registerServiceWorker from './registerServiceWorker'

const loggerMiddleware = createLogger()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware,loggerMiddleware ))
const store=redux.createStore(reducer,{session:{}},enhancer)  

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'))  
registerServiceWorker()  
