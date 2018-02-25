import {fromJS} from 'immutable'

import * as actionTypes from './actionTypes'

const initialState = fromJS({
  contacts: []
})

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case actionTypes.SET_CONTACTS:
    return state.set('contacts', fromJS(action.payload.contacts))
  default:
    return state
  }
}
