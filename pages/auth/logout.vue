<template>
  <div class="logout">
    <p>logout</p>
  </div>
</template>

<script>
import Oidc from 'oidc-client'

export default {
  mounted () {
    console.log('auth/logout')
    new Oidc.UserManager().signinSilentCallback()
  }
}
</script>
