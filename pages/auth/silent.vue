<template>
  <div class="silent">
    <p>silent</p>
  </div>
</template>

<script>
import Oidc from 'oidc-client'

export default {
  mounted () {
    console.log('auth/silent')
    new Oidc.UserManager({ response_mode: 'query' }).signinRedirectCallback()
      .then((user) => { window.location = user.state })
      .catch((e) => { console.error(e) })
  }
}
</script>
