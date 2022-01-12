<template>
  <div class='data-layers'>
    <map-component />
    <time-stamp getActiveRasterLayer/>
    <router-view />
      <v-navigation-drawer class="pl-14" permanent absolute width="30vw" color="background">
        <v-container class="editor d-flex flex-column">
          <h2 class="h3 mb-3 justify-start">
            Workflow runner
          </h2>
          <v-col>
            <v-select
              :items="items"
              label="Select workflow"
            ></v-select>
          </v-col>
          <div class="flex-grow-1 editor-content" v-if="email">
            <list-workflows v-if="$route.params.jobId === 'list'" />
            <create-workflow v-if="$route.params.jobId === 'new'" />
            <workflow-status v-if="$route.params.jobId !== 'new' && $route.params.jobId !== 'list' && $route.params.jobId" />
          </div>
          <v-btn v-if="email" :to="{ name: 'editor', params: { jobId: 'new' }}" class="my-3 flex-grow-0" outlined block>
            Create new workflow
          </v-btn>
          <v-btn v-if="email" :to="{ name: 'editor', params: { jobId: 'list' }}" class="flex-grow-0" outlined block>
            List workflows
          </v-btn>
          <div v-else class="account-details__placeholder">
            <p>Please login to show workflows and create new.</p>
          </div>
        </v-container>
      </v-navigation-drawer>
  </div>
</template>

<script>
import MapComponent from '@/components/MapComponent'
import CreateWorkflow from '../components/CreateWorkflow'
import ListWorkflows from '../components/ListWorkflows'
import WorkflowStatus from '../components/WorkflowStatus'
import _ from 'lodash'

import { mapGetters } from 'vuex'

export default {
  name: 'DataLayers',
  components: {
    MapComponent,
    CreateWorkflow,
    WorkflowStatus,
    ListWorkflows
  },
  data: () => ({
    items: ['HydroMT', 'SFINCS forecast']
  }),
  computed: {
    ...mapGetters(['datasetsInActiveTheme', 'getActiveRasterLayer', 'activeTimestamp', 'user']),
    email () {
      return _.get(this.user, 'email')
    }
  }
}
</script>

<style scoped>
.data-layers {
  width: 100%;
  height: 100%;
}

.editor {
  align-items: flex-start;
  height: 100%;
}

.editor-content {
  width: 100%;
  max-height: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
