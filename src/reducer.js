import {
  INITIAL_STATE,
  next,
  restart,
  setEntries,
  vote,
} from './core'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_ENTRIES':
      return setEntries(
        state,
        action.entries,
        action.traits
      )

    case 'NEXT':
      return next(state)

    case 'RESTART':
      return restart(state)

    case 'VOTE':
      return state.update(
        'vote',
        voteState => vote(voteState, action.entry)
      )
  }

  return state
}
