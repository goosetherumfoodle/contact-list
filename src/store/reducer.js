import {fromJS} from 'immutable'
import {compose} from 'lodash/fp'
import {isString} from 'lodash'

import * as actionTypes from './actionTypes'
import {tryFormat} from '../utils/phoneParser'
import {AsYouType} from 'libphonenumber-js'
import metadata from '../metadata.min.json'

const initialState = fromJS({
  contactFormMissingFields: false,
  newContactForm: {
    name: '',
    phoneNumber: '',
    prettyPrintPhoneNumber: '',
    context: '',
    countryCode: 'US',
    formattedNumber: '',
    invalidNumber: false,
    generalWarning: false
  },
  contacts: [],
  serverError: false
})

function isPresent(field) {
  return isString(field) && (field.length > 0)
}

function isNotPresent(field) {return !isPresent(field)}

const REQUIRED_FORM_FIELDS = ['name', 'context']

function checkForRequired(required) {
  return (accum, val, key) => {
    return accum && (!required.includes(key) || isPresent(val))
  }
}

function buildHasRequiredFields(required) {
  return (form) => {
    return form.reduce(checkForRequired(required), true)
  }
}

const hasRequiredFields = buildHasRequiredFields(REQUIRED_FORM_FIELDS)

function hasInvalidNumber(form) {
  const invalidFlag = form.get('invalidNumber')
  const fmtNumber = form.get('formattedNumber')
  return invalidFlag || isNotPresent(fmtNumber)
}

function duplicateNumber(state) {
  const newNumber = state.getIn(['newContactForm', 'formattedNumber'])
  const contacts = state.get('contacts')
  const found = contacts.find(contact => contact.get('number') === newNumber)
  return !!found
}

function validateForm(state) {
  const hasRequired = hasRequiredFields(state.get('newContactForm'))
  if (!hasRequired) {
    return 'Please fill in missing fields'
  } else if (hasInvalidNumber(state.get('newContactForm'))) {
    return 'Please check that the number you have entered is valid'
  } else if (duplicateNumber(state)) {
    return 'We already have a contact with this number'
  }
  return false
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case actionTypes.SET_CONTACTS:
    return state.set('contacts', fromJS(action.payload.contacts))
  case actionTypes.ADD_CONTACT:
    return state.update('contacts', contacts => contacts.push(fromJS(action.payload.contact)))
  case actionTypes.REMOVE_CONTACT:
    return state.update('contacts', contacts => contacts.filterNot(contact => contact.get('number') === action.payload.number))
  case actionTypes.SET_NEW_CONTACT_NAME:
    return state.setIn(['newContactForm', 'name'], action.payload.name)
  case actionTypes.SET_NEW_CONTACT_CONTEXT:
    return state.setIn(['newContactForm', 'context'], action.payload.context)
  case actionTypes.SET_NEW_CONTACT_NUMBER:
    return setPhoneMetaFields(
      state.setIn(['newContactForm','phoneNumber'], action.payload.number)
    )
  case actionTypes.SET_NEW_CONTACT_COUNTRY_CODE:
    return setPhoneMetaFields(
      state.setIn(['newContactForm', 'countryCode'], action.payload.code)
    )
  case actionTypes.CONTACT_FORM_MISSING_FIELDS:
    return state.set('contactFormMissingFields', action.payload.bool)
  case actionTypes.CLEAR_CONTACT_FORM:
    return state.set('contactFormMissingFields', false)
      .set('newContactForm', initialState.get('newContactForm'))
  case actionTypes.SET_GENERAL_WARNING:
    return state.setIn(['newContactForm', 'generalWarning'], action.payload.message)
  case actionTypes.VALIDATE_NEW_CONTACT_FORM: {
    const warningMsg = validateForm(state)
    return state.setIn(['newContactForm', 'generalWarning'], warningMsg)
  }
  case actionTypes.SET_SERVER_ERROR:
    return state.set('serverError', `Please reload the page. We encounted the following error connecting to the server: ${JSON.stringify(action.payload.message)}`)
  }
  return state
}

const setPhoneMetaFields = compose([setNumberValidity, setFormattedNumber, setPrettyPrint])

function setPrettyPrint(state) {
  const cc     = state.getIn(['newContactForm', 'countryCode'])
  const number = state.getIn(['newContactForm', 'phoneNumber'])
  const pretty = new AsYouType(cc, metadata).input(number) // TODO: extract this function !!!!!!!!!!!!!!!!!!!!!
  return(state.setIn(['newContactForm', 'prettyPrintPhoneNumber'], pretty))
}

function setFormattedNumber(state) {
  const formatted = tryFormat({
    number: state.getIn(['newContactForm', 'phoneNumber']),
    countryCode: state.getIn(['newContactForm', 'countryCode'])
  })
  return state.setIn(['newContactForm', 'formattedNumber'], formatted)
}

function setNumberValidity(state) {
  const formatted = state.getIn(['newContactForm', 'formattedNumber'])
  return state.setIn(['newContactForm', 'invalidNumber'], !formatted)
}
