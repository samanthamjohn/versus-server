import {Map, fromJS} from 'immutable'
import {expect} from 'chai'

import makeStore from '../src/store'

describe('store', () => {
  it('is a Redux store with the correct reducer', () => {
    const store = makeStore()
    expect(store.getState()).to.equal(Map())

    store.dispatch({
      type: 'SET_CONTENT',
      entries: ['sparrow', 'starling'],
      traits: ['sad']
    })
    expect(store.getState()).to.equal(fromJS({
      entries: ['sparrow', 'starling'],
      initialEntries: ['sparrow', 'starling'],
      traits: ['sad'],
      initialTraits: ['sad'],
    }))
  })
})
