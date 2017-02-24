import {List, Map} from 'immutable'
import {expect} from 'chai'

import {setEntries, next, vote} from '../src/core'

describe('app logic -', () => {
  describe('setEntries', () => {
    it('adds the entries to the state', () => {
      const state = Map()
      const entries = List.of('sparrow', 'starling')
      const nextState = setEntries(state, entries)
      expect(nextState).to.equal(Map({
        entries: List.of('sparrow', 'starling')
      }))
    })
  })

  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('sparrow', 'starling')
      })
      const nextState = vote(state, 'starling')
      expect(nextState).to.equal(Map({
        pair: List.of('sparrow', 'starling'),
        tally: Map({
          'starling': 1
        })
      }))
    })

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('sparrow', 'starling'),
        tally: Map({
          'sparrow': 3,
          'starling': 1
        })
      })
      const nextState = vote(state, 'sparrow')
      expect(nextState).to.equal(Map({
        pair: List.of('sparrow', 'starling'),
        tally: Map({
          'sparrow': 4,
          'starling': 1,
        })
      }))
    })
  })

  describe('next', () => {
    it('takes the next two entries for voting', () => {
      const state = Map({
        entries: List.of('sparrow', 'starling', 'crow')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('sparrow', 'starling')
        }),
        entries: List.of('crow')
      }))
    })

    it('returns current vote winner back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('sparrow', 'starling'),
          tally: Map({
            'sparrow': 3,
            'starling': 1
          })
        }),
        entries: List.of('raven', 'catbird', 'shrike')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('raven', 'catbird'),
        }),
        entries: List.of('shrike', 'sparrow')
      }))
    })

    it('returns tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('sparrow', 'starling'),
          tally: Map({
            'sparrow': 2,
            'starling': 2
          })
        }),
        entries: List.of('raven', 'catbird', 'shrike')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('raven', 'catbird')
        }),
        entries: List.of('shrike', 'sparrow', 'starling')
      }))
    })

    it('declares the last entry left as winner', () => {
      const state = Map({
        vote: Map({
          pair: List.of('sparrow', 'starling'),
          tally: Map({
            'sparrow': 2,
            'starling': 3
          })
        }),
        entries: List()
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        winner: 'starling'
      }))
    })
  })
})
