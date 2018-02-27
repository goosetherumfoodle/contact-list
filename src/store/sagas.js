import {call, put, takeEvery, all, select} from 'redux-saga/effects'
import 'regenerator-runtime/runtime'

import * as actionTypes from './actionTypes'
import * as actions from './actions'
import {getContacts, postContact} from '../utils/api'

export function* fetchInitialContacts() {
  const {data} = yield call(getContacts)
  yield put(actions.setContacts(data))
}

function getFormattedNumber(state) {return state.contact.getIn(['newContactForm', 'formattedNumber'])}

export function* validateAndPostNewContact({payload: {contact: {name, number, context}}}) {
  console.log(`name: ${name}`)
  console.log(`number: ${number}`)
  console.log(`context: ${context}`)
  if (!!!name || !!!number || !!!context) {
     console.log(`in saga if-answer`)
    yield put(actions.setContactFormMissingFields(true))
  } else {
    console.log(`in saga if-else`)
    yield put(actions.parseNumber())
    const formattedNumber = yield select(getFormattedNumber)
    console.log(`formattedNumber: ${formattedNumber}`)
    yield call(postContact, {
      id: formattedNumber,
      name,
      number: formattedNumber,
      context
    })
    console.log(`after postContact`)
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
