export const getDefaultState = () => ({
  editorTemplate: {},
  selectedBbox: {},
  user: null
})

export const state = getDefaultState()

export const mutations = {
  setBboxProperties (state, props) {
  // First throw out old state in order to update this object properly.
  // Otherwise when used in vue files as computed property, it won't see
  // the update
    state.selectedBbox.properties = {}
    state.selectedBbox.properties = props
  },
  setUser (state, user) {
    state.user = user
  }
}

export const actions = {
  loadEditorConfig (store) {
    // Get the openapi json to retrieve the template per model.
    // For now only HydroMT available
    let url = process.env.VUE_APP_EDITOR_SERVER
    url = url.replace('/v1', '')
    console.log(url)
    return fetch(`${url}/openapi.json`)
      .then(res => {
        return res.json()
      })
      .then(response => {
        // Save the schemas asstate properties
        console.log(response)
        const inputs = response.components.schemas.HydroMTProcessInputs
        console.log(inputs)
        delete inputs.properties.type
        this.state.editorTemplate = inputs
        this.state.selectedBbox = response.components.schemas.BBox
        console.log(this.state.selectedBbox)
      })
  }
}

export default {
  state,
  actions,
  mutations
}
