import {List, Map} from 'immutable'
import {expect} from 'chai'

import {
  next,
  restart,
  setContent,
  vote,
} from '../src/core'

describe('core logic -', () => {
  describe('setContent', () => {
    it('adds entries and traits to the state', () => {
      const state = Map()
      const entries = List.of('sparrow', 'starling')
      const traits = List.of('nice', 'sad')

      const nextState = setContent(state, entries, traits)

      expect(nextState).to.equal(Map({
        entries: List.of('sparrow', 'starling'),
        initialEntries: List.of('sparrow', 'starling'),
        traits: List.of('nice', 'sad'),
        initialTraits: List.of('nice', 'sad')
      }))
    })
  })

  describe('vote', () => {
    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('sparrow', 'starling'),
        trait: 'sad'
      })
      const nextState = vote(state, 'starling')
      expect(nextState).to.equal(Map({
        pair: List.of('sparrow', 'starling'),
        trait: 'sad',
        tally: Map({
          'starling': Map({'sad': 1})
        })
      }))
    })

    it('adds to existing tally for the voted entry', () => {
      const state = Map({
        pair: List.of('sparrow', 'starling'),
        trait: 'sad',
        tally: Map({
          'sparrow': Map({'sad': 3}),
        })
      })
      const nextState = vote(state, 'sparrow')
      expect(nextState).to.equal(Map({
        pair: List.of('sparrow', 'starling'),
        trait: 'sad',
        tally: Map({
          'sparrow': Map({'sad': 4}),
        })
      }))
    })

    it('ignores the vote for invalid entry', () => {
      expect(
        vote(Map({
          pair: List.of('sparrow', 'starling')
        }), 'shrike')
      ).to.equal(
        Map({
          pair: List.of('sparrow', 'starling')
        })
      )
    })
  })

  describe('next', () => {
    it('takes the next two entries for voting', () => {
      const state = Map({
        entries: List.of('sparrow', 'starling', 'crow'),
        traits: List.of('sad', 'nice')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        entries: List.of('crow'),
        traits: List.of('nice'),
        vote: Map({
          round: 1,
          pair: List.of('sparrow', 'starling'),
          trait: 'nice'
        }),
        results: undefined
      }))
    })

    it('returns current vote winner back to entries', () => {
      const state = Map({
        vote: Map({
          round: 1,
          pair: List.of('sparrow', 'starling'),
          trait: 'sad',
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
          round: 2,
          pair: List.of('raven', 'catbird'),
        }),
        entries: List.of('shrike', 'sparrow')
      }))
    })

    it('returns tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          round: 1,
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
          round: 2,
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

  describe('restart', () => {
    it('returns initial entries and takes two under vote', () => {
      expect(
        restart(Map({
          vote: Map({
            round: 1,
            pair: List.of('sparrow', 'shrike')
          }),
          entries: List(),
          initialEntries: List.of('sparrow', 'starling', 'shrike')
        }))
      ).to.equal(
        Map({
          vote: Map({
            round: 2,
            pair: List.of('sparrow', 'starling')
          }),
          entries: List.of('shrike'),
          initialEntries: List.of('sparrow', 'starling', 'shrike')
        })
      )
    })
  })
})
