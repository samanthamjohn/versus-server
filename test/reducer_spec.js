import {Map, Set, fromJS} from 'immutable'
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
      {
        type: 'SET_CONTENT',
        entries: ['sparrow', 'starling'],
        traits: ['sad', 'nice']
      },
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'sparrow'},
      {type: 'VOTE', entry: 'starling'},
      {type: 'VOTE', entry: 'starling'},
      {type: 'NEXT'}
    ]

    const finalState = actions.reduce(reducer, Set, Map())

    expect(finalState).to.equal(fromJS({
      initialEntries: ['sparrow', 'starling'],
    }))
  })

  it('handles SET_CONTENT', () => {
    const initialState = Map()
    const action = {
      type: 'SET_CONTENT',
      entries: ['sparrow'],
      traits: ['sad']
    }
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      entries: ['sparrow'],
      initialEntries: ['sparrow'],
      traits: ['sad'],
      initialTraits: ['sad'],
    }))
  })

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['sparrow', 'starling'],
      traits: ['sad', 'nice']
    })
    const action = {type: 'NEXT'}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      entries: [],
      traits: ['nice'],
      vote: {
        round: 1,
        pair: ['sparrow', 'starling'],
        trait: 'sad'
      },
      results: Set([undefined])
    }))
  })

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['sparrow', 'starling'],
        trait: 'sad'
      },
      entries: []
    })
    const action = {type: 'VOTE', entry: 'sparrow'}
    const nextState = reducer(initialState, action)

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['sparrow', 'starling'],
        trait: 'sad',
        tally: {sparrow: {sad: 1}}
      },
      entries: []
    }))
  })
})
