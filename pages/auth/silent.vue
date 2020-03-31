<template>
  <div />
</template>

<script>
  import Oidc from 'oidc-client'

  export default {
    mounted() {
      new Oidc.UserManager().signinSilentCallback()
    },
  }
</script>
