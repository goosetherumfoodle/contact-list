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
})
