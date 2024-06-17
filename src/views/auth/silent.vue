<template>
  <div />
</template>

<script>
import Oidc from 'oidc-client'

export default {
  name: 'SilentItem',
  mounted() {
    new Oidc.UserManager().signinSilentCallback()
  }
}
</script>
