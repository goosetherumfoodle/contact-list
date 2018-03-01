import {call, put, takeEvery, all, select} from 'redux-saga/effects'
import 'regenerator-runtime/runtime'
import {isString} from 'lodash'

import * as actionTypes from './actionTypes'
import * as actions from './actions'
import {getContacts, postContact} from '../utils/api'

export function* fetchInitialContacts() {
  const {data} = yield call(getContacts)
  yield put(actions.setContacts(data))
}

export function* validateAndPostNewContact() {
  const state = yield select(s => s.contact)
  yield put(actions.validateNewContactForm())
  const warning = state.getIn(['newContactForm', 'generalWarning'])
  if (warning === false) {
    const formattedNumber = state.getIn(['newContactForm', 'formattedNumber'])
    const name = state.getIn(['newContactForm', 'name'])
    const context = state.getIn(['newContactForm', 'context'])
    yield call(postContact, {
      id: formattedNumber,
      name,
      number: formattedNumber,
      context
    })
    yield put(actions.addContact({name, number: formattedNumber, context}))
    yield put(actions.clearContactForm())
  }
}

function* watchFetchInitialContacts() {
  yield takeEvery(actionTypes.FETCH_INITIAL_CONTACTS, fetchInitialContacts)
}

function* watchValidateAndPostNewContact() {
  yield takeEvery(actionTypes.VALIDATE_AND_POST_NEW_CONTACT, validateAndPostNewContact)
}

export default function* rootSaga() {
  yield all([
    watchFetchInitialContacts(),
    watchValidateAndPostNewContact()
  ])
}
