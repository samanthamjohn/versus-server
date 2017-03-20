import {List, Map} from 'immutable'

export const INITIAL_STATE = Map()

export function setEntries(state, entries, traits) {
  const entriesList = List(entries)
  const traitsList = List(traits)

  return state.set('entries', entriesList)
              .set('initialEntries', entriesList)
              .set('traits', traitsList)
              .set('initialTraits', traitsList)
}

// getIn(searchKeyPath: Array<any>, notSetValue?: any): any
// getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any

export function next(state, round = state.getIn(['vote', 'round'], 0)) {
  const traits = state.get('traits')
  const winners = getWinners(state.get('vote'))
  const entries = state.get('entries').concat(winners)

  return state.merge({
    vote: Map({
      round: round + 1,
      pair: entries.take(2),
      trait: traits.take(1)
    }),
    entries: entries.skip(2),
    traits: traits.skip(1)
  })
}

export function restart(state) {
  const round = state.getIn(['vote', 'round'], 0)
  const initialEntries = state.get('initialEntries')
  const initialTraits = state.get('initialTraits')

  return next(
    state.set('entries', initialEntries)
         .set('traits', initialTraits)
         .remove('vote'),
    round
  )
}

export function vote(voteState, entry) {
  if (voteState.get('pair').includes(entry)) {
    return voteState.updateIn(
      ['tally', entry],
      0,
      tally => tally + 1
    )
  } else {
    return voteState
  }
}

function getWinners(vote) {
  if (!vote) return []
  const [a, b] = vote.get('pair')
  const aVotes = vote.getIn(['tally', a], 0)
  const bVotes = vote.getIn(['tally', b], 0)

  if (aVotes > bVotes) return [a]
  else if (aVotes < bVotes) return [b]
  else return [a, b]
}
