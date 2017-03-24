import makeStore from './src/store'
import startServer from './src/server'

export const store = makeStore()
startServer(store)

store.dispatch({
  type: 'SET_CONTENT',
  entries: require('./entries.json'),
  traits: require('./traits.json')
})

store.dispatch({
  type: 'NEXT'
})
