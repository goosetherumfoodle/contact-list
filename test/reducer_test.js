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
        countryCode: 'US',
        name: null,
        phoneNumber: null,
        prettyPrintPhoneNumber: null,
        context: null
      }
    })
    const action = actions.setNewContactNumber('518.321.0486')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        newContactForm: {
          countryCode: 'US',
          name: null,
          phoneNumber: '518.321.0486',
          prettyPrintPhoneNumber: '(518) 321-0486',
          context: null,
          formattedNumber: '+15183210486',
          invalidNumber: false
        }
      })
    )
  })

  describe('realtime number formatting and validation', () => {
    context('with partial number', () => {
      it('shows prettyprint version and is invalid', () => {
        const initialState = fromJS({
          newContactForm: {
            countryCode: 'US',
            name: null,
            phoneNumber: null,
            context: null,
            formattedNumber: null,
            invalidNumber: false
          }
        })
        const action = actions.setNewContactNumber('412987654')

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            newContactForm: {
              countryCode: 'US',
              name: null,
              phoneNumber: '412987654',
              prettyPrintPhoneNumber: '(412) 987-654',
              context: null,
              formattedNumber: false,
              invalidNumber: true
            }
          })
        )
      })
    })

    context('with full number', () => {
      it('shows prettyprint version and is valid', () => {
        const initialState = fromJS({
          newContactForm: {
            countryCode: 'US',
            name: null,
            phoneNumber: '412',
            prettyPrintPhoneNumber: '(412)',
            context: null,
            formattedNumber: '+14129876540',
            invalidNumber: true
          }
        })
        const action = actions.setNewContactNumber('4129876540')

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            newContactForm: {
              countryCode: 'US',
              name: null,
              phoneNumber: '4129876540',
              prettyPrintPhoneNumber: '(412) 987-6540',
              context: null,
              formattedNumber: '+14129876540',
              invalidNumber: false
            }
          })
        )
      })
    })
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
        prettyPrintPhoneNumber: '(555) 5',
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
          prettyPrintPhoneNumber: '',
          context: '',
          formattedNumber: '',
          countryCode: 'US',
          invalidNumber: false,
          generalWarning: false
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

  it('removes a contact', () => {
    const initialState = fromJS({
      contacts: [{
          context: 'Work',
          name: 'Mark Corrigan',
          number: '+12675558080'
        }, {
          context: 'Hair Blair Bunch',
          name: 'Jeremy',
          number: '+42343434343'
        }]
    })
    const action = actions.removeContact('+42343434343')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        contacts: [{
          context: 'Work',
          name: 'Mark Corrigan',
          number: '+12675558080'
        }]
      })
    )
  })

  // todo: totally remove these
  // I think we're just gonna do the formatting on input, not submission
  // describe('phone number parsing', () => {
  //   context('with a valid number', () => {
  //     it('sets the formattedNumber', () => {
  //       const initialState = fromJS({
  //         newContactForm:{
  //           phoneNumber: '(412) 454-2543',
  //           countryCode: 'US',
  //           formattedNumber: ''
  //         }
  //       })
  //       const action = actions.parseNumber()

  //       const nextState = reducer(initialState, action)

  //       expect(nextState).to.equal(
  //         fromJS({
  //           newContactForm: {
  //             phoneNumber: '(412) 454-2543',
  //             formattedNumber: '+14124542543',
  //             countryCode: 'US',
  //             invalidNumber: false
  //           }
  //         })
  //       )
  //     })
  //   })

  //   context('with an invalid number', () => {
  //     it('sets the formattedNumber', () => {
  //       const initialState = fromJS({
  //         newContactForm:{
  //           phoneNumber: '8888-(454) 2543',
  //           countryCode: 'US',
  //           formattedNumber: '',
  //           invalidNumber: false
  //         }
  //       })
  //       const action = actions.parseNumber()

  //       const nextState = reducer(initialState, action)

  //       expect(nextState).to.equal(
  //         fromJS({
  //           newContactForm:{
  //             phoneNumber: '8888-(454) 2543',
  //             countryCode: 'US',
  //             formattedNumber: false,
  //             invalidNumber: true
  //           }
  //         })
  //       )
  //     })
  //   })
  // })

  it('sets new contact country code', () => {
    const initialState = fromJS({
      newContactForm: {
        countryCode: 'DE',
        phoneNumber: '9876543210',
        formattedNumber: null,
        invalidNumber: null
      }
    })
    const action = actions.setNewContactCountryCode('US')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        newContactForm: {
          countryCode: 'US',
          phoneNumber: '9876543210',
          prettyPrintPhoneNumber: '(987) 654-3210',
          formattedNumber: '+19876543210',
          invalidNumber: false
        }
      })
    )
  })

  it('setting general warning text', () => {
    const initialState = fromJS({
      newContactForm: {
        generalWarning: false,
        countryCode: 'DE',
        phoneNumber: '9876543210',
        formattedNumber: null,
        invalidNumber: null
      }
    })
    const action = actions.setGeneralWarning('warning message')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(
      fromJS({
        newContactForm: {
          generalWarning: 'warning message',
          countryCode: 'DE',
          phoneNumber: '9876543210',
          formattedNumber: null,
          invalidNumber: null
        }
      })
    )
  })

  describe('validating the new contact form', () => {
    context('with valid fields', () => {
      it('sets warning to false', () => {
        const initialState = fromJS({
          contacts: [],
          newContactForm: {
            name: 'Mark Corrigan',
            context: 'Bank',
            countryCode: 'US',
            phoneNumber: '9876543210',
            prettyPrintPhoneNumber: '(987) 654-3210',
            formattedNumber: '+19876543210',
            invalidNumber: false,
            generalWarning: 'previous warning message'
          }
        })
        const action = actions.validateNewContactForm()

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            contacts: [],
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
        )
      })
    })

    context('with missing name', () => {
      it('sets warning message about missing fields', () => {
        const initialState = fromJS({
          newContactForm: {
            name: '',
            context: 'horse',
            generalWarning: false
          }
        })
        const action = actions.validateNewContactForm()

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            newContactForm: {
              name: '',
              context: 'horse',
              generalWarning: 'Please fill in missing fields'
            }
          })
        )
      })
    })

    context('with missing context', () => {
      it('sets warning message about missing fields', () => {
        const initialState = fromJS({
          newContactForm: {
            name: 'Jez',
            context: '',
            generalWarning: false
          }
        })
        const action = actions.validateNewContactForm()

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            newContactForm: {
              name: 'Jez',
              context: '',
              generalWarning: 'Please fill in missing fields'
            }
          })
        )
      })
    })

    context('with an invalid phone number', () => {
      it('sets warning message about an invalid number', () => {
        const initialState = fromJS({
          newContactForm: {
            name: 'Jez',
            context: 'flatmate',
            formattedNumber: '',
            invalidNumber: true
          }
        })
        const action = actions.validateNewContactForm()

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            newContactForm: {
              name: 'Jez',
              context: 'flatmate',
              generalWarning: 'Please check that the number you have entered is valid',
              formattedNumber: '',
              invalidNumber: true
            }
          })
        )
      })
    })

    context('with number we are already storing', () => {
      it('sets warning message about a duplicate number', () => {
        const initialState = fromJS({
          contacts: [{number: '+19876543210'}],
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
        const action = actions.validateNewContactForm()

        const nextState = reducer(initialState, action)

        expect(nextState).to.equal(
          fromJS({
            contacts: [
              {number: '+19876543210'}
            ],
            newContactForm: {
              name: 'Mark Corrigan',
              context: 'Bank',
              countryCode: 'US',
              phoneNumber: '9876543210',
              prettyPrintPhoneNumber: '(987) 654-3210',
              formattedNumber: '+19876543210',
              invalidNumber: false,
              generalWarning: 'We already have a contact with this number'
            }
          })
        )
      })
    })
  })

  it('setting server error text', () => {
    const initialState = fromJS({serverError: false})
    const action = actions.setServerError('serve whaaaaat?')

    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({serverError: `We encounted the following error connecting to the server: serve whaaaaat?. Please reload the page`}))
  })
})
