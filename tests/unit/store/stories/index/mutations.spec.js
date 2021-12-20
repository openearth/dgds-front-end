import { mutations } from '@/store/stories/index.js'

describe('setStories', () => {
  test('updates state.stories with stories in payload', () => {
    const state = {
      stories: []
    }
    const stories = [
      {
        id: 'storyId1',
        theme: 'theme1',
        stories: []
      },
      {
        id: 'storyId2',
        theme: 'theme2',
        stories: [

        ]
      }
    ]
    mutations.setStories(state, stories)
    expect(state.stories).toBe(stories)
  })
})
describe('setNews', () => {
  test('updates state.news with stories in payload', () => {
    const state = {
      news: []
    }
    const news = [
      [
        {
          ID: 'newsId1',
          title: 'title1'
        },
        {
          ID: 'newsId2',
          title: 'title2'
        }
      ]
    ]
    mutations.setNews(state, news)
    expect(state.news).toBe(news)
  })
})
