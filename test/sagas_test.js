import {fromJS} from 'immutable'
import {expect} from 'chai'
import {call, put, select} from 'redux-saga/effects'

import {fetchInitialContacts, validateAndPostNewContact} from '../src/store/sagas'
import * as actions from '../src/store/actions'
import {getContacts, postContact} from '../src/utils/api'

function getFormattedNumber(state) {return state.getIn(['newContactForm', 'formattedNumber'])}

describe('sagas', () => {
  context('fetchInitialContacts', () => {
    const saga = fetchInitialContacts()
    it('fetches contacts and dispatches setContacts', () => {
      expect(saga.next().value).to.deep.equal(call(getContacts))
    })
  })

  context('validateAndPostNewContact', () => {
    const stateWithFormatNumber = fromJS({newContactForm: {formattedNumber: '+12675558080'}})
    const name = 'Jez'
    const number = '(126) 755-8080'
    const context = 'party'
    const saga = validateAndPostNewContact({payload: {contact: {name, number, context}}})
    it('posts new contact and adds that contact', () => {
      expect(saga.next().value).to.deep.equal(put(actions.parseNumber()))
      expect(saga.next().value).to.deep.equal(select(getFormattedNumber))
      expect(saga.next().value).to.deep.equal(call(postContact, {id: number, name, number, context}))
      expect(saga.next().value).to.deep.equal(put(actions.addContact({name, number, context})))
      expect(saga.next().value).to.deep.equal(put(actions.clearContactForm()))
      expect(saga.next().done).to.equal(true)
    })
  })

    context('validateAndPostNewContact', () => {
    const name = 'Jez'
    const number = null
    const context = null
    const saga = validateAndPostNewContact({payload: {contact: {name, number, context}}})
    it('shows error and does not post data', () => {
      expect(saga.next().value).to.deep.equal(put(actions.setContactFormMissingFields(true)))
      expect(saga.next().done).to.equal(true)
    })
  })
})
