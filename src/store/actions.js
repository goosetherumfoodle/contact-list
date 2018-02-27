import * as actionTypes from './actionTypes'

export function setContacts(contacts) {
  return {
    type: actionTypes.SET_CONTACTS,
    payload: {contacts}
  }
}

export function addContact(contact) {
  return {
    type: actionTypes.ADD_CONTACT,
    payload: {contact}
  }
}

export function fetchInitialContacts() {
  return {type: actionTypes.FETCH_INITIAL_CONTACTS}
}

export function setNewContactName(name) {
  return {
    type: actionTypes.SET_NEW_CONTACT_NAME,
    payload: {name}
  }
}

export function setNewContactNumber(number) {
  return {
    type: actionTypes.SET_NEW_CONTACT_NUMBER,
    payload: {number}
  }
}

export function setNewContactContext(context) {
  return {
    type: actionTypes.SET_NEW_CONTACT_CONTEXT,
    payload: {context}
  }
}

export function submitNewContact(contact) {
  return {
    type: actionTypes.VALIDATE_AND_POST_NEW_CONTACT,
    payload: {contact}
  }
}

export function clearContactForm() {
  return {type: actionTypes.CLEAR_CONTACT_FORM}
}

export function setContactFormMissingFields(bool) {
  return {
    type: actionTypes.CONTACT_FORM_MISSING_FIELDS,
    payload: {bool}
  }
}

export function parseNumber() {return {type: actionTypes.PARSE_PHONE_NUMBER}}
