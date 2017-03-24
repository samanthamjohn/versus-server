import {List, Map, Set, fromJS} from 'immutable'
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
    xit('takes next two entries for voting', () => {
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
          trait: 'sad'
        }),
        results: Set([undefined])
      }))
    })

    xit('returns current vote winner back to entries', () => {
      const state = Map({
        vote: Map({
          round: 1,
          pair: List.of('sparrow', 'starling'),
          trait: 'sad',
          tally: Map({
            'sparrow': Map({'sad': 4}),
          })
        }),
        entries: List.of('raven', 'catbird', 'shrike'),
        traits: List.of('nice', 'angry')
      })
      const nextState = next(state)
      expect(nextState).to.equal(Map({
        vote: Map({
          round: 2,
          pair: List.of('raven', 'catbird'),
          trait: 'nice',
        }),
        entries: List.of('shrike', 'sparrow'),
        traits: List.of('angry')
      }))
    })

    xit('returns tied vote back to entries', () => {
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

    it('adds the vote tally to Results', () => {
      const state = Map({
        vote: Map({
          round: 1,
          pair: List.of('sparrow', 'starling'),
          trait: 'sad',
          tally: Map({
            'sparrow': {'sad': 2},
          })
        }),
        entries: List.of('raven', 'catbird', 'shrike'),
        traits: List.of('nice', 'angry'),
      })
      const nextState = next(state)

      expect(nextState.getIn(['results', 'sparrow'])).to.eql({'sad' : 2})
    })

    it('preserves existing tally in Results', () => {
      const state = Map({
        vote: Map({
          round: 2,
          pair: List.of('raven', 'catbird'),
          trait: 'nice',
          tally: Map({
            'raven': {'nice': 1},
          })
        }),
        entries: List.of('shrike'),
        traits: List.of('angry'),
        results: Map({
          'sparrow': {'sad': 2},
        })
      })
      const nextState = next(state)

      expect(nextState.getIn(['results', 'sparrow'])).to.eql({'sad' : 2})
      expect(nextState.getIn(['results', 'raven'])).to.eql({'nice' : 1})
    })

    it('updates an existing tally in the results', () => {
      const state = fromJS({
        vote: {
          round: 2,
          pair: ['raven', 'catbird'],
          trait: 'nice',
          tally: {
            'raven': {'nice': 1},
          }
        },
        entries: ['shrike'],
        traits: ['angry'],
        results: {
          'raven': {'sad': 2, 'nice': 3},
        }
      })
      const nextState = next(state)

      expect(nextState.getIn(['results', 'raven'])).to.eql(fromJS({'nice' : 4, 'sad' : 2}))
    })

    // .to.equal(Map({
    //   vote: Map({
    //    round: 2,
    //    pair: List.of('raven', 'catbird'),
    //    trait: 'nice',
    //  }),
    // entries: List.of('shrike'),
    // traits: List.of('angry'),
    // results: {
    //   'sparrow': {'sad': 2}
    // }
    // }))


    //   it('declares the last entry left as winner', () => {
    //     const state = Map({
    //       vote: Map({
    //         pair: List.of('sparrow', 'starling'),
    //         tally: Map({
    //           'sparrow': 2,
    //           'starling': 3
    //         })
    //       }),
    //       entries: List()
    //     })
    //     const nextState = next(state)
    //     expect(nextState).to.equal(Map({
    //       winner: 'starling'
    //     }))
  })

  describe('restart', () => {
    xit('returns initial entries and takes two under vote', () => {
      expect(
        restart(Map({
          vote: Map({
            round: 1,
            pair: List.of('sparrow', 'shrike'),
            trait: 'sad'
          }),
          entries: List(),
          initialEntries: List.of('sparrow', 'starling', 'shrike'),
          traits: List(),
          initialTraits: List.of('nice', 'sad'),
        }))
      ).to.equal(
        Map({
          vote: Map({
            round: 2,
            pair: List.of('sparrow', 'starling'),
            trait: 'nice'
          }),
          entries: List.of('shrike'),
          initialEntries: List.of('sparrow', 'starling', 'shrike'),
          traits: List.of('sad'),
          initialTraits: List.of('nice', 'sad'),
          results: Set([undefined])
        })
      )
    })
  })
})
