import * as actionTypes from './actionTypes'

export function setContacts(contacts) {
  return {
    type: actionTypes.SET_CONTACTS,
    payload: {contacts}
  }
}

export function fetchInitialContacts() {
  return {type: actionTypes.FETCH_INITIAL_CONTACTS}
}
