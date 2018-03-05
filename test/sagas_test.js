import {fromJS} from 'immutable'
import {expect} from 'chai'
import {call, put, select} from 'redux-saga/effects'

import {fetchInitialContacts, validateAndPostNewContact, deleteContact} from '../src/store/sagas'
import * as actions from '../src/store/actions'
import * as api from '../src/utils/api'

function getFormattedNumber(state) {return state.getIn(['newContactForm', 'formattedNumber'])}

describe('sagas', () => {
  describe('fetchInitialContacts', () => {
    context('with successful call', () => {
    const saga = fetchInitialContacts()
      it('fetches contacts and dispatches setContacts', () => {
        expect(saga.next().value).to.deep.equal(call(api.getContacts))
        expect(saga.next({data: 'response'}).value).to.deep.equal(put(actions.setContacts('response')))
        expect(saga.next().done).to.equal(true)
      })
    })

    context('with failed call', () => {
      const saga = fetchInitialContacts()
      const message = 'error msg'
      it('sets server error message', () => {
        expect(saga.next().value).to.deep.equal(call(api.getContacts))
        expect(saga.throw({message}).value).to.deep.equal(put(actions.setServerError(message)))
        expect(saga.next().done).to.equal(true)
      })
    })
  })

  describe('validateAndPostNewContact', () => {
    context('with a valid fields', () => {
      const state = fromJS({
        newContactForm: {
          name: 'Mark Corrigan',
          context: 'Bank',
          countryCode: 'US',
          phoneNumber: '9876543210',
          prettyPrintPhoneNumber: '(987) 654-3210',
          formattedNumber: '+19876543210',
          invalidNumber: false,
          generalWarning: false
        }
      })
      const formattedNumber = '+19876543210'
      const name = 'Mark Corrigan'
      const context = 'Bank'
      const saga = validateAndPostNewContact()
      it('posts new contact and adds that contact', () => {
        expect(saga.next().value).to.deep.equal(put(actions.validateNewContactForm()))
        expect(saga.next().value).to.be.an('object')
        expect(saga.next(state).value).to.deep.equal(call(api.postContact, {
          id: formattedNumber,
          name,
          number: formattedNumber,
          context
        }))
        expect(saga.next().value).to.deep.equal(put(actions.addContact({name, number: formattedNumber, context})))
        expect(saga.next().value).to.deep.equal(put(actions.clearContactForm()))
        expect(saga.next().done).to.equal(true)
      })

    })

    context('with invalid fields', () => {
      const state = fromJS({
        newContactForm: {
          name: 'Mark Corrigan',
          context: 'Bank',
          countryCode: 'US',
          phoneNumber: '987654',
          prettyPrintPhoneNumber: '(987) 654',
          formattedNumber: '',
          invalidNumber: true,
          generalWarning: 'warning message'
        }
      })
      const formattedNumber = '+19876543210'
      const name = 'Mark Corrigan'
      const context = 'Bank'
      const saga = validateAndPostNewContact()
      it('posts new contact and adds that contact', () => {
        expect(saga.next().value).to.deep.equal(put(actions.validateNewContactForm()))
        expect(saga.next().value).to.be.an('object')
        expect(saga.next(state).done).to.equal(true)
      })

    })

    context('with a failed call', () => {
      const state = fromJS({
        newContactForm: {
          name: 'Mark Corrigan',
          context: 'Bank',
          countryCode: 'US',
          phoneNumber: '9876543210',
          prettyPrintPhoneNumber: '(987) 654-3210',
          formattedNumber: '+19876543210',
          invalidNumber: false,
          generalWarning: false
        }
      })
      const formattedNumber = '+19876543210'
      const name = 'Mark Corrigan'
      const context = 'Bank'
      const message = 'dang'
      const saga = validateAndPostNewContact()
      it('sets server error message', () => {
        expect(saga.next().value).to.deep.equal(put(actions.validateNewContactForm()))
        expect(saga.next().value).to.be.an('object')
        expect(saga.next(state).value).to.deep.equal(call(api.postContact, {
          id: formattedNumber,
          name,
          number: formattedNumber,
          context
        }))
        expect(saga.throw({message}).value).to.deep.equal(put(actions.setServerError(message)))
        expect(saga.next().done).to.equal(true)
      })

    })
  })

  describe('deleteContact', () => {
    const number = '555'
    context('with successful call', () => {
      const saga = deleteContact({payload: {number}})
      it('removes contact from data and posts deletion', () => {
        expect(saga.next().value).to.deep.equal(put(actions.removeContact(number)))
        expect(saga.next().value).to.deep.equal(call(api.deleteContact, {id: number}))
        expect(saga.next().done).to.equal(true)
      })
    })

    context('with failed call', () => {
      const saga = deleteContact({payload: {number}})
      const message = 'darn'
      it('sets server error message', () => {
        expect(saga.next().value).to.deep.equal(put(actions.removeContact(number)))
        expect(saga.next().value).to.deep.equal(call(api.deleteContact, {id: number}))
        expect(saga.throw({message}).value).to.deep.equal(put(actions.setServerError('darn')))
        expect(saga.next().done).to.equal(true)
      })
    })
  })
})
