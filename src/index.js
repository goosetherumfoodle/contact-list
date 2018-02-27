import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {createStore, compose, applyMiddleware, combineReducers} from 'redux'
import { reducer as sematable } from 'sematable'
import createSagaMiddleware from 'redux-saga'

import registerServiceWorker from './registerServiceWorker'
import './index.css'
import '../node_modules/react-select/dist/react-select.css' // TODO FIX THIS
import App from './App'
import contact from './store/reducer'
import rootSaga from './store/sagas'

const composedReducer = combineReducers({
  sematable,
  contact
})

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  composedReducer,
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
)
sagaMiddleware.run(rootSaga)

ReactDOM.render(<Provider store={store}>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</Provider>,
document.getElementById('root'))
registerServiceWorker()
