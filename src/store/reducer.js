import {fromJS} from 'immutable'

import * as actionTypes from './actionTypes'
import {tryFormat} from '../utils/phoneParser'

const initialState = fromJS({
  contactFormMissingFields: false,
  newContactForm: {
    name: '',
    phoneNumber: '',
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
    return state.setIn(['newContactForm', 'phoneNumber'], action.payload.number)
  case actionTypes.CONTACT_FORM_MISSING_FIELDS:
    return state.set('contactFormMissingFields', action.payload.bool)
  case actionTypes.CLEAR_CONTACT_FORM:
    return state.set('contactFormMissingFields', false)
                .set('newContactForm', initialState.get('newContactForm'))
  case actionTypes.PARSE_PHONE_NUMBER:
    const formatAttempt = tryFormat({
      number: state.getIn(['newContactForm', 'phoneNumber']),
      countryCode: state.getIn(['newContactForm', 'countryCode'])
    })
    console.log(`REDUCER: formatAttempt: ${JSON.stringify(formatAttempt)}`)
    if (!!formatAttempt) {
      return state.setIn(['newContactForm', 'formattedNumber'], formatAttempt)
                  .setIn(['newContactForm', 'invalidNumber'], false)
    } else {
      return state.setIn(['newContactForm', 'invalidNumber'], true)
    }
  default:
    return state
  }
}
