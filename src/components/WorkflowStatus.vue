<template>
  <div class="workflow-status pa-3 d-flex flex-column">
    <h2 class="h3 mb-3 justify-start">
      Workflow details for job: {{ jobDetails.title }}
    </h2>
    <data-table items :tableHeaders="tableHeaders" :tableItems="detailItems"/>
    <div v-if="jobDetails.status === 'successful'">
      <h2 class="mt-4">
        Model results
      </h2>
      <data-table items :tableHeaders="tableHeaders" :tableItems="resultItems"/>
      <h2 class="mt-4">
        Result files from bucket
      </h2>
      <file-details :files="files"/>
    </div>
  </div>
</template>

<script>
import DataTable from '@/components/DataTable'
import FileDetails from '@/components/FileDetails'
export default {
  data () {
    return {
      jobDetails: [],
      tableHeaders: ['Name', 'Value'],
      detailItems: [],
      resultItems: [],
      jobResults: [],
      files: []
    }
  },
  components: {
    DataTable,
    FileDetails
  },
  mounted () {
    this.fetchJobDetails()
    this.fetchJobResults()
  },
  methods: {
    jobDataUrl () {
      if (this.jobResults.s3path) {
        const s3path = this.jobResults.s3path.replace('/', '%2F')
        return `/data/${s3path}`
      } else {
        return null
      }
    },
    fetchJobDetails () {
      fetch(
        `${process.env.VUE_APP_EDITOR_SERVER}/processes/hydromt/jobs/${this.$route.params.jobId}`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.jobDetails = data
          this.detailItems = []
          Object.entries(data).forEach(val => {
            this.detailItems.push({
              value: val[1],
              name: val[0]
            })
          })
          if (this.jobDetails.status === 'successful') {
            this.showResultFiles()
          }
        })
        .catch(error => {
          console.error('Error fetching job per process_id', error)
        })
    },
    fetchJobResults () {
      // Retrieve the results of the workflow - only available when workflow is finished
      fetch(
        `${process.env.VUE_APP_EDITOR_SERVER}/processes/hydromt/jobs/${this.$route.params.jobId}/results`,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.jobResults = data
          this.resultItems = []

          Object.entries(data).forEach(val => {
            this.resultItems.push({
              value: val[1],
              name: val[0]
            })
          })
        })
        .catch(error => {
          console.error('Error fetching job per process_id', error)
        })
    },
    showResultFiles () {
    // Retrieve liste of result output files from the buvket by result s3path
      // const url = `${process.env.VUE_APP_EDITOR_SERVER}/files?prefix=${this.resultItems.s3path}`
      const url = `${process.env.VUE_APP_EDITOR_SERVER}/files`

      return fetch(
        url,
        {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(response => {
          return response.json()
        })
        .then(data => {
          this.files = []
          data.forEach((file, index) => {
            this.files.push({ id: index, name: file, file: true })
          })
        })
        .catch(error => {
          console.error('Error fetching files', error)
        })
    }
  }
}
</script>

<style>
</style>
