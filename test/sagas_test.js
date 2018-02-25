import {fromJS} from 'immutable'
import {expect} from 'chai'
import {call} from 'redux-saga/effects'

import {fetchInitialContacts} from '../src/store/sagas'
import * as actions from '../src/store/actions'
import {getContacts} from '../src/utils/api'

describe('sagas', () => {
  context('fetchInitialContacts', () => {
    const saga = fetchInitialContacts()
    it('fetches contacts and dispatches setContacts', () => {
      expect(saga.next().value).to.deep.equal(call(getContacts))
    })
  })
})
