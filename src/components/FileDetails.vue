<template>
  <div class="file-details">
    <v-treeview hoverable :items="files">
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="!item.file">
        {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ 'mdi-file-document-outline' }}
      </v-icon>
    </template>
    <template slot="append" slot-scope="{item}">
      <v-btn color="primary" icon :href="downloadUrl(item)">
        <v-icon dark>
          mdi-cloud-download-outline
        </v-icon>
      </v-btn>
    </template>
  </v-treeview>
  </div>
</template>

<script>
export default {
  props: {
    files: {
      type: Array
    }
  },
  methods: {
    downloadUrl (file) {
      // Compose url to backend endpoint (this will be redirected to bucket)
      return `${process.env.VUE_APP_EDITOR_SERVER}/files/${file.name}`
    }
  }
}
</script>

<style lang="css" scoped >

</style>
