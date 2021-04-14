<template>
  <v-simple-table
    fixed-header
  >
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left data-table-th" v-for="header in tableHeaders" :key="header">
            {{header}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in tableItems"
          :key="item.name"
        >
          <td>{{ item.name }}</td>
          <td v-if="typeof item.value === 'object'">
            <v-list>
              <v-list-item v-for="(val, name) in item.value" :key="name">
                <v-list-item-content>
                  <v-list-item-title v-text="`${name}: ${val}`">
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </td>
          <td v-else >{{ item.value }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    tableHeaders: {
      required: true,
      type: Array
    },
    tableItems: {
      required: true,
      type: Array
    }
  }
}
</script>

<style>
.data-table-th {
  width: 50%;
}
</style>
