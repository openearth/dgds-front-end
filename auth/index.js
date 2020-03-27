import Oidc from 'oidc-client'
import oidcSettings from './config'

Oidc.Log.logger = console
Oidc.Log.level = Oidc.Log.WARN

const auth = new Oidc.UserManager(oidcSettings)

auth.events.addUserLoaded(() => {
  console.log('User loaded')
})

auth.events.addAccessTokenExpiring(() => {
  console.log('Token expiring')
})

auth.events.addAccessTokenExpired(() => {
  console.log('Token expired')
})

auth.events.addSilentRenewError(() => {
  console.error('Renew went wrong')
})

export default auth
