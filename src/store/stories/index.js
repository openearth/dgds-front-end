const sanitizeUrl = require('@braintree/sanitize-url').sanitizeUrl

export const getDefaultState = () => ({
  stories: [],
  news: []
})

export const state = getDefaultState()

export const mutations = {
  setStories (state, stories) {
    state.stories = stories
  },
  setNews (state, news) {
    state.news = news
  }
}

export const actions = {
  loadNews ({ dispatch }) {
    const url = `${process.env.VUE_APP_NEWS_CONFIGURATION_URL}`
    dispatch('loadConfiguration', { url: url, responseAction: 'setNews' })
  },

  loadStories ({ dispatch }) {
    const url = `${process.env.VUE_APP_STORIES_CONFIGURATION_URL}`
    dispatch('loadConfiguration', { url: url, responseAction: 'setStories' })
  },

  loadConfiguration ({ commit }, { url, responseAction }) {
    fetch(url)
      .then(res => res.json())
      .then(response => {
        commit(responseAction, response)
      })
  }
}
export const getters = {
  stories (state) {
    const updatedStories = state.stories.map((themeItem) => {
      const { id, theme, stories } = themeItem
      const storiesWithSanitizedUrl = stories.map((storyItem) => {
        const { ID, title, URL, icon } = storyItem
        return {
          ID,
          title,
          URL: sanitizeUrl(URL),
          icon
        }
      })
      return {
        id,
        theme,
        stories: storiesWithSanitizedUrl
      }
    })

    return updatedStories
  },
  news (state) {
    const updatedNews = state.news.map((newsItem) => {
      const { ID, title, URL, date, source } = newsItem
      return {
        ID,
        title,
        URL: sanitizeUrl(URL),
        date,
        source
      }
    })
    return updatedNews
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
