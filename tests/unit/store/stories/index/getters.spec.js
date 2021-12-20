import { getters } from '@/store/stories/index.js'

describe('stories', () => {
  test('returns stories', () => {
    const state = {
      stories: [
        {
          id: 'storyId1',
          theme: 'theme1',
          stories: []
        }
      ]
    }
    const result = getters.stories(state)
    expect(result).toEqual([
      {
        id: 'storyId1',
        theme: 'theme1',
        stories: []
      }
    ])
  })
})

describe('news', () => {
  test('returns news', () => {
    const state = {
      news: [
        {
          ID: 'newsId1',
          title: 'title1'
        }
      ]
    }
    const result = getters.news(state)
    expect(result).toEqual([
      {
        ID: 'newsId1',
        title: 'title1'
      }
    ])
  })
})
