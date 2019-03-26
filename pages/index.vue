<template>
  <section
    v-mapbox="{
      style: style,
    }"
    class="container"
  ></section>
</template>

<script>
export default {
  data: () => ({
    style: 'light',
  }),
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
}
</style>
