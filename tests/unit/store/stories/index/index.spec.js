import { state } from '@/store/stories/index.js'

test('Initial state', () => {
  const initialState = {
    stories: [],
    news: []
  }
  expect(state).toEqual(initialState)
})
