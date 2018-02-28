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

function isNotPresent(field) {
  return !isString(field) || (field.length < 1)
}

const REQUIRED_FORM_FIELDS = ['name', 'context', 'formattedNumber']

function checkFieldPresence(fields) {
  return (present, val, key) => {
    if (fields.includes(key) && isNotPresent(key)) {return false}
    return true
  }
}

function buildHasMissingFields(fields) {
  return (form) => {
    console.log(`field: ${form.get(fields[0])}`)
    console.log(`first check: ${!!form.get(fields[0])}`)
    if (!!form.get(fields[0])) {return false}
    console.log(`second check: ${form.reduce(checkFieldPresence(fields), true)}`)
    return form.reduce(checkFieldPresence(fields), true)
  }
}

const hasMissingFields = buildHasMissingFields(REQUIRED_FORM_FIELDS)

function contactAlreadyStored(state) {
  const newNumber = state.getIn(['newContactForm', 'formattedNumber'])
  const contacts = state.get('contacts')
  const found = contacts.find(contact => contact.get('number') === newNumber)
  if (!!found) {return true}
  return false
}

export function* validateAndPostNewContact() {
  const state = yield select(s => s.contact)
  if (hasMissingFields(state.get('newContactForm'))) {
     console.log(`in saga if-answer`)
    yield put(actions.setContactFormMissingFields(true))
  } else if (contactAlreadyStored(state)) {
    yield put(actions.setGeneralWarning('We have already stored a contact with this number'))
  } else {
    console.log(`in saga if-else`)
    const formattedNumber = state.getIn(['newContactForm', 'formattedNumber'])
    const name = state.getIn(['newContactForm', 'name'])
    const context = state.getIn(['newContactForm', 'context'])
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
