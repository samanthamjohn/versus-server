import {
  INITIAL_STATE,
  next,
  restart,
  setContent,
  vote,
} from './core'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SET_CONTENT':
      return setContent(
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
