<template>
  <div class="callback">
    <p>callback</p>
  </div>
</template>

<script>
import Oidc from 'oidc-client'

export default {
  mounted () {
    console.log('auth/callback')
    new Oidc.UserManager({ response_mode: 'query' }).signinRedirectCallback()
      .then((user) => { window.location = user.state })
      .catch((e) => { console.error(e) })
  }
}
</script>
