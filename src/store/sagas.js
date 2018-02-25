import {call, put, takeEvery} from 'redux-saga/effects'
import "regenerator-runtime/runtime"

import * as actionTypes from './actionTypes'
import * as actions from './actions'
import {getContacts} from '../utils/api'

export function* fetchInitialContacts() {
  const {data} = yield call(getContacts)
  yield put(actions.setContacts(data))
}

export default function* rootSaga() {
  yield takeEvery(actionTypes.FETCH_INITIAL_CONTACTS, fetchInitialContacts)
}
