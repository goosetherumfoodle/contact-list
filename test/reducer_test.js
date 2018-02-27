import {fromJS} from 'immutable'
import {expect} from 'chai'

import reducer from '../src/store/reducer'
import * as actions from '../src/store/actions'

describe('reducer', () => {
  it('sets contacts', () => {
    const contacts = [{
      context: 'work',
      name: 'Bob Barker',
      number: '+12675558080'
    }, {
      context: 'personal',
      name: 'Sue S. Sauce',
      number: '+16465558080'
    }]
    const initialState = fromJS({contacts: []})
    const action = actions.setContacts(contacts)

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        contacts: [{
          context: 'work',
          name: 'Bob Barker',
          number: '+12675558080'
        }, {
          context: 'personal',
          name: 'Sue S. Sauce',
          number: '+16465558080'
        }]
      })
    )
  })

  it('sets new contact name', () => {
    const initialState = fromJS({
      newContactForm: {
        name: null,
        phoneNumber: null,
        context: null
      }
    })
    const action = actions.setNewContactName('Big Suze')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        newContactForm: {
          name: 'Big Suze',
          phoneNumber: null,
          context: null
        }
      })
    )
  })

  it('sets new contact number', () => {
    const initialState = fromJS({
      newContactForm: {
        name: null,
        phoneNumber: null,
        context: null
      }
    })
    const action = actions.setNewContactNumber('+12675558080')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        newContactForm: {
          name: null,
          phoneNumber: '+12675558080',
          context: null
        }
      })
    )
  })

  it('sets new contact context', () => {
    const initialState = fromJS({
      newContactForm: {
        name: null,
        phoneNumber: null,
        context: null
      }
    })
    const action = actions.setNewContactContext('circus')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        newContactForm: {
          name: null,
          phoneNumber: null,
          context: 'circus'
        }
      })
    )
  })

    it('sets contact form missing fields', () => {
    const initialState = fromJS({contactFormMissingFields: false})
    const action = actions.setContactFormMissingFields(true)

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        contactFormMissingFields: true
      })
    )
  })

  it('clears contact form', () => {
    const initialState = fromJS({
      contactFormMissingFields: true,
      newContactForm: {
        name: 'Super Hans',
        phoneNumber: '5555',
        context: 'juice bar',
        invalidNumber: true
      }
    })
    const action = actions.clearContactForm()

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        contactFormMissingFields: false,
        newContactForm: {
          name: '',
          phoneNumber: '',
          context: '',
          formattedNumber: '',
          countryCode: 'US',
          invalidNumber: false
        }
      })
    )
  })


  it('adds a contact', () => {
    const initialState = fromJS({
        contacts: [{
          context: 'work',
          name: 'Bob Barker',
          number: '+12675558080'
        }]
      })
    const newContact = {
      context: 'flatmate',
      name: 'Jeremy',
      number: '+42343434343'
    }
    const action = actions.addContact(newContact)

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        contacts: [{
          context: 'work',
          name: 'Bob Barker',
          number: '+12675558080'
        }, {
          context: 'flatmate',
          name: 'Jeremy',
          number: '+42343434343'
        }]
      })
    )
  })

  describe('phone number parsing', () => {
    context('with a valid number', () => {
      it('sets the formattedNumber', () => {
        const initialState = fromJS({
          newContactForm:{
            phoneNumber: '(412) 454-2543',
            countryCode: 'US',
            formattedNumber: ''
          }
        })
        const action = actions.parseNumber()

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            newContactForm: {
              phoneNumber: '(412) 454-2543',
              formattedNumber: '+14124542543',
              countryCode: 'US'
            }
          })
        )
      })
    })

    context('with an invalid number', () => {
      it('sets the formattedNumber', () => {
        const initialState = fromJS({
          newContactForm:{
            phoneNumber: '8888-(454) 2543',
            countryCode: 'US',
            formattedNumber: '',
            invalidNumber: false
          }
        })
        const action = actions.parseNumber()

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            newContactForm:{
              phoneNumber: '8888-(454) 2543',
              countryCode: 'US',
              formattedNumber: '',
              invalidNumber: true
            }
          })
        )
      })
    })
  })
})
