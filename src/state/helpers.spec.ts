import { applyReducerState, applyStateByKey } from './helpers'

const setupAction = () => ({ foo: 'bar', baz: 'foo', type: 'foo' })

describe('state provider helpers', function () {
  describe('applyStateByKey', () => {
    it('applies action value by key', () => {
      expect.assertions(1)
      const state = { baz: 'foo' }
      expect(applyStateByKey(state, setupAction(), 'foo')).toStrictEqual({ baz: 'foo', foo: 'bar' })
    })
  })

  describe('applyReducerState', () => {
    it('applies action by type', () => {
      expect.assertions(1)
      const state = {}
      expect(applyReducerState(state, setupAction())).toStrictEqual({ foo: 'bar' })
    })
  })
})
