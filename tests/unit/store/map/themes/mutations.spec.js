import { mutations } from '@/store/map/themes'

describe('addTheme', () => {
  test('updates state with payload', () => {
    const state = []
    const theme = { id: 'mytheme', foo: 'bar' }

    mutations.addTheme(state, theme)
    expect(state).toMatchObject([{
      id: 'mytheme', foo: 'bar'
    }])
  })
  test('replace theme when called with existing id', () => {
    const state = [
      { id: 'mytheme', foo: 'bar' }
    ]
    const theme = { id: 'mytheme', baz: 'baz' }

    mutations.addTheme(state, theme)
    expect(state).toMatchObject([{
      id: 'mytheme', foo: 'bar'
    }, {
      id: 'mytheme', baz: 'baz'
    }])
  })
})
