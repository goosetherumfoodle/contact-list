import {fromJS} from 'immutable'
import _ from 'lodash/fp'

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
    invalidNumber: false
  },
  contacts: []
})

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case actionTypes.SET_CONTACTS:
    return state.set('contacts', fromJS(action.payload.contacts))
  case actionTypes.ADD_CONTACT:
    return state.update('contacts', contacts => contacts.push(fromJS(action.payload.contact)))
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
  default:
    return state
  }
}

const setPhoneMetaFields = _.compose([setNumberValidity, setFormattedNumber, setPrettyPrint])

function setPrettyPrint(state) {
  const cc     = state.getIn(['newContactForm', 'countryCode'])
  const number = state.getIn(['newContactForm', 'phoneNumber'])
  const pretty = new AsYouType(cc, metadata).input(number) // TODO: extract this function
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
