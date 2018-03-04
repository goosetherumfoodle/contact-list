import {call, put, takeEvery, all, select} from 'redux-saga/effects'
import 'regenerator-runtime/runtime'

import * as actionTypes from './actionTypes'
import * as actions from './actions'
import * as api from '../utils/api'

export function* fetchInitialContacts() {
  try {
    const {data} = yield call(api.getContacts)
    yield put(actions.setContacts(data))
  }
  catch({message}) {
    yield put(actions.setServerError(message))
  }
}

export function* validateAndPostNewContact() {
  yield put(actions.validateNewContactForm())
  const state = yield select(s => s.contact)
  const warning = state.getIn(['newContactForm', 'generalWarning'])
  if (warning === false) {
    try {
      const formattedNumber = state.getIn(['newContactForm', 'formattedNumber'])
      const name = state.getIn(['newContactForm', 'name'])
      const context = state.getIn(['newContactForm', 'context'])
      yield call(api.postContact, {
        id: formattedNumber,
        name,
        number: formattedNumber,
        context
      })
      yield put(actions.addContact({name, number: formattedNumber, context}))
      yield put(actions.clearContactForm())
    }
    catch({message}) {
      yield put(actions.setServerError(message))
    }
  }
}

export function* deleteContact({payload: {number}}) {
  yield put(actions.removeContact(number))
  try {
    yield call(api.deleteContact, {id: number})
  }
  catch({message}) {
    yield put(actions.setServerError(message))
  }
}

function* watchDeleteContact() {
  yield takeEvery(actionTypes.DELETE_CONTACT, deleteContact)
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
    watchValidateAndPostNewContact(),
    watchDeleteContact()
  ])
}
