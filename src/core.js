import {List, Map} from 'immutable'

export const INITIAL_STATE = Map()

export function setEntries(state, entries) {
  const list = List(entries)

  return state.set('entries', list)
              .set('initialEntries', list)
}

// getIn(searchKeyPath: Array<any>, notSetValue?: any): any
// getIn(searchKeyPath: Iterable<any, any>, notSetValue?: any): any

export function next(state, round = state.getIn(['vote', 'round'], 0)) {
  const winners = getWinners(state.get('vote'))

  const entries = state.get('entries').concat(winners)

  if (entries.size === 1) {
    return state.remove('vote')
                .remove('entries')
                .set('winner', entries.first())
  } else {
    return state.merge({
      vote: Map({
        round: round + 1,
        pair: entries.take(2)
      }),
      entries: entries.skip(2)
    })
  }
}

export function restart(state) {
  const round = state.getIn(['vote', 'round'], 0)
  const initialEntries = state.get('initialEntries')

  return next(
    state.set('entries', initialEntries).remove('vote').remove('winner'),
    round
  )
}

export function vote(voteState, entry) {
  return voteState.updateIn(
    ['tally', entry],
    0,
    tally => tally + 1
  )
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
