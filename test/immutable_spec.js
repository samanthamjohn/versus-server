import {expect} from 'chai'
import {List, Map} from 'immutable'

describe('immutability -', () => {
  describe('a Number', () => {
    function increment(currentState) {
      return currentState + 1
    }

    it('is immutable', () => {
      let state = 100
      let nextState = increment(state)

      expect(nextState).to.equal(101)
      expect(state).to.equal(100)
    })
  })

  describe('a List', () => {
    function addBird(currentState, movie) {
      return currentState.push(movie)
    }

    it('is immutable', () => {
      let state = List.of('sparrow', 'starling')
      let nextState = addBird(state, 'raven')

      expect(nextState).to.equal(List.of(
        'sparrow',
        'starling',
        'raven'
      ))
      expect(state).to.equal(List.of(
        'sparrow',
        'starling'
      ))
    })
  })

  describe('a Tree', () => {
    function addBird(currentState, bird) {
      return currentState.update(
        'birds',
        birds => birds.push(bird)
      )
    }

    it('is immutable', () => {
      let state = Map({
        birds: List.of('sparrow', 'starling')
      })
      let nextState = addBird(state, 'catbird')

      expect(nextState).to.equal(Map({
        birds: List.of(
          'sparrow',
          'starling',
          'catbird'
        )
      }))
      expect(state).to.equal(Map({
        birds: List.of(
          'sparrow',
          'starling',
        )
      }))
    })
  })
})
