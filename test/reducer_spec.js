import {Set, Map, fromJS} from 'immutable'
import {expect} from 'chai'

import reducer from '../src/reducer'

// fromJS(json: any, reviver?: (k: any, v: Iterable<any, any>) => any): any

describe('reducer', () => {
  it('has an initial state', () => {
    const action = {
      type: 'SET_CONTENT',
      entries: ['sparrow'],
      traits: ['sad']
    }
    const nextState = reducer(undefined, action)

    expect(nextState).to.equal(fromJS({
      entries: ['sparrow'],
      initialEntries: ['sparrow'],
      traits: ['sad'],
      initialTraits: ['sad'],
    }))
  })

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_CONTENT', entries: ['sparrow', 'starling']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'sparrow'},
      {type: 'VOTE', entry: 'starling'},
      {type: 'VOTE', entry: 'starling'},
      {type: 'NEXT'}
    ]
    const finalState = actions.reduce(reducer, Set, Map())

    expect(finalState).to.equal(fromJS({
      winner: 'starling',
      initialEntries: ['sparrow', 'starling']
    }))
  })

  it('handles SET_CONTENT', () => {
    const initialState = Map()
    const action = {type: 'SET_CONTENT', entries: ['sparrow']}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      entries: ['sparrow'],
      initialEntries: ['sparrow']
    }))
  })

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['sparrow', 'starling']
    })
    const action = {type: 'NEXT'}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        pair: ['sparrow', 'starling']
      },
      entries: []
    }))
  })

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['sparrow', 'starling']
      },
      entries: []
    })
    const action = {type: 'VOTE', entry: 'sparrow'}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['sparrow', 'starling'],
        tally: {sparrow: 1}
      },
      entries: []
    }))
  })
})
