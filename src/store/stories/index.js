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
    dispatch('loadConfiguration', url, 'setNews')
  },

  loadStories ({ dispatch }) {
    const url = `${process.env.VUE_APP_STORIES_CONFIGURATION_URL}`
    dispatch('loadConfiguration', url, 'setStories')
  },

  loadConfiguration ({ commit }, url, responseAction) {
    fetch(url)
      .then(res => res.json())
      .then(response => {
        console.log(response)
        commit(responseAction, response)
      })
  }
}
export const getters = {
  stories (state) {
    return state.stories
  },
  news (state) {
    return state.news
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
