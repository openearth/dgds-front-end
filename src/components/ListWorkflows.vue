<template>
  <div class="list-workflows">
    <v-list width="100%">
      <v-list-item v-for="workflow in workflows" :key="workflow.jobId" :to="`/editor/${workflow.jobID}`">
        <v-list-item-icon>
         <v-icon small v-text="`mdi-checkbox-blank-circle`" :color="iconColor(workflow.status)"></v-icon>
       </v-list-item-icon>
       <v-list-item-content>
        <v-list-item-title v-text="workflow.title"></v-list-item-title>
      </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
const colors = {
  running: '#009688',
  failed: '#009688',
  accepted: '#009688',
  successful: '#4CAF50'
}

export default {
  data () {
    return {
      workflows: []
    }
  },
  mounted () {
    this.getWorkflows()
  },
  methods: {
    getWorkflows () {
      fetch(`${process.env.VUE_APP_EDITOR_SERVER}/processes/hydromt/jobs`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.workflows = data
        })
        .catch(error => {
          console.error('Error processes', error)
        })
    },
    iconColor (status) {
      return colors[status]
    }
  }
}
</script>

<style>
.list-workflows {
  overflow-y: auto;
  width: 100%;
}
</style>
